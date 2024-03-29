const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
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
    password: {
        type: String,
        required: true,
    },
    verified:{
        type:String,
        default:"no"
    },
    randomString:{
        type:String
    },
    orders :{
        type:Array,
        default:[]
    }

});

const Admin = mongoose.model('Admin', adminSchema, 'admin');
module.exports = Admin;