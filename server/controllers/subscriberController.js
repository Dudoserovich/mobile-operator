const ApiError = require('../error/ApiError')
const {Subscriber} = require("../models/models")

class SubscriberController {
    async getAll(req, res) {
        const subscribers = await Subscriber.findAll()
        return res.json(subscribers)
    }

    async create(req, res) {}

    async getOne(req, res, next) {
        // const {passport} = req.body
        // const client = Client.findOne({where: {passport}})
        // if (!client) {
        //     return next(ApiError.badRequest('Клиетн не зарегистрирован'))
        // }
        // return res.json(client)
    }
}

module.exports = new SubscriberController()
