const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkUserType = require('../middleware/checkUserTypeMiddleware')

router.post('/registration', /*checkUserType(1),*/ userController.registration)
router.post('/login', userController.login)
router.post('/findManagerAndSalesman', userController.findManagerAndSalesman)

router.get('/auth', authMiddleware, userController.check)
router.get('/managerAndSalesman', userController.getAllManagerAndSalesman)
router.get('/:id', userController.getOne)

router.delete('/deleteUser/:id', userController.deleteUser)

router.put('/change', userController.changeUser)

module.exports = router