import {$authHost, $host} from './indexHttp'

export const getOneClient = async (name) => {
    const {data} = await $host.get('api/tariff/' + name)
    return data
}