import { RequestHandler } from "express";
import { Rights } from "../utils/generateToken";

const rightsChecker: RequestHandler = (req, res, next) => {
  const { rights } = res.locals;
  if (!rights) {
    res.status(401);
    return next(new Error("Token malformed."));
  }
  if (rights !== Rights.ReadWrite) {
    res.status(401);
    return next(new Error("Unauthorized action with this token."));
  }
  next();
};

export default rightsChecker;
