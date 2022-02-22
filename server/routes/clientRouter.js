const Router = require('express')
const router = new Router()
const clientController = require('../controllers/clientController')

// router.get('/', clientController.getAll)
// router.post('/', clientController.create)
// router.delete('/', )

router.get('/:passport', clientController.getOne)
router.post('/', clientController.create)
router.post('/find', clientController.findAll)

module.exports = router
