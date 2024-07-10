import { generateToken, Rights } from "../utils/generateToken";
import { decodeBasicAuth, Credentials } from "../utils/decodeBasicAuth";
import User from "../models/User";
import { RequestHandler } from "express";

const authController: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      // * send token with read only rights
      const payload = {
        rights: Rights.Read,
      };
      const token = generateToken(payload);
      return res.status(200).json({ token: token });
    } else {
      // * send token with read and write rights
      const credentials: Credentials | null = decodeBasicAuth(authorization);
      if (!credentials) {
        res.status(401);
        return next(new Error("Invalid authorization header."));
      }
      const user = await User.checkUserCredentials(
        credentials.username,
        credentials.password
      );

      if (!user) {
        res.status(401);
        return next(new Error("User not found or invalid credentials."));
      }

      const payload = {
        rights: Rights.ReadWrite,
      };

      const token = generateToken(payload);
      return res.status(200).json({ token: token });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default authController;
