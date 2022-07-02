const express = require('express')
const route = express.Router()
const signup = require('../modules/signup')
const fromModule = require('../modules/authenticate')


route.get('/',fromModule.Start)


route.post('/user/login',fromModule.userLogin)
route.post('/user/signup',signup.userSignup)
route.get('/user/verificationMail/:id',signup.EmailVerificationSent)
route.post('/user/account/verify ',signup.EmailVerify)

route.post('/user/forgetpassword',fromModule.ForgetPassword)
route.get('/user/verify/:id',fromModule.ForgetPasswordVerify)
route.post('/user/savepassword/:id',fromModule.savePassword)
route.get('/user/orders/:id',fromModule.GetOrders)

route.post('/admin/login',fromModule.adminLogin)
route.post('/admin/signup',signup.adminSignup)
route.get('/admin/verificationMail/:id',signup.AdminEmailVerificationSent)
route.post('/admin/account/verify ',signup.AdminEmailVerify)

route.put('/admin/forgetpassword',fromModule.adminForgetPassword)
route.post('/admin/verify/:id',fromModule.adminForgetPasswordVerify)
route.post('/admin/savepassword/:id',fromModule.adminsavePassword)
route.get('/admin/orders/:id',fromModule.AdminGetOrders)
route.post('/admin/order/modify/:id',fromModule.AdminModifyOrder)



module.exports = route