import { Router } from "express";
import authChecker from "../middlewares/authChecker";
import rightsChecker from "../middlewares/rightsChecker";
import {
  getInvestments,
  createInvestment,
  getInvestmentById,
  confirmInvestment,
  getInvestmentsStatistics,
} from "../controllers/investmentsController";

const router = Router();

// read only routes
//router.use(authChecker);

router.get("/", getInvestments);
router.get("/stats", getInvestmentsStatistics);
router.get("/:id", getInvestmentById);

// routes with write rights
//router.use(rightsChecker);

router.post("/", createInvestment);

router.patch("/", confirmInvestment);

export default router;
