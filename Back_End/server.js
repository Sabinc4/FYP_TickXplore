const express=require("express");
const mongoose=express('mongoose');
const cors=require("cors");
const UsersModel=require('./models/Users')

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://TickXplore:Kaushaltar%4015@tickxplorefyp.jhlpo.mongodb.net/");

app.post('/register',(req,res)=> {
    UsersModel.create(req.body)
    .then(users=> res.json(users))
    .catch(err => res.json(err))

})

app.listen(3001,()=>{
    console.log("server is running")
})