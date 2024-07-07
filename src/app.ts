import express from "express";

import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler";

import investmentsRoutes from "./routes/investments";
import authorizationRoutes from "./routes/authorization";

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // logger
    this.server.use(morgan("dev"));

    // parse requests
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());

    // security
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  }

  routes() {
    // routes

    this.server.use("/api/authorization", authorizationRoutes);
    this.server.use("/api/investments", investmentsRoutes);

    this.server.get("/api", (req, res) => {
      res.status(200).json({
        message:
          "Welcome to investAPI. Please read the documentation before use.",
      });
    });

    // bad routes
    this.server.get("*", (req, res, next) => {
      const error = new Error("Not found.");
      res.status(404);
      next(error);
    });

    // error handler
    this.server.use(errorHandler);
  }
}

export default new App().server;
