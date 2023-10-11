const express = require('express')
const { registerUser, loginUser, logout, forgotPassword, resetPassword, userDetail } = require('../controllers/user')
const { authentificationMid } = require('../middlewares/auth')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logout)
router.post('/forgotPassword', forgotPassword)
router.put('/reset/:token', resetPassword)
router.get('/user/:id', authentificationMid, userDetail)

module.exports = router
