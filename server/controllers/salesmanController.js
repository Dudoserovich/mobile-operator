const ApiError = require('../error/ApiError')
const {Client, Subscriber, PhoneNumber, RegistrationPlace, User} = require("../models/models")
const {Op} = require("sequelize");

class SalesmanController {
    async getOne(req, res, next) {
        const {passport} = req.body
        const client = await Client.findOne({where: {passport}})
        if (!client) {
            return next(ApiError.badRequest('Нет такого клиента!'))
        } else {
            const subscribers = await Subscriber.findAll({where: {clientPassport: passport}})
            if (subscribers)
                return res.json({
                    passport,
                    subscribers
                })
            else return next(ApiError.badRequest('У клиента нет абонентов!'))
        }
    }

    async getSub(req, res, next) {
        const {passport} = req.body
        const subscriber = await Subscriber.findAll({where: {clientPassport: passport}})
        if (!subscriber) {
            return []/*next(ApiError.badRequest('Нет похожих свободных номеров!'))*/
        } else {
            return res.json(subscriber)
        }
    }

    async getPhones(req, res, next) {
        const {phone} = req.body
        const phoneNumber = await PhoneNumber.findAll({
            where: {
                phone_number: {
                    [Op.like]: phone + '%'
                }, subscriberAccount: null
            }
        })
        if (!phoneNumber) {
            return []/*next(ApiError.badRequest('Нет похожих свободных номеров!'))*/
        } else {
            return res.json(phoneNumber)
        }
    }

    async createSub(req, res, next) {
        const {
            passport,
            full_name,
            date_of_birth,
            registrationPlace,
            account,
            phone_number
        } = req.body

        //let regPlace = await RegistrationPlace.findOne({where: {registration_place: registrationPlace}})

        //console.log("Регистрация: " + registrationPlace)

        let findReg = await RegistrationPlace.findOne({where: {registration_place: registrationPlace}})

        if (!findReg) {
            findReg = await RegistrationPlace.create({registration_place: registrationPlace})
            console.log(findReg)
        }

        let client = await Client.findOne({
            where: {
                passport, full_name,
                registrationPlaceId: findReg.dataValues.id
            }
        })

        if (!client) {
            // добавляем клиента, без return
            client = await Client.create({
                passport,
                full_name,
                date_of_birth,
                registrationPlaceId: findReg.dataValues.id
            })
        }

        // добавляем абонента
        const findSub = await Subscriber.findOne({where: {account}})

        if (!findSub) {
            const countAllSub = await Subscriber.count({where: {clientPassport: passport}})

            let minusBalance = false
            const allSub = await Subscriber.findAll({where: {clientPassport: passport}})
            allSub.forEach(s => {
                if (s.dataValues.balance < 0)
                    minusBalance = true
            })

            if (minusBalance)
                return next(ApiError.badRequest('На данного клиента ' +
                    'зарегистрирован(ы) клиент(ы) с задолжностью'))

            //console.log(countAllSub)
            if (countAllSub < 5) {
                const selectNumber = await PhoneNumber.findOne({where: {phone_number, subscriberAccount: null}})
                if (selectNumber) {
                    const sub = await Subscriber.create({
                        account,
                        clientPassport: passport
                    })
                    await PhoneNumber.update({
                            subscriberAccount: account
                        },
                        {
                            where: {phone_number}
                        }
                    )

                    await User.create({
                        login: phone_number,
                        password: account,
                        userTypeId: 4
                    })

                } else {
                    return next(ApiError.badRequest('Выбранный номер не найден!'))
                }
            } else {
                return next(ApiError.badRequest('На данного клиента уже зарегистрировано ' +
                    'максимальное количество абонентов (5)'))
            }
        } else {
            return next(ApiError.badRequest('Такой абонентский счёт уже ' +
                'зарегистрирован на другого абонента'))
        }

        client.dataValues.account = account;
        client.dataValues.phone_number = phone_number;

        return res.json(client)
    }

    async delSub(req, res, next) {
        const {account} = req.params

        const sub = await Subscriber.findOne({where: {account}})

        if (sub.dataValues.balance < 0)
            return res.json({message: `На данном абонентском счёте отрицательный баланс, \nпоэтому удаление абонента невозможно`})

        if (sub) {
            const phone = await PhoneNumber.findOne({where: {subscriberAccount: account}})
            await PhoneNumber.update({subscriberAccount: null},
                {where: {subscriberAccount: account}}
            )
            await sub.destroy()

            const user = await User.findOne({where: {login: phone.dataValues.phone_number}})
            await user.destroy()

            return res.json({message: `Абонент удалён из системы`})
        } else {
            return next(ApiError.badRequest('Такой абонентский счёт не найден в системе'))
        }
    }

}

module.exports = new SalesmanController()
