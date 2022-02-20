const {Client} = require('../models/models')
const ApiError = require('../error/ApiError')

class ClientController {
    async getOne(req, res, next) {
        const {passport} = req.body
        const client = await Client.findOne({where: {passport}})
        if (!client) {
            return next(ApiError.badRequest('Такой клиент не зарегистрирован'))
        }

    }
}