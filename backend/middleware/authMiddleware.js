import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js"; 

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Auth header received:", req.headers.authorization);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT payload:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("Resolved user from DB:", req.user ? req.user._id : null);

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.message || error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
