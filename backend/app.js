import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user.js';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


const app = express();
app.use(express.json()); // to parse JSON
app.use(cookieParser());
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173', // React app
  credentials: true,               // ⭐ REQUIRED
}));// allow React frontend to call backend
mongoose.connect('mongodb://localhost:27017/auth-app');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'my_secret_key'
    );
    req.user = decoded; // { email }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      
    });
  }
};


app.post('/register-user', async (req, res) => {
  const { email, password } = req.body;
  // console.log('Registering user:', email, password);

  // TODO: save user in DB
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'User already exists !',
    });
  }

  bcrypt.genSalt(10, async (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await User.create({ email, password: hash });
      res.json({ success: true, message: 'User registered', user: createdUser });
    });
  });

});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
  const token = jwt.sign(
  { email: user.email },
  'my_secret_key',
  { expiresIn: '1h' }
);

 res.cookie('token', token, {
    httpOnly: true,    // secure
    sameSite: 'lax',   // IMPORTANT for localhost
    secure: false,     // true only in HTTPS
    maxAge: 60 * 60 * 1000,
  });

  res.json({ success: true, message: 'Login successful', token });
});

app.get('/me', verifyToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    user,
  });
});



app.listen(5000, () => console.log('Server running on port 5000'));