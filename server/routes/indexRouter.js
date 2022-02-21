const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const tariffRouter = require('./tariffRouter')
const userTypeRouter = require('./userTypeRouter')
const clientRouter = require('./clientRouter')

router.use('/tariff', tariffRouter)
router.use('/user', userRouter)
router.use('/user-type', userTypeRouter)
router.use('/client', clientRouter)

module.exports = router
