const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const tariffRouter = require('./tariffRouter')
const userTypeRouter = require('./userTypeRouter')
const clientRouter = require('./clientRouter')
const salesmanRouter = require('./salesmanRouter')
const subscriberRouter = require('./subscriberRouter')

router.use('/tariff', tariffRouter)
router.use('/user', userRouter)
router.use('/user-type', userTypeRouter)
router.use('/client', clientRouter)
router.use('/salesman', salesmanRouter)
router.use('/subscriber', subscriberRouter)

module.exports = router
