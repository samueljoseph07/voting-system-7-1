const mongoose = require("mongoose");


const FormDataSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Do NOT return password by default (select: false)
    password: {
      type: String,
      required: true,
      select: false
    },

    faceData: {
      // OPTIONAL: this field can be encrypted before saving if you add a pre-save hook
      descriptor: {
        type: [Number], // 128-dimensional embedding
        required: true
      },

      landmarks: [
        {
          x: Number,
          y: Number
        }
      ]
    }
  },
  { timestamps: true } // createdAt & updatedAt
);

module.exports = mongoose.model("User", FormDataSchema);
