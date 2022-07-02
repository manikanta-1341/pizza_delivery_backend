const Item = require('../model/pizzas')
const Inventory = require('../model/pizzas')
const mongoose = require('mongoose')
// const {ObjectId} = require('mongodb')
const User = require('../model/users')
module.exports.getProduct = async (req, res, next) => {
    try {
        const response = await Item.find({})
        
        res.send(response)
    }
    catch (err) {
        res.send(err)
    }
}



module.exports.create = async (req, res, next) => {
    const new_pizza = new Item({ ...req.body.pizza })
    // console.log(new_pizza)
    const check = await Item.findOne({ name: new_pizza.name, size: new_pizza.size })
    // console.log(check)

    try {
        if (!check) {
            const response = await new_pizza.save()
            res.send(response)
        }
        else {
            res.status(500).send({ msg: "already exists change parameters and try" })

        }
    }
    catch (err) {
        res.send(err)
    }



}
module.exports.update = async (req, res, next) => {
    try {
        let user_details = req.body.user.existuser
        delete (req.body.user)
        // console.log("body:::", req.body)
        let id = {_id : mongoose.Types.ObjectId(req.params.id)}
        let update = req.body
        var response = await User.findByIdAndUpdate(id, update,{new:true}) 
        res.status(200).send(response)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }

}

module.exports.delete = async (req, res, next) => {
    try {
        const response = await Item.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.params.id) })
        res.send(response)
    }
    catch (err) {
        // console.log(err)
        res.send(err)
    }
}

