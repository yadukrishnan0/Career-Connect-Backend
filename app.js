const express =require('express');
const  app =express()
const dotenv =require('dotenv')
dotenv.config();
const dbConnection =require('./config/dbConnection')
const port = process.env.PORT||3000

app.get('/',(req,res)=>{
    res.send('hello')
})

dbConnection().then(()=>{
    app.listen(port,()=>{
        console.log(`server running ${port}`)
    })
})