import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authChecker: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      res.status(401);
      return next(new Error("Authorization token not found."));
    }

    const token = authorization.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_PHRASE?.toString() || "";
    const payload = jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401);
    return next(new Error("Invalid or expired token, unauthorized."));
  }
};

export default authChecker;
