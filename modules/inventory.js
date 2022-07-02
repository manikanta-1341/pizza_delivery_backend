const mongoose = require('mongoose')
const User = require('../model/users')
const Inventory = require('../model/inventory')
const Item = require('../model/pizzas')
const mailer = require('nodemailer')


module.exports.GetInventory = async (req, res) => {
    try {
        let response = await Inventory.find({})
        res.send(response)
    } catch (error) {
        console.log(error)
        res.send({ msg: error })
    }
}



module.exports.Create_inventory = async (req, res) => {
    try {
        let inventory = new Inventory(req.body.inventory)
        Object.keys(req.body.inventory).map((e) => {
            inventory[e].map((obj) => {
                obj._id = mongoose.Types.ObjectId()
                obj.Quantity = parseInt(obj.Quantity)
                obj.Price = parseInt(obj.Price)
            })
        })
        let response = await inventory.save()
        res.send(response)
    } catch (error) {
        console.log(error)
        res.send({ msg: error })
    }


}

module.exports.Update_inventory = async(req,res) =>{
    try{
        let arr_obj = req.body.arr_obj
        // console.log("arr_obj",arr_obj)
        let result=[]
        if(arr_obj.length>0){
            arr_obj.map(async(obj)=>{ 
                let Item = await Inventory.findOne(
                {[`${obj.type}._id`]:mongoose.Types.ObjectId(obj._id)},
                {[`${obj.type}.$`]:1,_id:0}
                )
                let prev_qty = Item[obj.type][0].Quantity
                result = await Inventory.findOneAndUpdate(
                    {[`${obj.type}._id`]:mongoose.Types.ObjectId(obj._id)},
                    {$set:{[`${obj.type}.$.Quantity`]:parseInt(prev_qty)+parseInt(obj.quantity)}},  
                    {new:true}
                )
                // console.log(result)
                return result
            })
            let response = await Inventory.find({})
            res.send(response)
        }
        else{
            res.send({msg:"invalid input data"})
        }
        
    }
    catch(error){
        console.log(error)
        res.send({msg : error})
    }
}