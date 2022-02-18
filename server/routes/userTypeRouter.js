const Router = require('express')
const router = new Router()
const userTypeController = require('../controllers/userTypeController')
const checkUserType = require('../middleware/checkUserTypeMiddleware')

router.get('/', userTypeController.getAll)
router.post('/', userTypeController.create)
router.delete('/', )

module.exports = router