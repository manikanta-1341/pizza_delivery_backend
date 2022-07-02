const { createHmac } = require('crypto');
const order_details = require('../orders/order.json')
const User = require('../model/users');
const mongoose = require('mongoose');
const Admin = require('../model/admin');
const Inventory = require('../model/inventory')
const Item = require('../model/pizzas')





module.exports.Checkout = async (req, res) => {
    try {

        const secret = "RyPsqKndb8OjGhQQ5B0gTlex";
        if (req.body.razorpay_signature) {
            const generated_signature = createHmac('sha256', secret)
                .update(order_details.id + "|" + req.body.razorpay_payment_id, secret)
                .digest('hex')
            if (generated_signature === req.body.razorpay_signature) {
                let _id = mongoose.Types.ObjectId()
                let User_response = await User.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(order_details.user_id) },
                    {
                        $push: {
                            orders: {
                                _id: _id,
                                totalValue: (order_details.amount) / 100,
                                order: order_details.user_order,
                                status: "processing"
                            }
                        }
                    },
                    { new: true }
                )

                let Admin_response = await Admin.updateMany(
                    {},
                    {
                        $push: {
                            orders: {
                                _id: _id,
                                order: order_details.user_order,
                                status: "processing"
                            }
                        }
                    },
                    { new: true }
                )

                let user_info = await User.find({ _id: mongoose.Types.ObjectId(order_details.user_id) })
                let inventory = await Inventory.findOne({})
                let items = await Item.find({})
                let list = user_info[0].orders
                let InventoryResponse = []
                let ItemResponse = []
                let update_inventory = []
                list.map((obj) => {
                    obj.order.map(async (O_obj) => {
                        if (O_obj.Check) {
                            Object.keys(inventory['_doc']).filter((in_key) => {
                                if (in_key !== "_id" && in_key !== "__v") {
                                    InventoryResponse = inventory[in_key].filter((e) => {
                                        if (e.Name === O_obj.name) {
                                            e.Quantity = parseInt(e.Quantity) - parseInt(O_obj.quantity)
                                        }
                                        return e
                                    })

                                    return in_key

                                }
                            })
                            if (InventoryResponse.length > 0) {

                                let dummyInventory = { ...inventory }
                                delete dummyInventory._id
                                delete dummyInventory.__v
                                update_inventory = dummyInventory

                            }
                        }
                        else {

                            ItemResponse = await Item.find({ name: O_obj.name })
                            if (ItemResponse.length > 0) {
                                await Item.findOneAndUpdate(
                                    { _id: mongoose.Types.ObjectId(ItemResponse[0]._id) },
                                    { $set: { quantity: parseInt(ItemResponse[0].quantity) - parseInt(O_obj.quantity) } },
                                    { new: true },
                                )
                            }
                        }

                    })



                })
                let inventory_id = update_inventory['_doc']._id
                delete update_inventory['_doc']._id
                delete update_inventory['_doc'].__v
                await Inventory.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(inventory_id) },
                    update_inventory['_doc'],
                    { upsert: true }
                )
                res.redirect(`${process.env.frontend_url}/orders`)
            }
            else {

                res.send({ msg: "Payment is not authorise" })
            }
        }
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
}