import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim gerekli"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email gerekli"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Şifre gerekli"],
    },
    avatarUrl: {
      type: String,
      default: "https://ui-avatars.com/api/?background=random",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
