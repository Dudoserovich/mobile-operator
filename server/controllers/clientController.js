const {Client, RegistrationPlace} = require('../models/models')
const ApiError = require('../error/ApiError')

class ClientController {
    async getOne(req, res, next) {
        const {passport} = req.params
        const client = await Client.findOne({where: {passport}})
        if (!client) {
            return next(ApiError.badRequest('Такой клиент не зарегистрирован'))
        }
        return res.json(client)
    }

    async create(req, res, next) {
        const {
            passport,
            full_name,
            date_of_birth,
            registrationPlace
        } = req.body
        const client = await Client.findOne({where: {passport}})
        console.log(client)
        console.log('shit before if')
        if (client) {
            console.log('есть ебучий клиент')
            return next(ApiError.badRequest('Такой клиент уже зарегистрирован'))
        }
        console.log('shit after if')
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
