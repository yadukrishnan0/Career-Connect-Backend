const express =require('express');
const  app =express()
const session = require('express-session')
const dotenv =require('dotenv')
dotenv.config();
const dbConnection =require('./config/dbConnection')
const port = process.env.PORT||3000
const userRouter = require('./routers/userRouter')

app.use(express.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
}))
app.use('/',userRouter)

dbConnection().then(()=>{
    app.listen(port,()=>{
        console.log(`server running ${port}`)
    })
})