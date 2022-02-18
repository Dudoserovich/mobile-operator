const ApiError = require('../error/ApiError')
const {Subscriber} = require("../models/models")

class SubscriberController {
    async getAll(req, res) {
        const subscribers = await Subscriber.findAll()
        return res.json(subscribers)
    }

    async create(req, res) {}

    async getOne(req, res, next) {

    }
}

module.exports = new SubscriberController()