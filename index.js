const express = require('express');
const connectDb = require('./src/config/db');
const dotenv = require('dotenv');
const userRouter = require('./src/routers/user.router');
const issueRouter = require('./src/routers/issue.router');


const app = express(); 
dotenv.config();
const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/issues', issueRouter);

app.listen (PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
})

