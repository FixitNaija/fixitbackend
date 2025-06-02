const express = require('express');
const connectDb = require('./src/config/db');
const dotenv = require('dotenv');

const userRouter = require('./src/routers/user.router');
const issueRouter = require('./src/routers/issue.router');
const commentRouter = require('./src/routers/comment.router');


const app = express(); 
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/issue', issueRouter);
app.use('/api/v1/comments', commentRouter);

app.listen(PORT, () => {
    connectDb();
    console.log(`server is running on port ${PORT}`);
})

