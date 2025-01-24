const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const UserModel = require('./models/Users');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://TickXplore:Kaushaltar%4015@tickxplorefyp.jhlpo.mongodb.net/user")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Sign-in route
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

// Sign-up route with location field handling
app.post('/signup', (req, res) => {
    const { name, email, password, confirmPassword, location } = req.body;

    // Basic validation (can be expanded based on further requirements)
    if (!name || !email || !password || !confirmPassword || !location) {
        return res.status(400).json("All fields are required.");
    }

    if (password !== confirmPassword) {
        return res.status(400).json("Passwords do not match.");
    }

    // Email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json("Invalid email format.");
    }

    // Check if the email already exists in the database
    UserModel.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                // If the email already exists, send an error response
                return res.status(400).json("Email already exists. Please use a different email.");
            } else {
                // Hash the password before saving it
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json("Error hashing password.");
                    }

                    // Create a new user with the hashed password
                    UserModel.create({
                        name,
                        email,
                        password: hashedPassword,  // Save the hashed password
                        location,  // Store location here
                    })
                    .then(user => res.json(user))  // Send back the created user object
                    .catch(err => res.status(500).json("Error creating user: " + err.message));  // Error handling
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json("Error checking email availability.");
        });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
