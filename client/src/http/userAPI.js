import {$authHost, $host} from './indexHttp'
import jwtDecode from 'jwt-decode'

export const registration = async (login, password, userTypeId) => {
    const {data} = await $host.post('api/user/registration', {login, password, userTypeId})
    return data
}

export const login = async (login, password) => {
    const {data} = await $host.post('api/user/login', {login, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}