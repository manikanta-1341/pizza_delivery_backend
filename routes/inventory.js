const express = require('express')
const route = express.Router()
const auth = require('../modules/authorize')
const fromModuleinventory = require('../modules/inventory')

route.get('/',fromModuleinventory.GetInventory)
route.post('/create/inventory',fromModuleinventory.Create_inventory)
route.post('/update',fromModuleinventory.Update_inventory)

module.exports = route  