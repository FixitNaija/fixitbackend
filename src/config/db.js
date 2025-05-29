const mongoose = require('mongoose'); 
require('dotenv').config(); 

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database Connected')
    }catch(error){
        console.log({error: 'Database not Connected'})
    } 
}; 

module.exports = connectDb; 