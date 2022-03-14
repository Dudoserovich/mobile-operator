const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    login: {type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true},
    password: {type: DataTypes.STRING, allowNull: false}
}, {
    timestamps: false
})

const UserType = sequelize.define('user_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_type: {type: DataTypes.STRING, unique: true}
}, {
    timestamps: false
})

// поменяй на string
const PhoneNumber = sequelize.define('phone_number', {
    phone_number: {type: DataTypes.STRING, primaryKey: true}
}, {
    timestamps: false
})

const Subscriber = sequelize.define('subscriber', {
    account: {type: DataTypes.CHAR(20), primaryKey: true},
    balance: {type: DataTypes.DECIMAL(8,2), defaultValue: 0.00}
}, {
    timestamps: false
})

const Tariff = sequelize.define('tariff', {
    name: {type: DataTypes.STRING, primaryKey: true},
    subscription_fee: {type: DataTypes.SMALLINT},
    internet_traffic: {type: DataTypes.DECIMAL(4,2), defaultValue: 0.00},
    minutes: {type: DataTypes.SMALLINT},
    sms: {type: DataTypes.SMALLINT}
}, {
    timestamps: false
})

const Client = sequelize.define('client', {
    passport: {type: DataTypes.STRING, primaryKey: true},
    full_name: {type: DataTypes.STRING},
    date_of_birth: {type: DataTypes.DATE}
}, {
    timestamps: false
})

const RegistrationPlace = sequelize.define('registration_place', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    registration_place: {type: DataTypes.STRING}
}, {
    timestamps: false
})


UserType.hasMany(User)
User.belongsTo(UserType)

Subscriber.hasOne(PhoneNumber)
PhoneNumber.belongsTo(Subscriber)

Tariff.hasMany(Subscriber)
Subscriber.belongsTo(Tariff)

Client.hasMany(Subscriber)
Subscriber.belongsTo(Client)

RegistrationPlace.hasMany(Client)
Client.belongsTo(RegistrationPlace)


module.exports = {
    User,
    UserType,
    Client,
    PhoneNumber,
    Subscriber,
    Tariff,
    RegistrationPlace
}
