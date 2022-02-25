const {Client, RegistrationPlace, Subscriber} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");

class ClientController {
    async getOne(req, res, next) {
        const {passport} = req.params
        const client = await Client.findOne({where: {passport}})
        if (!client) {
            return next(ApiError.badRequest('Такой клиент не зарегистрирован'))
        }
        const subscribers = await Subscriber.findAll({where: {clientPassport: passport}})
        return res.json({client, subscribers})
    }

    async findAll(req, res, next) {
        const {passport} = req.body
        const client = await Client.findOne({
            where: {
                passport: {
                    [Op.eq]: [passport]
                }
            }
        })
        if (!client) {
            return res.json([])
        }
        const regPlace = await RegistrationPlace.findOne({where: {id: client.registrationPlaceId}})
        const subscribers = await Subscriber.findAll({where: {clientPassport: passport}})
        client.dataValues.reg = regPlace.registration_place
        client.dataValues.subs = subscribers

        return res.json([client])
    }

    async create(req, res, next) {
        const {
            passport,
            full_name,
            date_of_birth,
            registrationPlace
        } = req.body
        const client = await Client.findOne({where: {passport}})
        if (client) {
            return next(ApiError.badRequest('Такой клиент уже зарегистрирован'))
        }
        let regPlace = await RegistrationPlace.findOne({where: {registration_place: registrationPlace}})
        if (!regPlace) {
            await RegistrationPlace.create({registration_place: registrationPlace})
            regPlace = await RegistrationPlace.findOne({where: {registration_place: registrationPlace}})
        }
        await Client.create({
            passport,
            full_name,
            date_of_birth,
            registrationPlaceId: regPlace.id
        })
        return res.json({message: 'Клиент успешно создан'})
    }
}

module.exports = new ClientController()
