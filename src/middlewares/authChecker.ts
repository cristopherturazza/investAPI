import { jwtPayload } from "./../utils/generateToken";
import InvalidToken from "../models/InvalidToken";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authChecker: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      res.status(401);
      return next(new Error("Authorization token not found."));
    }

    // check if token is valid
    const token = authorization.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_PHRASE?.toString() || "";
    const payload: jwtPayload = jwt.verify(token, secretKey) as jwtPayload;

    if (!payload || !payload.rights) {
      res.status(401);
      return next(new Error("Token malformed."));
    }

    // check if token was used before
    const invalidToken = await InvalidToken.checkInvalidToken(token);
    if (invalidToken) {
      res.status(401);
      return next(new Error("Expired token, unauthorized."));
    }

    // save rights in locals
    res.locals.rights = payload.rights;

    // add token to used tokens list
    await InvalidToken.createInvalidToken(token);

    next();
  } catch (error) {
    res.status(401);
    return next(new Error("Invalid or expired token, unauthorized."));
  }
};

export default authChecker;
