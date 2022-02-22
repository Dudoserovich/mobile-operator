import {makeAutoObservable} from 'mobx'

export default class ClientGlobal {
    constructor() {
        this._currentClient = {}
        this._subscribers = []
        this._clients = []
        makeAutoObservable(this)
    }

    setClients(s) {
        this._clients = s
    }

    get clients() {
        return this._clients
    }

    setSubscribers(s) {
        this._subscribers = s
    }

    get subscribers() {
        return this._subscribers
    }

    setClient(client) {
        this._currentClient = client
    }

    get client() {
        return this._currentClient
    }
}
