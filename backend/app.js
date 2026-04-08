import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./user.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

mongoose
  .connect("mongodb://localhost:27017/auth-app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const SECRET = process.env.JWT_SECRET || "my_secret_key";

// ✅ VERIFY TOKEN
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ✅ REGISTER
app.post("/register-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      password: hash,
    });

    res.json({
      success: true,
      message: "User registered",
      user: createdUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
});

// ✅ LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ✅ GET CURRENT USER
app.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
});

// ✅ START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
