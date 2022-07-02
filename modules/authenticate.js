const User = require('../model/users')
const Admin = require('../model/admin')
// const mongo = require('../shared/connect');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require('nodemailer');
const mongoose = require('mongoose');
const {unset} = require('lodash')

module.exports.Start = async(req,res)=>{
    res.send({msg:"started"})
}



module.exports.userLogin = async (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password
        // console.log(username, password);
        let existuser = await User.findOne({email : username})
        if(!existuser){
            return res.send({msg : "invalid username"})
        }
        let isvalid = await bcrypt.compare(password, existuser.password)
        if(!isvalid){
            return res.send({msg :"invalid password"})
        }
        const token = jwt.sign({user:existuser}, process.env.SECRET_KEY,{expiresIn : '1hr'})
        res.send(token)
    }
    catch (err) {
        console.log(err)
        res.send({msg : "failed"})
    }

}


module.exports.ForgetPassword = async (req, res, next) => {
    try {
        // console.log("in password reset func", req.body.email);
        const email = req.body.email
        const user = await User.findOne({ email: email })
        // console.log("user",user,user._id)
        if (user) {
            const randomString = await bcrypt.genSalt(7)
            // console.log("randonstring:",randomString)
            let user_update =await User.findOneAndUpdate(
                {_id : user._id},
                {$set:{randomString : randomString}}
            )
            let result = await user_update.save()
            // console.log(user_update)
            var transporter = mailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'office@gmail.com',
                    pass: 'office@123'
                }
            });
            let info = await transporter.sendMail({
                from: 'office@gmail.com', // sender address
                to: email, // list of receivers
                subject: "Password Reset", // Subject line
                text: `${process.env.backend_url}/user/verify/${user._id}/?s=${randomString}`, // plain text body
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).send("success")
        }
        else {
            res.send("not matched")  
        }
    }
    catch (err) {
        console.log(err)
        res.send("failed")
    }

}


module.exports.ForgetPasswordVerify = async (req, res, next) => {
    try {
        const tokenFromUser = req.query.s
        const user = await User.findById({ _id: mongoose.Types.ObjectId(req.params.id) })
        // console.log(tokenFromUser, "\n", user, "\n", user.rndString)
        if (tokenFromUser === user.rndString) {
            res.redirect(`${process.env.frontend_url}/resetpassword/${req.params.id}/?s=${req.query.s}`)
        }
        else{
            res.send("Token Not Matched / Token Expired")
        }
    }
    catch (err) {
        res.send(err)
    }
}


module.exports.savePassword = async (req, res, next) => {
    // console.log("in savePassword")
    try{
        const string = await bcrypt.genSalt(6)
        // console.log("in save",req.body.password)
        const hashPassword = await bcrypt.hash(req.body.password, string)
        await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { password: hashPassword } })
        await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $unset: { randomString: '' } })
        res.send({msg : "saved successfully"})
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
}


module.exports.GetOrders = async (req,res)=>{
    try{
        let response = await User.findById({_id:mongoose.Types.ObjectId(req.params.id)})
        res.send(response)
    }
    catch(err){
        console.log(err)
        res.send({msg : err})
    }
}


module.exports.adminLogin = async (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password
        // console.log(username, password);
        let existadmin = await Admin.findOne({username : username})
        // console.log(existadmin); 
        if(!existadmin){
            return res.send({msg : "invalid username"})
        }
        let isvalid = await bcrypt.compare(password, existadmin.password)
        if(!isvalid){
            return res.send({msg :"invalid password"})
        }
        const token = jwt.sign({admin : existadmin}, process.env.SECRET_KEY,{expiresIn : '1hr'})
        res.send(token) 
    }
    catch (err) {
        console.log(err)
        res.send({msg : err})
    }

}

module.exports.adminForgetPassword = async (req, res, next) =>{
    try {
        // console.log("in password reset func", req.body.email);
        const email = req.body.email
        const admin = await Admin.findOne({ email: email })
        // console.log("admin",admin,admin._id)
        if (admin) {
            const rndString = await bcrypt.genSalt(6)
            let admin_update =await Admin.findOneAndUpdate(
                {_id : mongoose.Types.ObjectId(admin._id)},
                {$set :{randomString : rndString }},
                {new:true}
            )
            var transporter = mailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'office@gmail.com',
                    pass: 'password'
                }
            });
            let info = await transporter.sendMail({
                from: 'office@gmail.com', // sender address
                to: admin.email, // list of receivers
                subject: "Password Reset", // Subject line
                text: `${process.env.frontend_url}/admin/verify/${admin._id}/?${randomString}`, // plain text body
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).send(admin_update)
        }
        else {
            res.send("not matched")
        }
    }
    catch (err) {
        console.log(err)
        res.send("failed")
    }
}

module.exports.adminForgetPasswordVerify = async (req, res, next) => {
    try {
        const tokenFromAdmin = req.query.s
        const admin = await Admin.findById({ _id: mongoose.Types.ObjectId(req.params.id) })
        if (tokenFromAdmin === admin.randomString) {
            res.redirect(`${process.env.frontend_url}/admin/resetpassword/${req.params.id}/?s=${req.query.s}`)
        }
        else{
            res.send("Token Not Matched / Token Expired")
        }
    }
    catch (err) {
        res.send(err)
    }
}

module.exports.adminsavePassword = async (req, res, next) => {
    // console.log("in savePassword")
    try{
        const string = await bcrypt.genSalt(6)
        // console.log("in save",req.body.password)
        const hashPassword = await bcrypt.hash(req.body.password, string)
        await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { password: hashPassword } })
        await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $unset: { randomString: '' } })
        res.send({msg : "saved successfully"})
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
}


module.exports.AdminGetOrders = async (req,res)=>{
    try {
        
        let response = await Admin.findOne({_id : mongoose.Types.ObjectId(req.params.id)}) 
        
        res.send(response) 
    } catch (error) {
        res.send({msg:error})
    }
}

module.exports.AdminModifyOrder = async (req,res)=>{
    try {
        // console.log(req.body,req.params.id) 
        let response = await Admin.updateMany(
            {"orders._id":mongoose.Types.ObjectId(req.params.id)},
            {$set : {"orders.$.status":req.body.status}},
        )
        let userResponse = await User.findOneAndUpdate(
            {"orders._id":mongoose.Types.ObjectId(req.params.id)},
            {$set : {"orders.$.status":req.body.status}},
            {new:true}
        )
        
        let updateResponse = await Admin.find({_id:mongoose.Types.ObjectId(req.body.admin_id)})
        // console.log(updateResponse[0].orders) 
        res.send(updateResponse[0].orders)
    } catch (error) {
        console.log(error) 
        res.send({msg : error})
    }
}