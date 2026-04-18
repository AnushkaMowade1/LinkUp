const express=require("express");
const mongoose=require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app=express();
// middleware/
app.use(express.json());
app.use(cors());

//test route
app.get("/",(req,res)=>{
    res.send("API running...");
});

//connect db
mongoose.connect(process.env.MONGO_URI).then(()=> console.log("MongoDB connected")).catch(err=>console.log(err));

//connect route of auth here
const authRoute=require("./routes/auth");
app.use("/api/auth",authRoute);

//start server
app.listen(5000, ()=> console.log("Server running on port 5000"));

