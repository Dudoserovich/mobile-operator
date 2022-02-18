const Router = require('express')
const router = new Router()
const subscriberController = require('../controllers/subscriberController')

router.get('/', subscriberController.getAll)
router.post('/', subscriberController.create)
router.delete('/', )

module.exports = router