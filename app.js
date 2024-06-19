const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./config/dbConnection');
const authRouter = require('./routers/authRouter');
const adminRouter =require('./routers/adminRouter');
const companyRouter =require('./routers/companyRouter');
const userRouter =require('./routers/userRouter');
const Cron =require('./services/croneServices');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials:true

};
app.use(cors(corsOptions ));

app.use(express.static('public'));
// Session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
}));

// Routes
app.use('/', authRouter);//authentication router
app.use('/',adminRouter);//admin router
app.use('/',companyRouter);//company router
app.use('/',userRouter)//user router

Cron.init();

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).json({success:false,message:'internal server error'})
});
// Connect to the database and start the server
dbConnection().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
});
