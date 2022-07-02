const User = require('../model/users')
const Admin = require('../model/admin')
const mongo = require('../shared/connect');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require('nodemailer');
const { default: mongoose } = require('mongoose');


module.exports.userSignup = async (req, res, next) => {
    const new_user = new User({ ...req.body.user })
    const exituser = await User.findOne({ email: new_user.email })
    if (!exituser) {
        try {
            const string = await bcrypt.genSalt(6)
            new_user.password = await bcrypt.hash(new_user.password, string)
            var response = await new_user.save();
            res.send(response);
        }
        catch (err) {
            console.log(err)
            res.send(err);
        }
    }
    else {
        res.send("user already exists")
    }
}


module.exports.EmailVerificationSent = async(req,res)=>{
    try {
        let user = await User.findOne({_id : mongoose.Types.ObjectId(req.params.id)})

        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'office@gmail.com',
                pass: 'office@123'
            }
        });
        let info = await transporter.sendMail({
            from: 'office@gmail.com', 
            to: user.email, 
            subject: "Account Verification", 
            text: `${process.env.backend_url}/user/account/verify/${req.params.id}`, 
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports.EmailVerify = async (req, res, next) => {
    try{
        let response = await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id)},{$set : {verification: "yes"}})
        res.redirect('${process.env.frontend_url}/activated')
    }
    catch (err) {
        res.send(err)
    }
}

module.exports.adminSignup = async (req, res, next) => {
    const new_admin = new Admin({ ...req.body.admin })
    const exitadmin = await Admin.findOne({ email: new_admin.email })
    if (!exitadmin) {
        try {
            const salt = await bcrypt.genSalt(6)
            new_admin.password = await bcrypt.hash(new_admin.password, salt)
            var response = await new_admin.save();
            res.send(response);
        }
        catch (err) {
            res.send(err);
        }
    }
    else {
        res.send("admin already exists")
    }


}

module.exports.AdminEmailVerificationSent = async(req,res)=>{
    try {
        let Main_admin = await Admin.findOne({role:"main"})
        let admin = await Admin.findOne({_id : mongoose.Types.ObjectId(req.params.id)})
        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'office@gmail.com',
                pass: 'office@123'
            }
        });
        let info = await transporter.sendMail({
            from: 'office@gmail.com', 
            to: Main_admin.email, 
            subject: "Account Verification", 
            text: `${process.env.backend_url}/admin/account/verify/${admin._id}`, 
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // console.log('Email sent for new admin: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports.AdminEmailVerify = async (req, res, next) => {
    try{
        let response = await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id)},{$set : {verification: "yes"}})
        res.redirect('${process.env.frontend_url}/activated')
    }
    catch (err) {
        res.send(err)
    }
}
