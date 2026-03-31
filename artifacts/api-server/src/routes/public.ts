import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  studentsTable, paymentsTable, siteSettingsTable,
  zoomSessionsTable, insertStudentSchema
} from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

/* ── POST /api/register ── */
router.post("/register", async (req, res) => {
  try {
    const parsed = insertStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });
    }

    const [student] = await db.insert(studentsTable).values(parsed.data).returning();

    await db.insert(paymentsTable).values({
      studentId: student.id,
      amount: "Rs. 7,000",
      status: "pending",
    });

    return res.status(201).json({ success: true, studentId: student.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

/* ── POST /api/register/:id/receipt ── upload receipt image as base64 */
router.post("/register/:id/receipt", async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    const { receiptData } = req.body as { receiptData: string };
    if (!receiptData) return res.status(400).json({ error: "No receipt data" });

    await db
      .update(paymentsTable)
      .set({ receiptData })
      .where(eq(paymentsTable.studentId, studentId));

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

/* ── GET /api/settings ── public site settings */
router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = {};
    for (const r of rows) if (r.value) settings[r.key] = r.value;
    return res.json(settings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── GET /api/zoom/approved?phone=xxx ── zoom link only for approved students */
router.get("/zoom/approved", async (req, res) => {
  try {
    const phone = (req.query.phone as string)?.trim();
    if (!phone) return res.status(400).json({ error: "Phone required" });

    const [student] = await db
      .select()
      .from(studentsTable)
      .where(and(eq(studentsTable.phone, phone), eq(studentsTable.status, "approved")))
      .limit(1);

    if (!student) return res.status(403).json({ error: "Not found or not approved" });

    const sessions = await db
      .select()
      .from(zoomSessionsTable)
      .where(and(eq(zoomSessionsTable.batch, student.batch ?? ""), eq(zoomSessionsTable.isActive, true)));

    return res.json({ sessions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

export default router;
