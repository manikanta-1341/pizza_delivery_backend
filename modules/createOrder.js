const Razorpay = require('razorpay');
const Inventory = require('../model/inventory')
const mailer = require('nodemailer')
const { v4: uuid4 } = require('uuid')
const fs = require('fs')
const path = require('path');
const User = require('../model/users');
const { default: mongoose } = require('mongoose');
const Admin = require('../model/admin');
var instance = new Razorpay({
  key_id: 'rzp_test_VowM3OfZOHOMjn',
  key_secret: 'RyPsqKndb8OjGhQQ5B0gTlex',
});

module.exports.CreateOrder = async (req, res) => {
  
  try {
    let response = await instance.orders.create({ 
      "amount": req.body.amount, 
      "currency": "INR",
      "receipt": uuid4(),
    })
    fs.writeFileSync(path.join(__dirname,"../orders",`order.json`),JSON.stringify(
      {
        ...response,
        user_id:req.body._id,
        user_order : req.body.user_order
      },
      null,2))

    let admin_info = await Admin.findOne({role :"main"})
    let inventory = await Inventory.find({})
    let thershold_stock=[]
    Object.keys(inventory[0]['_doc']).map((key)=>{
        if(key !=="__v" && key !=="_id"){
            thershold_stock = inventory[0]['_doc'][key].map((obj)=>{
                if(obj.Quantity<=20){
                    return obj.Name
                }
                return null
            })
        }
    })
    if(thershold_stock[0] !== null){
        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'office@gmail.com',
                pass: 'office@123'
            }
        });
        let info = await transporter.sendMail({
            from: 'office@gmail.com', 
            to: admin_info[0].email, 
            subject: "Low Inventory Resources", 
            html:`<h4>${thershold_stock.join("   ")}</h4>`,
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // console.log('Email sent: ' + info.response);
            }
        });
    }





    res.send(response)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}