const ApiError = require('../error/ApiError')
const {Tariff} = require('../models/models')
const {Op} = require('sequelize')

class TariffController {
    async create(req, res, next) {
        const {
            name,
            subscription_fee,
            internet_traffic,
            minutes,
            sms
        } = req.body

        if (!name || !subscription_fee || !internet_traffic || !minutes || !sms) {
            return next(ApiError.badRequest('Не все поля заполнены!'))
        }
        if (internet_traffic === -1) {
            '-1.00'
        }
        const tariff = await Tariff.create({
            name,
            subscription_fee,
            internet_traffic,
            minutes,
            sms
        })
        return res.json(tariff)
    }

    async getAll(req, res) {
        const tariffs = await Tariff.findAll()
        return res.json(tariffs)
    }

    async getOne(req, res, next) {
        const {name} = req.params
        const tariff = await Tariff.findOne({where: {name}})
        if (!tariff) {
            return next(ApiError.badRequest('Нет такого тарифа!'))
        }
        return res.json(tariff)
    }

    async findTariff(req, res) {
        const {name} = req.body
        const tariffs = await Tariff.findAll({
            where: {
                name: {
                    [Op.substring]: [name]
                }
            }
        })
        return res.json(tariffs)
    }

    async delete(req, res, next) {
        const {name} = req.params
        const tariff = await Tariff.findOne({where: {name}})
        if (!tariff) {
            return next(ApiError.badRequest('Не верное название тарифа!'))
        }
        await tariff.destroy()
        return res.json({message: `Тарифф ${name} успешно удален`})
    }

    async change(req, res, next) {
        const {name, newName, newSubscriptionFee, newInternetTraffic, newMinutes, newSms} = req.body
        const tariff = await Tariff.findOne({where: {name}})
        if (!tariff) {
            return next(ApiError.badRequest('Нет тарифа с таким названием!'))
        }
        newInternetTraffic === -1 ? '-1.00' : newInternetTraffic
        const newTariff = await Tariff.update({
            name: newName,
            subscription_fee: newSubscriptionFee,
            internet_traffic: newInternetTraffic,
            minutes: newMinutes,
            sms: newSms
        }, {
            where: {name}
        })
        return res.json({message: 'Тарифф обновлен!'})
    }
}

module.exports = new TariffController()
