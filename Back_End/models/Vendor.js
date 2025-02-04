const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const VendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: Number,
      unique: true,
    },
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorLocation: {
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
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["vendor"], 
      default: "vendor",
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

//Apply unique validator plugin
VendorSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

//Auto-increment vendorId with a starting sequence
VendorSchema.plugin(AutoIncrement, { inc_field: "vendorId", start_seq: 0 });

const VendorModel = mongoose.model("Vendor", VendorSchema);
module.exports = VendorModel;
