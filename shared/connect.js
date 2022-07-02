const mongoose = require('mongoose')

module.exports = {
    db :{},
    async connect(){
        try{
            const client = await mongoose.connect(process.env.mongodb_url)
            
        }
        catch(err){
            console.log(err)
        }
    }
    
}