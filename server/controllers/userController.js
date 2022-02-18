const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')
const {Op} = require('sequelize')

const generateJwt = (login, userTypeId) => {
    return jwt.sign({login, userTypeId}, process.env.SECRET_KEY, {expiresIn: '6h'})
}

class UserController {
    async registration(req, res, next) {
        const {login, password, userTypeId} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest('Некорректный логин или пароль'))
        }
        const candidate = await User.findOne({where: {login}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким логином уже существует'))
        }
        const user = await User.create({login, password, userTypeId})
        return res.json(user)
    }

    async login(req, res, next) {
        const {login, password} = req.body
        const user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.badRequest('Не верный логин или пароль'))
        }
        let comparePassword = password === user.password
        if (!comparePassword) {
            return next(ApiError.badRequest('Не верный логин или пароль'))
        }
        const token = generateJwt(user.login, user.userTypeId)
        return res.json({token})
    }

    async check(req, res) {
        const token = generateJwt(req.user.login, req.user.userTypeId)
        return res.json({token})
    }

    async getAllManagerAndSalesman(req, res) {
        const data = await User.findAll({where: {userTypeId: {[Op.or]: [2, 3]}}})
        return res.json(data)
    }

    async findManagerAndSalesman(req, res) {
        const {login, userTypeId} = req.body
        console.log(login, userTypeId)
        let type = userTypeId
        let data
        if (userTypeId === '') {
            type = [2, 3]
            data = await User.findAll({
                where: {
                    login: {
                        [Op.substring]: [login]
                    },
                    userTypeId: {
                        [Op.or]: type
                    }
                }
            })
        } else {
            data = await User.findAll({
                where: {
                    login: {
                        [Op.substring]: [login]
                    },
                    userTypeId
                }
            })
        }

        return res.json(data)
    }

    async deleteUser(req, res, next) {
        const {id} = req.params
        const user = await User.findOne({where: {login: id}})
        if (!user) {
            return next(ApiError.badRequest('Нет такого пользователя!'))
        }
        await user.destroy()
        return res.json({message: `Пользователь ${id} успешно удален`})
    }

    async getOne(req, res, next) {
        const {id} = req.params
        const user = await User.findOne({where: {login: id}})
        if (!user) {
            return next(ApiError.badRequest('Нет такого пользователя!'))
        }
        return res.json(user)
    }

    async changeUser(req, res, next) {
        const {login, newPassword, newUserTypeId, newLogin} = req.body
        const user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.badRequest('Нет такого пользователя!'))
        }
        const newUser = await User.update({
            login: newLogin,
            password: newPassword,
            userTypeId: newUserTypeId
        },{
            where: {login}
        })
        return res.json(newUser)
    }
}

module.exports = new UserController()

// user - люббой пользователь (админ?, менеджер, продовец-консультант(рег абонента))
// client -
// subscriber = абонент
// phone_number - у каждого абонента (один)
// tariff - принадлежит одному абонентскому счету (аккаунту)
// login - тн + аккаунт

// в лк -
