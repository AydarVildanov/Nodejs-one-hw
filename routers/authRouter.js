const Router = require('express')
const router = new Router
const authController = require('../controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const createPostMiddleware = require('../middlewares/createPostMiddleware')

router.post('/registration', [
    check('username', "Can't create User this empty Username").notEmpty(),
    check('password', "Password must be 4 to 10 symbols length").isLength({min: 4, max: 10})
], authController.registration)
router.post('/login', authController.login)
router.post('/posts', createPostMiddleware, authController.createPost)
router.get('/users', authMiddleware, authController.getUsers)

module.exports = router
