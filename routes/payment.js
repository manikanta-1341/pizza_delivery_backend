const express = require("express")
const route = express.Router()
const fromcreateOrder = require('../modules/createOrder')



route.post('/create',fromcreateOrder.CreateOrder) 



module.exports = route