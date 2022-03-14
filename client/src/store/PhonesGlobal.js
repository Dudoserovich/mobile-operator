import {makeAutoObservable} from 'mobx'

export default class Phones {
    constructor() {
        this._phones = []
        makeAutoObservable(this)
    }

    setPhones(s) {
        this._phones = s
    }

    get phones() {
        return this._phones
    }
}