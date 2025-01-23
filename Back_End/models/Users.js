const mongoose = require ('mongoose')

const UsersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
        type: String,
        required: true, // Password is required
        minlength: 6, // Minimum password length
    },
    confirmPassword: {
        type: String,
        required: true, // Confirm password is required
        validate: {
            validator: function (value) {
                return value === this.password; // Ensure confirmPassword matches password
            },
            message: "Passwords do not match",
        },
    },
});

const UserModel = mongoose.model("employees",UsersSchema)
module.exports= UserModel



