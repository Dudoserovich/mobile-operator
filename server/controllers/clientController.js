const {Client, RegistrationPlace, Subscriber, Tariff} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");
const {log} = require("nodemon/lib/utils");

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
        //console.log(passport)
        if (!passport || passport === ' ')
            return res.json([])
        const client = await Client.findOne({
            where: {
                passport/*: {
                    [Op.eq]: [passport]
                }*/
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

    async change(req, res, next) {
        const {
            passport,
            newPassport,
            full_name,
            date_of_birth,
            registrationPlace,
            oldRegistrationPlace
        } = req.body
        /*const bigPass = BigInt(passport)*/
        const client = await Client.findOne({where: {passport/*: bigPass*/}})

        if (!client) {
            return next(ApiError.badRequest('Изменяемый клиент не найден'))
        }

        let findNewReg = await RegistrationPlace.findOne({where: {registration_place: registrationPlace}})
        const findReg = await RegistrationPlace.findOne({where: {registration_place: oldRegistrationPlace}})
        //console.log(findReg.dataValues.id)
        //console.log(findNewReg.dataValues.id)
        console.log("РЕГИСТРАЦИЯ: " + registrationPlace)

        let c = await Client.findOne({
                where: {
                    passport: newPassport,
                    full_name,
                    registrationPlaceId: findNewReg ? findNewReg.dataValues.id : 0
                }
            }
        )

        console.log(c)

        if (!c) {
            if (!findNewReg) {
                findNewReg = await RegistrationPlace.create({registration_place: registrationPlace})
                console.log(findNewReg)
            }
            const newClient = await Client.update({
                full_name,
                date_of_birth,
                registrationPlaceId: findNewReg.dataValues.id,
                passport: newPassport
            }, {
                where: {passport/*: bigPass*/}
            })
            return res.json(newClient)
        } else
            next(ApiError.badRequest(`Клиент ${full_name} не изменён`))
    }
}

module.exports = new ClientController()
