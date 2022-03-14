const Router = require('express')
const router = new Router()
const subscriberController = require('../controllers/subscriberController')

router.get('/', subscriberController.getAll)
router.get('/:phone_number', subscriberController.getOne)
router.post('/', subscriberController.create)
router.post('/pass', subscriberController.changePassword)
router.post('/balance', subscriberController.refilBalance)
router.post('/tariff', subscriberController.changeTariff)
router.delete('/', )

module.exports = router