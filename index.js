const express = require('express');
const connectDb = require('./src/config/db');
const dotenv = require('dotenv');
const commentRoutes = require('./src/routers/comment.route');


const app = express(); 
dotenv.config();
const PORT = process.env.PORT;


app.use('/api/comments', commentRoutes);


app.listen (PORT, () => { 
    connectDb();
    console.log(`server is running on port ${PORT}`);
})

