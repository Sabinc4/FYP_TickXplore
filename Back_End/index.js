const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://TickXplore:Kaushaltar%4015@tickxplorefyp.jhlpo.mongodb.net/employee");

app.post("/sign-in", (req, res) => {
    const { email, password } = req.body;
    
    // Find the user by email
    EmployeeModel.findOne({ email: email })
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
    EmployeeModel.create(req.body) // Correcting to use req.body
        .then(employee => res.json(employee)) // Changed employees to employee, since you are creating a single record
        .catch(err => res.json(err));
});


app.listen(3001, () => {
    console.log("server is running");
});
