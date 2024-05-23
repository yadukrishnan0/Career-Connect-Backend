const mongoose =require('mongoose');
//Data base connection 

const connectDB =async()=>{
    try{
        await mongoose.connect(process.env.URL)
        console.log('database connected success')
    }catch(error){
        console.log('Eroor conncting DB')
    }
} 
module.exports =connectDB