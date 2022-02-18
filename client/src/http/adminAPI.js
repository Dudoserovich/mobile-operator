import {$host} from './indexHttp'

export const getAllManagerAndSalesman = async () => {
    const {data} = await $host.get('api/user/managerAndSalesman')
    return data
}

export const findManagerAndSalesman = async (login, userTypeId) => {
    const {data} = await $host.post('api/user/findManagerAndSalesman', {login, userTypeId})
    return data
}

export const deleteUser = async (id) => {
    const {data} = await $host.delete('api/user/deleteUser/' + id)
    return data
}

export const getUser = async (id) => {
    const {data} = await $host.get('api/user/' + id)
    return data
}

export const changeUser = async (login, newLogin, newPassword, newUserTypeId) => {
    const {data} = await $host.put('api/user/change', {login, newLogin, newPassword, newUserTypeId})
    return data
}