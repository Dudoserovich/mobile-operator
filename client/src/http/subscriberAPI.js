import {$authHost, $host} from './indexHttp'

export const getSubInfo = async (phone_number) => {
    const {data} = await $authHost.get('api/subscriber/' + phone_number)
    return data
}

export const changePassword = async (login, newPassword) => {
    const {data} = await $authHost.post('api/subscriber/pass', {login, newPassword})
    return data
}

export const refilBal = async (phone_number, filBalance) => {
    const {data} = await $authHost.post('api/subscriber/balance', {phone_number, filBalance})
    return data
}

export const changeTariff = async (phone_number, nameTariff) => {
    const {data} = await $authHost.post('api/subscriber/tariff', {phone_number, nameTariff})
    return data
}