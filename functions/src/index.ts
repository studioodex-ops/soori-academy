import * as functions from "firebase-functions";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

const app: Express = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "soori2024";

function verifyAdmin(req: Request): boolean {
  const auth = req.headers.authorization;
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === ADMIN_PASSWORD;
}

// Helper to get string from request params
function getStringParam(req: Request, param: string): string {
  const value = req.params[param];
  return typeof value === "string" ? value : "";
}

// ============ PUBLIC ROUTES ============

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/settings", async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("siteSettings").get();
    const settings: Record<string, string> = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      settings[doc.id] = data?.value ?? "";
    });
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

const studentSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  country: z.string().min(2),
  batch: z.string().min(1),
  medium: z.string().optional(),
});

app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const data = studentSchema.parse(req.body);
    const studentRef = await db.collection("students").add({
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, studentId: studentRef.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data", details: error.errors });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
});

app.post("/api/register/:studentId/receipt", async (req: Request, res: Response) => {
  try {
    const studentId = getStringParam(req, "studentId");
    const { receiptData } = req.body as { receiptData: string };

    const paymentRef = await db.collection("payments").add({
      studentId,
      receiptData,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await db.collection("students").doc(studentId).update({
      paymentId: paymentRef.id,
      paymentStatus: "pending",
    });

    res.json({ success: true, paymentId: paymentRef.id });
  } catch {
    res.status(500).json({ error: "Receipt upload failed" });
  }
});

// ============ ADMIN ROUTES ============

app.post("/api/admin/login", (req: Request, res: Response) => {
  const { password } = req.body as { password: string };
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: password });
  } else {
    res.status(401).json({ error: "Wrong password" });
  }
});

const adminOnly = (req: Request, res: Response, next: express.NextFunction) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/api/admin/stats", adminOnly, async (_req: Request, res: Response) => {
  try {
    const studentsSnap = await db.collection("students").get();
    const paymentsSnap = await db.collection("payments").get();

    let pending = 0, approved = 0, rejected = 0;

    paymentsSnap.forEach((doc) => {
      const data = doc.data();
      const status = data?.status;
      if (status === "pending") pending++;
      else if (status === "approved") approved++;
      else if (status === "rejected") rejected++;
    });

    res.json({
      total: studentsSnap.size,
      pending,
      approved,
      rejected,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/admin/students", adminOnly, async (_req: Request, res: Response) => {
  try {
    const studentsSnap = await db.collection("students").orderBy("createdAt", "desc").get();
    const paymentsSnap = await db.collection("payments").get();

    const paymentsMap: Record<string, { status?: string; receiptData?: string }> = {};
    paymentsSnap.forEach((doc) => {
      paymentsMap[doc.id] = doc.data() ?? {};
    });

    const students = studentsSnap.docs.map((doc) => {
      const data = doc.data() ?? {};
      const payment = data.paymentId ? paymentsMap[data.paymentId] : null;

      let status = data.status ?? "pending";
      if (payment?.status === "approved") status = "approved";
      else if (payment?.status === "rejected") status = "rejected";

      return {
        id: doc.id,
        name: data.name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        country: data.country ?? "",
        batch: data.batch ?? "",
        notes: data.notes ?? "",
        createdAt: data.createdAt ?? "",
        status,
        paymentStatus: payment?.status ?? null,
        paymentId: data.paymentId ?? null,
        receiptData: payment?.receiptData ?? null,
      };
    });

    res.json(students);
  } catch {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.patch("/api/admin/students/:studentId", adminOnly, async (req: Request, res: Response) => {
  try {
    const studentId = getStringParam(req, "studentId");
    const { notes } = req.body as { notes?: string };

    await db.collection("students").doc(studentId).update({ notes });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update student" });
  }
});

app.patch("/api/admin/payments/:paymentId", adminOnly, async (req: Request, res: Response) => {
  try {
    const paymentId = getStringParam(req, "paymentId");
    const { status } = req.body as { status: "approved" | "rejected" };

    await db.collection("payments").doc(paymentId).update({
      status,
      reviewedAt: new Date().toISOString(),
    });

    const paymentDoc = await db.collection("payments").doc(paymentId).get();
    const paymentData = paymentDoc.data();
    const studentId = paymentData?.studentId;

    if (studentId) {
      await db.collection("students").doc(studentId).update({
        status,
        paymentStatus: status,
      });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update payment" });
  }
});

app.get("/api/admin/zoom", adminOnly, async (_req: Request, res: Response) => {
  try {
    const snap = await db.collection("zoomSessions").orderBy("createdAt", "desc").get();
    const sessions = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(sessions);
  } catch {
    res.status(500).json({ error: "Failed to fetch zoom sessions" });
  }
});

app.post("/api/admin/zoom", adminOnly, async (req: Request, res: Response) => {
  try {
    const ref = await db.collection("zoomSessions").add({
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, id: ref.id });
  } catch {
    res.status(500).json({ error: "Failed to add zoom session" });
  }
});

app.patch("/api/admin/zoom/:sessionId", adminOnly, async (req: Request, res: Response) => {
  try {
    const sessionId = getStringParam(req, "sessionId");
    await db.collection("zoomSessions").doc(sessionId).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update zoom session" });
  }
});

app.delete("/api/admin/zoom/:sessionId", adminOnly, async (req: Request, res: Response) => {
  try {
    const sessionId = getStringParam(req, "sessionId");
    await db.collection("zoomSessions").doc(sessionId).delete();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete zoom session" });
  }
});

// ============ VIDEO SESSIONS ============

app.get("/api/admin/video-sessions", adminOnly, async (_req: Request, res: Response) => {
  try {
    const snap = await db.collection("videoSessions").orderBy("createdAt", "desc").get();
    res.json(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch {
    res.status(500).json({ error: "Failed to fetch video sessions" });
  }
});

app.post("/api/admin/video-sessions", adminOnly, async (req: Request, res: Response) => {
  try {
    const ref = await db.collection("videoSessions").add({
      ...req.body,
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, id: ref.id });
  } catch {
    res.status(500).json({ error: "Failed to add video session" });
  }
});

app.patch("/api/admin/video-sessions/:id", adminOnly, async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req, "id");
    await db.collection("videoSessions").doc(id).update({
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update video session" });
  }
});

app.delete("/api/admin/video-sessions/:id", adminOnly, async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req, "id");
    await db.collection("videoSessions").doc(id).delete();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete video session" });
  }
});

// Convert Google Drive link to embed URL
function toEmbedUrl(driveLink: string): string | null {
  if (!driveLink) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  if (/^[a-zA-Z0-9_-]{10,}$/.test(driveLink)) {
    return `https://drive.google.com/file/d/${driveLink}/preview`;
  }
  return null;
}

// Student verification by phone number
app.post("/api/verify-student", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body as { phone: string };
    if (!phone) return res.json({ verified: false });

    const normalizedPhone = phone.replace(/\D/g, "");
    let snap = await db.collection("students").where("phone", "==", normalizedPhone).limit(1).get();

    if (snap.empty) {
      snap = await db.collection("students").where("phone", "==", phone).limit(1).get();
      if (snap.empty) return res.json({ verified: false });
    }

    const doc = snap.docs[0];
    const student = doc.data();
    if (student?.status !== "approved") return res.json({ verified: false, reason: "not_approved" });

    res.json({
      verified: true,
      studentId: doc.id,
      name: student.name,
      medium: student.medium || "sinhala",
    });
  } catch {
    res.json({ verified: false });
  }
});

// Student middleware
async function verifyStudent(req: Request, res: Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Student ")) {
    return res.status(401).json({ error: "Student verification required" });
  }
  try {
    const token = authHeader.replace("Student ", "");
    const data = JSON.parse(Buffer.from(token, "base64").toString()) as {
      phone: string; studentId: string; name: string; medium: string; batch?: string;
    };

    const studentDoc = await db.collection("students").doc(data.studentId).get();
    if (!studentDoc.exists) return res.status(401).json({ error: "Invalid session" });

    const student = studentDoc.data();
    if (student?.phone !== data.phone || student?.status !== "approved") {
      return res.status(401).json({ error: "Session expired or unauthorized" });
    }

    (req as any).student = {
      studentId: data.studentId,
      name: student.name,
      phone: student.phone,
      medium: student.medium,
      batch: student.batch,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid session token" });
  }
}

// Get video sessions for verified students
app.get("/api/video-sessions", verifyStudent, async (req: Request, res: Response) => {
  try {
    const student = (req as any).student;
    const medium = (req.query.medium as string) || student.medium || "sinhala";

    const snap = await db.collection("videoSessions")
      .where("medium", "==", medium)
      .where("isActive", "==", true)
      .orderBy("weekNumber", "asc")
      .get();

    const sessions = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        weekNumber: data.weekNumber,
        description: data.description,
        medium: data.medium,
        embedUrl: toEmbedUrl(data.driveLink),
      };
    });
    res.json(sessions);
  } catch {
    res.json([]);
  }
});

