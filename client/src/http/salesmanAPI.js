import {$authHost, $host} from './indexHttp'

export const getOneClient = async (passport) => {
    const {data} = await $host.get('api/client/' + passport)
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

export const findAllClients = async (passport) => {
    const {data} = await $host.post('api/client/find', {passport})
    return data
}

export const allTariffs = async (name) => {
    const {data} = await $host.post('api/tariff/findAll', {name})
    //console.log(data)
    return data
}

export const changeClient = async (passport,
                                         newPassport,
                                         full_name,
                                         date_of_birth,
                                         registrationPlace, oldRegistrationPlace) => {
    const {data} = await $host.put('api/client/change', {
        passport,
        newPassport,
        full_name,
        date_of_birth,
        registrationPlace,
        oldRegistrationPlace
    })
    return data
}

export const findAllPhones = async (phone) => {
    const {data} = await $host.post('api/salesman/phones', {phone})
    return data
}

export const findAllSub = async (passport) => {
    const {data} = await $host.post('api/salesman/sub', {passport})
    return data
}

export const createNewSub = async (passport,
                                full_name,
                                date_of_birth,
                                registrationPlace,
                                account,
                                phone_number) => {
    const {data} = await $host.post('api/salesman/createSub', {passport,
        full_name,
        date_of_birth,
        registrationPlace,
        account,
        phone_number})
    return data
}

export const deleteSub = async (account) => {
    const {data} = await $authHost.delete('api/salesman/sub/' + account)
    return data
}