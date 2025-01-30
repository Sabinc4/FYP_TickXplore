const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AdminSchema = new mongoose.Schema(
  {
    adminId: {
      type: Number,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: String,
      required: true,
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
    role: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Apply unique validator plugin
AdminSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

// Auto-increment adminId
AdminSchema.plugin(AutoIncrement, { inc_field: 'adminId', start_seq: 0 });

// No password hashing now

const AdminModel = mongoose.model('admins', AdminSchema);
module.exports = AdminModel;