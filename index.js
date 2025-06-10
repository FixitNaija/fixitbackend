const express = require('express');
const connectDb = require('./src/config/db');
const dotenv = require('dotenv');


const app = express(); 
dotenv.config();
const PORT = process.env.PORT;


app.listen (PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
})

