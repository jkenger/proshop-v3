import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Create token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as HTTP-Only cookie (to prevent XSS attacks)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // What is this?
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

export default generateToken;
