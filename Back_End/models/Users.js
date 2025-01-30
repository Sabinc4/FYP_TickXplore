const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "vendor", "admin"], // Ensure role is one of these values
    }
  },
  { timestamps: true }
);

// Apply unique validator plugin
UserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

// Auto-increment userId with a starting sequence
UserSchema.plugin(AutoIncrement, { inc_field: "userId", start_seq: 0 });

// Create User model
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
