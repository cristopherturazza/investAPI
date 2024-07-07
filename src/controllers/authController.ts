import generateToken, { Rights } from "../utils/generateToken";
import { RequestHandler } from "express";

const authController: RequestHandler = (req, res, next) => {
  try {
    const payload = {
      rights: Rights.Read, // TODO: ReadWrite if basic authentication
    };
    const token = generateToken(payload);
    return res.json({ token: token });
  } catch (error) {
    next(error);
  }
};

export default authController;
