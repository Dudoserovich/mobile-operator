const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const tariffRouter = require('./tariffRouter')
const userTypeRouter = require('./userTypeRouter')

// router.use('/client')
// router.use('/subscriber')
router.use('/tariff', tariffRouter)
router.use('/user', userRouter)
router.use('/user-type', userTypeRouter)

module.exports = router