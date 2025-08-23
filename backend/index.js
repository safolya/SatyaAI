const express=require("express");
const app=express();
app.use(express.json())
require("dotenv").config();
const bodyparser=require("body-parser");
app.use(bodyparser.json());
const analyzeRouter=require("./routes/analyzeRouter");

app.use("/api/analyze",analyzeRouter);


app.get("/",(req,res)=>{
    res.send("hello");
})


// app.get("/api/analyze-url",(req,res)=>{

// })

// app.post("/api/analyze-url",(req,res)=>{

// })
app.listen(3000)