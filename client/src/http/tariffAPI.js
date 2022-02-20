import {$authHost, $host} from './indexHttp'

export const createTariff = async (name,
                                   subscription_fee,
                                   internet_traffic,
                                   minutes,
                                   sms) => {
    const {data} = await $authHost.post('api/tariff', {
        name,
        subscription_fee,
        internet_traffic,
        minutes,
        sms
    })
    return data
}

export const deleteTariff = async (name) => {
    const {data} = await $authHost.delete('api/tariff/' + name)
    return data
}

export const getAllTariffs = async () => {
    const {data} = await $host.get('api/tariff')
    return data
}

export const getTariff = async (name) => {
    const {data} = await $host.get('api/tariff/' + name)
    return data
}

export const findTariffs = async (name) => {
    const {data} = await $host.post('api/tariff/findTariff', {name})
    return data
}

export const changeTariff = async (name,
                                   newName,
                                   newSubscriptionFee,
                                   newInternetTraffic,
                                   newMinutes,
                                   newSms) => {
    const {data} = await $host.put('api/tariff/change', {
        name,
        newName,
        newSubscriptionFee,
        newInternetTraffic,
        newMinutes,
        newSms
    })
    return data
}