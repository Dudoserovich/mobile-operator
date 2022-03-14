import {makeAutoObservable} from 'mobx'

export default class subscriberGlobal {
    constructor() {
        this._subInfo = {}
        makeAutoObservable(this)
    }

    setSubInfo(info) {
        this._subInfo = info
    }

    get subInfo() {
        return this._subInfo
    }
}