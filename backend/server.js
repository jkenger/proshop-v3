import path from "path";

import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import product from "./routes/product.js";
import user from "./routes/user.js";
import order from "./routes/order.js";
import upload from "./routes/upload.js";

import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// Body parser middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/products", product);
app.use("/api/users", user);
app.use("/api/orders", order);
app.use("/api/upload", upload);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); // This is to fix the error: Error: ENOENT: no such file or directory, stat '/backend/uploads/image-1622200896168.png'
app.use(
  "/uploads",
  express.static(path.join(__dirname, "/frontend/public/images"))
);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
