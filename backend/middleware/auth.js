import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "my_secret_key";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  console.log("TOKEN:", token); // 🔍 debug

  if (!token) {
    return res.status(401).json({ message: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("DECODED:", decoded); // 🔍 debug

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
