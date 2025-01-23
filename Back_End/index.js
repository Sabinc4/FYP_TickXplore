const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/Users');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://TickXplore:Kaushaltar%4015@tickxplorefyp.jhlpo.mongodb.net/user");

app.post("/sign-in", (req, res) => {
    const { email, password } = req.body;
    
    // Find the user by email
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // Check if the password matches
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Password is incorrect");
                }
            } else {
                res.json("No record existed");
            }
        })
        .catch(err => {
            // Handle error if any
            console.error(err);
            res.status(500).json("Server error");
        });
});


app.post('/signup', (req, res) => {
    UserModel.create(req.body) 
        .then(user => res.json(user)) 
        .catch(err => res.json(err));
});


app.listen(3001, () => {
    console.log("server is running");
});
