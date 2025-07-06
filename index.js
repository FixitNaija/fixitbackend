const express = require('express');
const connectDb = require('./src/config/db');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./src/middleware/googleauth');
const cors = require('cors');


const userRouter = require('./src/routers/user/user.router');
const issueRouter = require('./src/routers/user/issue.router');
const commentRouter = require('./src/routers/user/comment.router');
const isAuthenticated = require('./src/middleware/isAuthenticated');
const googleAuthRouter = require('./src/routers/user/auth.router');
const adminRouter = require('./src/routers/admin/admin.router');



const app = express(); 
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 14 * 24 * 60 * 60 // Session expiry: 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', googleAuthRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/issue', issueRouter);
app.use('/api/v1/issue', commentRouter);
app.use('/api/v1/admin', adminRouter);

app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
}); 