import { Router } from "express";
import authChecker from "../middlewares/authChecker";
import rightsChecker from "../middlewares/rightsChecker";

const router = Router();

router.use(authChecker);

router.get("/", (req, res) => {
  return res.json({ message: "simple token" });
});

// routes with write rights
router.use(rightsChecker);

router.post("/", (req, res) => {
  return res.json({ message: "read and write token" });
});

export default router;
