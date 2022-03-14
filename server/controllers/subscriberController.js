const ApiError = require('../error/ApiError')
const {Subscriber, PhoneNumber, Client, User, Tariff} = require("../models/models")

class SubscriberController {
    async getAll(req, res) {
        const subscribers = await Subscriber.findAll()
        return res.json(subscribers)
    }

    async create(req, res) {}

    async getOne(req, res, next) {
        const {phone_number} = req.params

        const phone = await PhoneNumber.findOne({where: {phone_number}})
        const account = phone.dataValues.subscriberAccount
        const sub = await Subscriber.findOne({where: {account}})
        const passport = sub.dataValues.clientPassport
        const client = await Client.findOne({where: {passport}})

        sub.dataValues.full_name = client.dataValues.full_name
        sub.dataValues.phone_number = phone_number

        return res.json(sub)
    }

    async changePassword(req, res, next) {
        const {login, newPassword} = req.body
        const user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.badRequest('Нет такого пользователя!'))
        }

        if (user.dataValues.password === newPassword)
            return next(ApiError.badRequest('Пароль не изменён!'))
        else {
            const newUser = await User.update({
                password: newPassword
            }, {
                where: {login}
            })
            return next(ApiError.badRequest('Пароль успешно изменён!'))
        }
    }

    async refilBalance(req, res, next) {
        const {phone_number, filBalance} = req.body

        const phone = await PhoneNumber.findOne({where: {phone_number}})
        const account = phone.dataValues.subscriberAccount

        const helpSub = await Subscriber.findOne({where: {account}})
        //console.log(typeof helpSub.dataValues.balance)
        //console.log(typeof filBalance)
        const newBalance = parseFloat(helpSub.dataValues.balance) + filBalance
        //console.log(newBalance)
        const sub = await Subscriber.update(
            {balance: newBalance},
            {where: {account}}
        )

        return next(ApiError.badRequest('Баланс успешно пополнен'))
        //return res.json(sub)
    }

    async changeTariff(req, res, next) {
        const {phone_number, nameTariff} = req.body

        const phone = await PhoneNumber.findOne({where: {phone_number}})
        const account = phone.dataValues.subscriberAccount

        const helpSub = await Subscriber.findOne({where: {account}})

        const newTariff = await Tariff.findOne({ where: {name: nameTariff}})

        if (helpSub.dataValues.tariffName !== nameTariff) {
            const sub = await Subscriber.update(
                {tariffName: nameTariff,
                    balance: parseFloat(helpSub.dataValues.balance) - parseFloat(newTariff.dataValues.subscription_fee)
                },
                {where: {account}}
            )
            return next(ApiError.badRequest('Тариф изменён'))
        } else {
            return next(ApiError.badRequest('Тариф не изменён'))
        }
        //return res.json(sub)
    }
}

module.exports = new SubscriberController()
