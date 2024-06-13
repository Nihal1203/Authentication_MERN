const mongoose=require('mongoose')
module.exports=()=>{
  
  
   mongoose.connect(process.env.DB)
  .then(() => console.log('Connected to MongoDB Database'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
    
  
}