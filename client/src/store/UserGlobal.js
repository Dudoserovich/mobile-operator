import {makeAutoObservable} from 'mobx'

export default class UserGlobal {
    constructor() {
        this._isAuth = false
        this._typeId = null
        this._login = null
        this._downloadedUsers = []
        this._user = {}
        makeAutoObservable(this)
    }

    setDownloadedUsers(users) {
        this._downloadedUsers = users
    }

    get downloadedUsers() {
        return this._downloadedUsers
    }

    setLogin(name) {
        this._login = name
    }

    get login() {
        return this._login
    }

    setTypeId(typeId) {
        this._typeId = typeId
    }

    get typeId() {
        return this._typeId
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    get isAuth() {
        return this._isAuth
    }

    setUser(user) {
        this._user = user
    }

    get user() {
        return this._user
    }
}