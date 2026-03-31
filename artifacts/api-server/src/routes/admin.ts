import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  studentsTable, paymentsTable, zoomSessionsTable,
  siteSettingsTable, adminMessagesTable
} from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { adminAuth } from "../middlewares/admin-auth";

const router: IRouter = Router();
router.use(adminAuth);

/* ── POST /api/admin/login ── verify password */
router.post("/login", (req, res) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "soori2024";
  const { password } = req.body as { password: string };
  if (password === ADMIN_PASSWORD) return res.json({ success: true, token: password });
  return res.status(401).json({ error: "Wrong password" });
});

/* ── GET /api/admin/stats ── dashboard stats */
router.get("/stats", async (_req, res) => {
  try {
    const [{ total }]    = await db.select({ total: sql<number>`count(*)::int` }).from(studentsTable);
    const [{ pending }]  = await db.select({ pending:  sql<number>`count(*)::int` }).from(studentsTable).where(eq(studentsTable.status, "pending"));
    const [{ approved }] = await db.select({ approved: sql<number>`count(*)::int` }).from(studentsTable).where(eq(studentsTable.status, "approved"));
    const [{ rejected }] = await db.select({ rejected: sql<number>`count(*)::int` }).from(studentsTable).where(eq(studentsTable.status, "rejected"));
    return res.json({ total, pending, approved, rejected });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── GET /api/admin/students ── list all students with latest payment */
router.get("/students", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id:        studentsTable.id,
        name:      studentsTable.name,
        phone:     studentsTable.phone,
        email:     studentsTable.email,
        country:   studentsTable.country,
        batch:     studentsTable.batch,
        status:    studentsTable.status,
        notes:     studentsTable.notes,
        createdAt: studentsTable.createdAt,
        paymentStatus:   paymentsTable.status,
        paymentId:       paymentsTable.id,
        receiptData:     paymentsTable.receiptData,
        paymentCreatedAt: paymentsTable.createdAt,
      })
      .from(studentsTable)
      .leftJoin(paymentsTable, eq(paymentsTable.studentId, studentsTable.id))
      .orderBy(desc(studentsTable.createdAt));
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── PATCH /api/admin/students/:id ── update student status/notes */
router.patch("/students/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body as { status?: string; notes?: string };
    const update: Partial<typeof studentsTable.$inferInsert> = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    await db.update(studentsTable).set(update).where(eq(studentsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── PATCH /api/admin/payments/:id ── approve/reject payment */
router.patch("/payments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status: string };
    await db.update(paymentsTable).set({
      status,
      reviewedAt: new Date(),
    }).where(eq(paymentsTable.id, id));

    const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, id));
    if (payment && status === "approved") {
      await db.update(studentsTable).set({ status: "approved" }).where(eq(studentsTable.id, payment.studentId));
    }
    if (payment && status === "rejected") {
      await db.update(studentsTable).set({ status: "rejected" }).where(eq(studentsTable.id, payment.studentId));
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── GET /api/admin/zoom ── list zoom sessions */
router.get("/zoom", async (_req, res) => {
  try {
    const rows = await db.select().from(zoomSessionsTable).orderBy(zoomSessionsTable.batch, zoomSessionsTable.weekNumber);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── POST /api/admin/zoom ── create zoom session */
router.post("/zoom", async (req, res) => {
  try {
    const { batch, weekNumber, title, zoomLink, passcode, isActive } = req.body;
    const [row] = await db.insert(zoomSessionsTable).values({
      batch, weekNumber: Number(weekNumber), title, zoomLink, passcode,
      isActive: isActive !== false,
    }).returning();
    return res.status(201).json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── PATCH /api/admin/zoom/:id ── update zoom session */
router.patch("/zoom/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { batch, weekNumber, title, zoomLink, passcode, isActive } = req.body;
    const update: Partial<typeof zoomSessionsTable.$inferInsert> = { updatedAt: new Date() };
    if (batch      !== undefined) update.batch      = batch;
    if (weekNumber !== undefined) update.weekNumber = Number(weekNumber);
    if (title      !== undefined) update.title      = title;
    if (zoomLink   !== undefined) update.zoomLink   = zoomLink;
    if (passcode   !== undefined) update.passcode   = passcode;
    if (isActive   !== undefined) update.isActive   = isActive;
    await db.update(zoomSessionsTable).set(update).where(eq(zoomSessionsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── DELETE /api/admin/zoom/:id */
router.delete("/zoom/:id", async (req, res) => {
  try {
    await db.delete(zoomSessionsTable).where(eq(zoomSessionsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── GET /api/admin/settings ── all settings */
router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const out: Record<string, string> = {};
    for (const r of rows) if (r.value) out[r.key] = r.value;
    return res.json(out);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── PUT /api/admin/settings ── upsert settings */
router.put("/settings", async (req, res) => {
  try {
    const settings = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(settings)) {
      await db
        .insert(siteSettingsTable)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── GET /api/admin/messages/:studentId */
router.get("/messages/:studentId", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(adminMessagesTable)
      .where(eq(adminMessagesTable.studentId, Number(req.params.studentId)))
      .orderBy(desc(adminMessagesTable.sentAt));
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── POST /api/admin/messages ── send message to student */
router.post("/messages", async (req, res) => {
  try {
    const { studentId, message } = req.body as { studentId: number; message: string };
    const [msg] = await db.insert(adminMessagesTable).values({ studentId, message }).returning();
    return res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
});

/* ── POST /api/admin/login (no auth guard needed for login itself) ─────── */
export default router;
