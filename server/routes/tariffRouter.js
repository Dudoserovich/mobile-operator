const Router = require('express')
const router = new Router()
const tariffController = require('../controllers/tariffController')

router.get('/', tariffController.getAll)
router.get('/:name', tariffController.getOne)

router.post('/', tariffController.create)
router.post('/findTariff', tariffController.findTariff)

router.delete('/:name', tariffController.delete)

router.put('/change', tariffController.change)

module.exports = router