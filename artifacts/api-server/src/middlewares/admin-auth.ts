import type { Request, Response, NextFunction } from "express";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "soori2024";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: "Unauthorized" });
}
