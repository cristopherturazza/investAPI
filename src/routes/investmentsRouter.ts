import { Router } from "express";
import authChecker from "../middlewares/authChecker";

const router = Router();

router.use(authChecker);

router.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

export default router;
