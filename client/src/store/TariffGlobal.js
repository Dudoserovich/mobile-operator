import {makeAutoObservable} from 'mobx'

export default class TariffGlobal {
    constructor() {
        this._tariffs = []
        makeAutoObservable(this)
    }

    setTariffs(tariffs) {
        this._tariffs = tariffs
    }

    get tariffs() {
        return this._tariffs
    }
}