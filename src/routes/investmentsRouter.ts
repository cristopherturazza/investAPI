import { Router } from "express";
import authChecker from "../middlewares/authChecker";
import rightsChecker from "../middlewares/rightsChecker";
import {
  getInvestments,
  createInvestment,
  getInvestmentById,
} from "../controllers/investmentsController";

const router = Router();

// read only routes
//router.use(authChecker);

router.get("/", getInvestments);
router.get("/:id", getInvestmentById);

// routes with write rights
//router.use(rightsChecker);

router.post("/", createInvestment);

export default router;
