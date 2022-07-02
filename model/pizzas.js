const mongoose = require('mongoose');
const schema = mongoose.Schema;

const itemSchema = new schema({
    image:{
        type:String
    },
    name:{
        type:String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    size:{
        type:String,
        required: true,
        enum : ["small","medium","large"]
    },
    price:{
        type: String,
        required: true
    },
    quantity:{
        type:Number,
        required: true
    },
    userquantity:{
        type:Number,
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema, 'items')
module.exports = Item