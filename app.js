const express =require('express');
const  app =express()
const dotenv =require('dotenv')
dotenv.config();
const dbConnection =require('./config/dbConnection')
const port = process.env.PORT||3000
const userRouter = require('./routers/userRouter')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',userRouter)

dbConnection().then(()=>{
    app.listen(port,()=>{
        console.log(`server running ${port}`)
    })
})