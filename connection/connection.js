import mongoose from "mongoose";
const connectDB  = async (DATABASEURL,isConnect)=>{
    try{
       const DB_OPTION={
        dbName:"mySquare"
       }
       await mongoose.connect(DATABASEURL,DB_OPTION);
       console.log("Database Connected!!");
       isConnect(true)
       
    }catch(error){
        console.log(error);
    }
    
}
export default connectDB;