// Get active zoom sessions for student
app.get("/api/zoom-sessions", verifyStudent, async (req: Request, res: Response) => {
  try {
    const student = (req as any).student;
    const snap = await db.collection("zoomSessions")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();
    
    const sessions = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter((d: any) => !d.batch || d.batch === student.batch || student.batch === "self-paced")
      .map((d: any) => ({
        id: d.id,
        title: d.title,
        weekNumber: d.weekNumber,
        batch: d.batch,
        passcode: d.passcode
      }));
    res.json(sessions);
  } catch (err) {
    res.json([]);
  }
});

// Join zoom session securely
app.post("/api/join-zoom/:id", verifyStudent, async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req, "id");
    const doc = await db.collection("zoomSessions").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Not found" });
    }
    const data = doc.data();
    if (!data?.isActive) {
      return res.status(403).json({ error: "Session inactive" });
    }
    res.json({ url: data.zoomLink });
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// ============ SETTINGS ============

app.get("/api/admin/settings", adminOnly, async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("siteSettings").get();
    const settings: Record<string, string> = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      settings[doc.id] = data?.value ?? "";
    });
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.put("/api/admin/settings", adminOnly, async (req: Request, res: Response) => {
  try {
    const settings = req.body as Record<string, string>;
    const batch = db.batch();

    for (const [key, value] of Object.entries(settings)) {
      const ref = db.collection("siteSettings").doc(key);
      batch.set(ref, { value, updatedAt: new Date().toISOString() }, { merge: true });
    }

    await batch.commit();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to save settings" });
  }
});

app.get("/api/admin/messages/:studentId", adminOnly, async (req: Request, res: Response) => {
  try {
    const studentId = getStringParam(req, "studentId");
    const snap = await db.collection("adminMessages")
      .where("studentId", "==", studentId)
      .orderBy("sentAt", "desc")
      .get();

    const messages = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/admin/messages", adminOnly, async (req: Request, res: Response) => {
  try {
    const { studentId, message } = req.body as { studentId: string; message: string };
    const ref = await db.collection("adminMessages").add({
      studentId,
      message,
      sentAt: new Date().toISOString(),
    });
    res.json({ success: true, id: ref.id, studentId, message, sentAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ error: "Failed to add message" });
  }
});

export const api = functions.https.onRequest(app);