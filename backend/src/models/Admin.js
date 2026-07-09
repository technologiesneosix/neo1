import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password.js';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
      match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function (password) {
  return await comparePassword(password, this.password);
};

// Remove sensitive data when converting to JSON
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password;
  delete admin.refreshToken;
  delete admin.__v;
  return admin;
};

// Ensure only one admin exists
adminSchema.statics.ensureSingleAdmin = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    throw new Error('No admin account exists. Please create an admin account first.');
  }
  if (count > 1) {
    throw new Error('Multiple admin accounts detected. Only one admin account is allowed.');
  }
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
