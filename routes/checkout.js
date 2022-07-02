const express = require("express")
const route = express.Router()
const fromcheckout = require('../modules/checkout')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })



route.post('/',urlencodedParser,fromcheckout.Checkout)  



module.exports = route