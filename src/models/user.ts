import mongoose from "mongoose";
import { NIKVerificationStatus, PoliticalParty, Role } from "../enums/enum";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  nik: {
    nikCode: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(NIKVerificationStatus),
      default: NIKVerificationStatus.DRAFT,
    },
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(Role),
    default: Role.USER,
  },
  party: {
    type: String,
    enum: Object.values(PoliticalParty),
    required: false,
  },
});

export default mongoose.model("User", userSchema);
