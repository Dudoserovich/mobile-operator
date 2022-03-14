const Router = require('express')
const router = new Router()
const salesmanController = require('../controllers/salesmanController')

router.post('/phones', salesmanController.getPhones)
router.post('/sub', salesmanController.getSub)
router.post('/createSub', salesmanController.createSub)
router.delete('/sub/:account', salesmanController.delSub)

module.exports = router