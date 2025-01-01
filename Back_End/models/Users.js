const mongoose = require('mongoose')

const UsersSchema= new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const EmployeeModel= mongoose.model("users",UsersSchema)
module.exports = UsersModel