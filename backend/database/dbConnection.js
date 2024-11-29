import mongoose from "mongoose";

const connectDatabase = () =>{
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: "Mate"
    }).then(()=>{
        console.log("Connected to Database!");
    }).catch((error)=>{
        console.log(`Some Error occued while connecting to Database: ${error}`);
    });
};

export default connectDatabase;