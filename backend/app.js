import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth.js";
import { User } from "./user.js";
import mongoose from "mongoose";
import cors from "cors";
import { Task } from "./task.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

const SECRET = process.env.JWT_SECRET || "my_secret_key";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

mongoose
  .connect("mongodb://localhost:27017/auth-app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ================= TASK ROUTES ================= */

// CREATE TASK
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      userId: req.user.id,
    });

    res.json(task);
  } catch {
    res.status(500).json({ message: "Error creating task" });
  }
});

// GET TASKS
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// DELETE TASK
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    await Task.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting task" });
  }
});

/* ================= AUTH ================= */

// REGISTER
app.post("/register-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hash });

    res.json({ success: true, user });
  } catch {
    res.status(500).json({ message: "Register error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/", // important
      maxAge: 60 * 60 * 1000,
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Login error" });
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  res.json({ success: true });
});

// CURRENT USER
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

/* ================= PASSWORD RESET ================= */
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click below:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({
      success: true,
      message: "Reset link sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Email failed",
    });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and password required",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Reset failed",
    });
  }
});

/* ================= SERVER ================= */

app.listen(5000, () => console.log("Server running on port 5000"));
