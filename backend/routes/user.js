const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')
const { userValidationRules, isDataValid } = require('../middlewares/validator')


router.post('/signup', userValidationRules(), isDataValid, userCtrl.signup)
router.post('/login', userValidationRules(), isDataValid,userCtrl.login)

module.exports = router