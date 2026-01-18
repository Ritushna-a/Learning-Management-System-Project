const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.json({message: "Welcome to the Home page"});
});

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000")
});