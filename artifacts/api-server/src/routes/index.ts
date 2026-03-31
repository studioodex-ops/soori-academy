import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import healthRouter from "./health";
import publicRouter from "./public";
import adminRouter from "./admin";
import { adminAuth } from "../middlewares/admin-auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicRouter);

/* Admin login endpoint — no auth guard */
router.post("/admin/login", (req, res) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "soori2024";
  const { password } = req.body as { password: string };
  if (password === ADMIN_PASSWORD) return res.json({ success: true, token: password });
  return res.status(401).json({ error: "Wrong password" });
});

router.use("/admin", adminRouter);

export default router;
