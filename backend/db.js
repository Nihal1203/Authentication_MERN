const mongoose=require('mongoose')
module.exports=()=>{
  
  try {
    mongoose.connect(process.env.DB)
    console.log("Connected To Database")
  } catch (error) {
    console.log("Error while connecting to database",error)
  }

}