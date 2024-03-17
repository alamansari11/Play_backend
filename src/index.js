// require('dotenv').config({path: './env'})

import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
  path: "./env",
});

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running at port: ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("MONGODB connection failed: " + err);
})

/*
const app = express();
(async () => {
  try {
   await mongoose.connect(`${process.env.MONGDB_URI}/${DB_NAME}`);
    app.on("error",(error)=>{
        console.log("Error", error);
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on ${process.env.PORT}`);
    })

  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
})();
*/
