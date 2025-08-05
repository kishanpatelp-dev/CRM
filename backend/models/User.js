import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: '',
    trim: true
  },
  avatarUrl: {
    type: String,
    default: '/uploads/user.png',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'collaborator'],
    default: 'user'
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
