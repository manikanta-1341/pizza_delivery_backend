const express = require('express')
const route = express.Router()
const fromModule = require('../modules/items')

const auth = require('../modules/authorize')
route.get('/',fromModule.getProduct)
route.post('/create',auth.AuthorizeUser,fromModule.create)
route.put('/update/:id',auth.AuthorizeUser,fromModule.update)
route.delete('/delete/:id',auth.AuthorizeUser,fromModule.delete)




module.exports = route