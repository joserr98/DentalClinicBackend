import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      lastname: String,
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ["client", "dentist", "admin"],
      },
      address: String,
      phone_number: {
        type: Number,
        required: true,
        unique: true,
      },
      specialty: {
        type: mongoose.Types.ObjectId,
        ref: "Treatment",
      },
      created_at: Date,
      updated_at: Date,
      deleted_at: Date,
    },
    { versionKey: false }
  )
);

export default User;
