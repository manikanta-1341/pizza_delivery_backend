const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type:String,
        required: true,
    },
    pincode:{
        type:Number,
        required:true
    },
    phone:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    randomString:{
        type:String
    },
    verified:{
        type:String,
        default:"no"
    },
    orders:{
        type:Array,
        default:[]
    }

});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;