const express = require('express')
const router = express.Router()

const multerHandleUpload = require('../middlewares/multer-config')
const auth = require('../middlewares/auth')
const sauceAuthz = require('../middlewares/sauceAuthz')
const saucesCtrl = require('../controllers/sauces')
const { sauceRules, isSauceValid } = require('../middlewares/sauceValidator')
const parseSauce = require('../middlewares/parseSauce')

router.get('/sauces', auth, saucesCtrl.getAllSauces)
router.get('/sauces/:id', auth, saucesCtrl.getOneSauce)
router.post('/sauces', auth, multerHandleUpload, parseSauce, sauceRules(), isSauceValid, saucesCtrl.uploadSauce)
router.put('/sauces/:id', auth, sauceAuthz, multerHandleUpload, parseSauce, sauceRules(), isSauceValid, saucesCtrl.modifySauce)
router.delete('/sauces/:id', auth, sauceAuthz, saucesCtrl.deleteSauce)
router.post('/sauces/:id/like', auth, saucesCtrl.like)


module.exports = router