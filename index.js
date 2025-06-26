const express = require('express');
const connectDb = require('./src/config/db');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
require('./src/middleware/googleauth');
const cors = require('cors');


const userRouter = require('./src/routers/user.router');
const issueRouter = require('./src/routers/issue.router');
const commentRouter = require('./src/routers/comment.router');
const isAuthenticated = require('./src/middleware/isAuthenticated');
const googleAuthRouter = require('./src/routers/auth.router');
const adminRouter = require('./src/routers/admin/admin.router');



const app = express(); 
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
})); 

app.use(passport.initialize())
app.use(passport.session())

app.use('/googleauth', googleAuthRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/issue', issueRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/admin', adminRouter);

app.listen(PORT, () => {
    connectDb();
    console.log(`server is running on port ${PORT}`);
}); 