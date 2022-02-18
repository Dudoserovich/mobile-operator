const ApiError = require('../error/ApiError')
const {UserType} = require("../models/models")

class SubscriberController {
    async getAll(req, res) {
        const userType = await UserType.findAll()
        return res.json(userType)
    }

    async create(req, res, next) {
        const { user_type } = req.body
        let userType = await UserType.findOne({where: {user_type}})
        if (userType) {
            return next(ApiError.badRequest(`Тип пользователя ${user_type} уже существует`))
        }
        userType = await UserType.create({user_type})
        return res.json({userType})
    }
}

module.exports = new SubscriberController()