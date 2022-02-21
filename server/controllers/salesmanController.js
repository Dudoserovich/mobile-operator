const ApiError = require('../error/ApiError')
const {Client, Subscriber} = require("../models/models")

class SalesmanController {
    async getOne(req, res, next) {
        const {passport} = req.body
        const client = await Client.findOne({where: {passport}})
        if (!client) {
            return next(ApiError.badRequest('Нет такого клиента!'))
        }
        const subscribers = await Subscriber.findAll({where: {clientPassport: passport}})
        return res.json({
            passport,
            subscribers
        })
    }

    async createClient(req, res, next) {
        const {
            passport,
            full_name,
            date_of_birth,
            registrationPlace
        } = req.body
        let client = await Client.findOne({where: passport})
        if (client) {
            return next(ApiError.badRequest('Уже является клиентом'))
        }
        client = await Client.create({
            passport,
            full_name,
            date_of_birth,
            registrationPlace
        })
        return res.json(client)
    }

    async updateClient(req, res, next) {
        const {
            passport,
            full_name,
            date_of_birth,
            registrationPlace
        } = req.body

    }
}

module.exports = new SalesmanController()
