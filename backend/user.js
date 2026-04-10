import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  resetToken: String,
  resetTokenExpiry: Date,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('User', userSchema);