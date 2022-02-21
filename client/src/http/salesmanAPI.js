import {$authHost, $host} from './indexHttp'

export const getOneClient = async (passport) => {
    const {data} = await $host.get('api/client/' + passport)
    console.log(data)
    return data
}

export const createClient = async (passport,
                                   full_name,
                                   date_of_birth,
                                   registrationPlace) => {
    const {data} = await $host.post('api/client/', {passport,
        full_name,
        date_of_birth,
        registrationPlace})
    return data
}
