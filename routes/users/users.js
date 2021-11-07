const express = require('express')
const router = express.Router()
const {
  validateSignupUser,
  schemaLoginUser,
  validateSubscriptionUser,
} = require('./validation');
const {
    signup,
    login,
    logout,
    current,
    updateSubscription,
    userStarter,
    userPro,
    userBusiness,
    uploadAvatar, } = require('../../controllers/usersControllers')
const guard = require('../../helpers/guard')
const loginLimit = require('../../helpers/rate-limit-login')
const { Subscription } = require('../../config/constants')
const role = require('../../helpers/role')
const upload = require('../../helpers/uploads')

router.patch('/', guard, validateSubscriptionUser, updateSubscription)
router.get('/starter', guard, role(Subscription.STARTER), userStarter)
router.get('/pro', guard, role(Subscription.PRO), userPro)
router.get('/business', guard, role(Subscription.BUSINESS), userBusiness)
router.post('/signup', validateSignupUser, signup)
router.post('/login', loginLimit, schemaLoginUser, login)
router.post('/logout', guard, logout)
router.get('/current', guard, current)
router.patch('/avatar', guard, upload.single('avatarUrl'), uploadAvatar)


module.exports = router
