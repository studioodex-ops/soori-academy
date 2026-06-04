import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Video, Settings, MessageSquare,
  LogOut, CheckCircle2, XCircle, Clock, Eye, Send, Plus,
  Pencil, Trash2, Save, X, RefreshCw, Copy, ExternalLink,
  ChevronDown, ChevronUp, Search, Image as ImageIcon, Upload, Trash,
  MonitorPlay
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, logOut, onAuthChange, auth, ADMIN_EMAILS } from "@/lib/firebase";

const API = "/api";

type Tab = "dashboard" | "students" | "zoom" | "videos" | "settings" | "messages";

type Student = {
  id: string; name: string; phone: string; email?: string; country?: string;
  batch?: string; status: string; notes?: string; createdAt: string;
  paymentStatus?: string; paymentId?: string; receiptData?: string;
};
type ZoomSession = {
  id: string; batch: string; weekNumber: number; title?: string;
  zoomLink?: string; passcode?: string; isActive: boolean;
};
type VideoSession = {
  id: string; title: string; weekNumber: number; description: string;
  driveLink: string; medium: "sinhala" | "tamil" | "english"; isActive: boolean;
};
type Stats = { total: number; pending: number; approved: number; rejected: number };

function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
}

/* ── LOGIN SCREEN WITH GOOGLE SIGN-IN ─────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: (t: string, u: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { toast } = useToast();

  async function handleGoogleLogin() {
    setLoading(true); setErr("");
    try {
      const result = await signInWithGoogle();
      if (result.success && result.token) {
        sessionStorage.setItem("admin_token", result.token);
        onLogin(result.token, result.user);
        toast({ title: "Login successful!", description: `Welcome, ${result.user.email}` });
      } else {
        setErr(result.error || "Access denied. Unauthorized email.");
      }
    } catch (error) {
      setErr("Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#18191a" }}>
      <motion.div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "#242526", border: "1px solid #3a3b3c" }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(24,119,242,0.15)", border: "1px solid rgba(24,119,242,0.3)" }}>
            <LayoutDashboard className="w-7 h-7" style={{ color: "#1877F2" }} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-sm" style={{ color: "#b0b3b8" }}>With Soori Academy</p>
        </div>

        <Button onClick={handleGoogleLogin} disabled={loading} className="w-full h-12 font-bold rounded-xl text-white border-0 flex items-center justify-center gap-3"
          style={{ background: "#1877F2" }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.19 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Signing in..." : "Sign in with Google"}
        </Button>

        {err && <p className="text-red-400 text-sm mt-4 text-center">{err}</p>}

        <p className="text-center text-xs mt-6" style={{ color: "#65676b" }}>
          Only authorized Gmail accounts can access admin panel
        </p>
      </motion.div>
    </div>
  );
}

/* ── STATUS BADGE ──────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    approved: { bg: "rgba(16,185,129,0.15)", text: "#10b981", label: "Approved" },
    pending:  { bg: "rgba(245,158,11,0.15)",  text: "#f59e0b", label: "Pending" },
    rejected: { bg: "rgba(239,68,68,0.15)",   text: "#ef4444", label: "Rejected" },
  };
  const c = map[status] ?? map.pending;
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
}

/* ── DASHBOARD ─────────────────────────────────────────────── */
function Dashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/stats", token);
    if (r.ok) setStats(await r.json());
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const cards = stats ? [
    { label: "Total Students",  val: stats.total,    color: "#1877F2" },
    { label: "Pending Payment", val: stats.pending,  color: "#f59e0b" },
    { label: "Approved",        val: stats.approved, color: "#10b981" },
    { label: "Rejected",        val: stats.rejected, color: "#ef4444" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Dashboard</h2>
        <Button variant="ghost" size="sm" onClick={load} className="text-sm" style={{ color: "#b0b3b8" }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="rounded-2xl p-5" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
            <p className="text-3xl font-display font-bold text-white mb-1">{c.val}</p>
            <p className="text-xs font-semibold" style={{ color: c.color }}>{c.label}</p>
          </div>
        ))}
        {!stats && <div className="col-span-4 text-center py-12" style={{ color: "#65676b" }}>Loading…</div>}
      </div>
      <div className="rounded-2xl p-6" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
        <h3 className="font-display font-bold text-white mb-3">Quick Guide</h3>
        <ul className="space-y-2 text-sm" style={{ color: "#b0b3b8" }}>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#1877F2] flex-shrink-0 mt-0.5" /> <span><strong className="text-white">Students</strong> — View registrations, approve/reject payments, view receipt photos, add notes.</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#1877F2] flex-shrink-0 mt-0.5" /> <span><strong className="text-white">Zoom Sessions</strong> — Add/edit Zoom links and passcodes per week. Links are only visible here and sent manually to students.</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#1877F2] flex-shrink-0 mt-0.5" /> <span><strong className="text-white">Video Sessions</strong> — Upload Google Drive video links per medium (Sinhala/Tamil/English). Students access these via phone verification on the website — links are never exposed.</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#1877F2] flex-shrink-0 mt-0.5" /> <span><strong className="text-white">Site Settings</strong> — Change the batch name, course features, and fee shown on the public website.</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#1877F2] flex-shrink-0 mt-0.5" /> <span><strong className="text-white">Messages</strong> — Record notes/messages sent to each student.</span></li>
        </ul>
      </div>
    </div>
  );
}

/* ── STUDENT DETAIL MODAL ──────────────────────────────────── */
function StudentModal({ student, token, onClose, onRefresh }: {
  student: Student; token: string; onClose: () => void; onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(student.notes ?? "");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<{ id: string; message: string; sentAt: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch(`/admin/messages/${student.id}`, token)
      .then(r => r.json()).then(setMessages).catch(() => {});
  }, [student.id, token]);

  async function approve(status: string) {
    if (!student.paymentId) { toast({ title: "No payment record found" }); return; }
    setSaving(true);
    await apiFetch(`/admin/payments/${student.paymentId}`, token, {
      method: "PATCH", body: JSON.stringify({ status }),
    });
    toast({ title: status === "approved" ? "Payment Approved ✓" : "Payment Rejected" });
    onRefresh(); onClose();
    setSaving(false);
  }

  async function saveNotes() {
    setSaving(true);
    await apiFetch(`/admin/students/${student.id}`, token, {
      method: "PATCH", body: JSON.stringify({ notes }),
    });
    toast({ title: "Notes saved" });
    setSaving(false);
  }

  async function sendMessage() {
    if (!msg.trim()) return;
    setSaving(true);
    const r = await apiFetch("/admin/messages", token, {
      method: "POST", body: JSON.stringify({ studentId: student.id, message: msg }),
    });
    if (r.ok) {
      const newMsg = await r.json();
      setMessages(prev => [newMsg, ...prev]);
      setMsg("");
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: "#242526", border: "1px solid #3a3b3c" }}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#3a3b3c" }}>
          <div>
            <h3 className="text-xl font-display font-bold text-white">{student.name}</h3>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>{student.phone} · {student.email} · {student.country}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" style={{ color: "#b0b3b8" }} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Status row */}
          <div className="flex flex-wrap gap-3 items-center">
            <StatusBadge status={student.status} />
            <span className="text-sm" style={{ color: "#b0b3b8" }}>Batch: <strong className="text-white">{student.batch}</strong></span>
            <span className="text-sm" style={{ color: "#b0b3b8" }}>Registered: {new Date(student.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Payment actions */}
          <div className="rounded-xl p-4" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
            <p className="text-sm font-bold text-white mb-3">Payment</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={student.paymentStatus ?? "pending"} />
            </div>
            {student.status !== "approved" && (
              <div className="flex gap-3">
                <Button size="sm" disabled={saving} onClick={() => approve("approved")}
                  className="font-bold rounded-lg text-white border-0 flex-1" style={{ background: "#10b981" }}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button size="sm" disabled={saving} onClick={() => approve("rejected")}
                  className="font-bold rounded-lg text-white border-0 flex-1" style={{ background: "#ef4444" }}>
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
              </div>
            )}
            {student.status === "approved" && (
              <Button size="sm" disabled={saving} onClick={() => approve("rejected")}
                className="font-bold rounded-lg text-white border-0" style={{ background: "#ef4444" }}>
                Revoke Approval
              </Button>
            )}
          </div>

          {/* Receipt */}
          {student.receiptData && (
            <div className="rounded-xl p-4" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
              <p className="text-sm font-bold text-white mb-3">Payment Receipt</p>
              <img src={student.receiptData} alt="Receipt" className="max-w-full rounded-xl max-h-64 object-contain mx-auto" />
            </div>
          )}
          {!student.receiptData && (
            <div className="rounded-xl p-4 text-center" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
              <p className="text-sm" style={{ color: "#65676b" }}>No receipt uploaded yet</p>
            </div>
          )}

          {/* WhatsApp quick link */}
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#18191a", border: "1px solid rgba(37,211,102,0.25)" }}>
            <div>
              <p className="text-sm font-bold text-white">Contact on WhatsApp</p>
              <p className="text-xs" style={{ color: "#b0b3b8" }}>{student.phone}</p>
            </div>
            <a href={`https://wa.me/${student.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="font-bold rounded-lg text-white border-0" style={{ background: "#25D366" }}>
                Open WhatsApp
              </Button>
            </a>
          </div>

          {/* Notes */}
          <div className="rounded-xl p-4" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
            <p className="text-sm font-bold text-white mb-2">Internal Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add private notes about this student…"
              className="w-full rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-[#1877F2]"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
            />
            <Button size="sm" onClick={saveNotes} disabled={saving}
              className="mt-2 font-bold rounded-lg text-white border-0" style={{ background: "#1877F2" }}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save Notes
            </Button>
          </div>

          {/* Messages */}
          <div className="rounded-xl p-4" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
            <p className="text-sm font-bold text-white mb-3">Message History</p>
            {messages.length === 0 && <p className="text-xs" style={{ color: "#65676b" }}>No messages yet.</p>}
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className="rounded-lg p-3" style={{ background: "#242526" }}>
                  <p className="text-sm text-white">{m.message}</p>
                  <p className="text-xs mt-1" style={{ color: "#65676b" }}>{new Date(m.sentAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 h-9 rounded-xl text-white text-sm border"
                style={{ background: "#242526", borderColor: "#3a3b3c" }}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <Button size="sm" onClick={sendMessage} disabled={saving || !msg.trim()}
                className="font-bold rounded-xl text-white border-0 px-4" style={{ background: "#1877F2" }}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── STUDENTS TAB ──────────────────────────────────────────── */
function StudentsTab({ token }: { token: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/admin/students", token);
    if (r.ok) setStudents(await r.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.phone.includes(q) || (s.email ?? "").toLowerCase().includes(q);
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-2xl font-display font-bold text-white flex-1">Students</h2>
        <Button variant="ghost" size="sm" onClick={load} style={{ color: "#b0b3b8" }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#65676b" }} />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone or email…"
            className="pl-9 h-10 rounded-xl text-white border text-sm" style={{ background: "#242526", borderColor: "#3a3b3c" }} />
        </div>
        <div className="flex gap-2">
          {["all","pending","approved","rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors"
              style={{ background: filter === f ? "#1877F2" : "#242526", color: filter === f ? "#fff" : "#b0b3b8", border: "1px solid #3a3b3c" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-12" style={{ color: "#65676b" }}>Loading…</div>}
      {!loading && filtered.length === 0 && <div className="text-center py-12" style={{ color: "#65676b" }}>No students found.</div>}

      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id}
            onClick={() => setSelected(s)}
            className="flex items-center gap-4 rounded-xl p-4 cursor-pointer transition-colors hover:bg-white/5"
            style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: "rgba(24,119,242,0.2)" }}>
              {s.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{s.name}</p>
              <p className="text-xs truncate" style={{ color: "#b0b3b8" }}>{s.phone} · {s.country} · {s.batch}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={s.status} />
              <span className="text-xs hidden sm:block" style={{ color: "#65676b" }}>{new Date(s.createdAt).toLocaleDateString()}</span>
              <Eye className="w-4 h-4" style={{ color: "#65676b" }} />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <StudentModal student={selected} token={token} onClose={() => setSelected(null)} onRefresh={load} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── ZOOM SESSIONS TAB ─────────────────────────────────────── */
function ZoomTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ZoomSession[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const emptyForm = { batch: "", weekNumber: 1, title: "", zoomLink: "", passcode: "", isActive: true };
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState<ZoomSession | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/zoom", token);
    if (r.ok) setSessions(await r.json());
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: "Copied!" });
    setTimeout(() => setCopied(null), 1500);
  }

  async function addSession() {
    const r = await apiFetch("/admin/zoom", token, {
      method: "POST", body: JSON.stringify({ ...form, weekNumber: Number(form.weekNumber) }),
    });
    if (r.ok) { toast({ title: "Session added" }); load(); setShowAdd(false); setForm({ ...emptyForm }); }
  }

  async function saveEdit() {
    if (!editForm) return;
    await apiFetch(`/admin/zoom/${editForm.id}`, token, {
      method: "PATCH", body: JSON.stringify(editForm),
    });
    toast({ title: "Session updated" });
    load(); setEditId(null); setEditForm(null);
  }

  async function deleteSession(id: string) {
    if (!confirm("Delete this zoom session?")) return;
    await apiFetch(`/admin/zoom/${id}`, token, { method: "DELETE" });
    toast({ title: "Deleted" }); load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-display font-bold text-white flex-1">Zoom Sessions</h2>
        <Button size="sm" onClick={() => setShowAdd(v => !v)}
          className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
          <Plus className="w-4 h-4 mr-1" /> Add Session
        </Button>
        <Button variant="ghost" size="sm" onClick={load} style={{ color: "#b0b3b8" }}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div className="rounded-2xl p-5 space-y-3" style={{ background: "#242526", border: "1px solid #1877F2" }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <p className="font-bold text-white text-sm mb-2">New Zoom Session</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Batch (e.g. Batch 14)" value={form.batch} onChange={v => setForm(p => ({ ...p, batch: v }))} />
              <Field label="Week Number" value={String(form.weekNumber)} type="number" onChange={v => setForm(p => ({ ...p, weekNumber: Number(v) }))} />
            </div>
            <Field label="Title (e.g. Week 1 — CM Tool Setup)" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
            <Field label="Zoom Link" value={form.zoomLink} onChange={v => setForm(p => ({ ...p, zoomLink: v }))} />
            <Field label="Passcode" value={form.passcode} onChange={v => setForm(p => ({ ...p, passcode: v }))} />
            <div className="flex gap-3">
              <Button size="sm" onClick={addSession} className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)} style={{ color: "#b0b3b8" }}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {sessions.length === 0 && <div className="text-center py-12" style={{ color: "#65676b" }}>No sessions yet. Add one above.</div>}
        {sessions.map(s => (
          <div key={s.id} className="rounded-2xl p-5" style={{ background: "#242526", border: `1px solid ${s.isActive ? "#1877F2" : "#3a3b3c"}` }}>
            {editId === s.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Batch" value={editForm.batch} onChange={v => setEditForm(p => p ? { ...p, batch: v } : null)} />
                  <Field label="Week Number" value={String(editForm.weekNumber)} type="number" onChange={v => setEditForm(p => p ? { ...p, weekNumber: Number(v) } : null)} />
                </div>
                <Field label="Title" value={editForm.title ?? ""} onChange={v => setEditForm(p => p ? { ...p, title: v } : null)} />
                <Field label="Zoom Link" value={editForm.zoomLink ?? ""} onChange={v => setEditForm(p => p ? { ...p, zoomLink: v } : null)} />
                <Field label="Passcode" value={editForm.passcode ?? ""} onChange={v => setEditForm(p => p ? { ...p, passcode: v } : null)} />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input type="checkbox" checked={editForm.isActive}
                      onChange={e => setEditForm(p => p ? { ...p, isActive: e.target.checked } : null)} />
                    Active
                  </label>
                  <Button size="sm" onClick={saveEdit} className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditId(null); setEditForm(null); }} style={{ color: "#b0b3b8" }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold text-white">{s.batch} — Week {s.weekNumber}</span>
                      {!s.isActive && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#3a3b3c", color: "#65676b" }}>Inactive</span>}
                    </div>
                    {s.title && <p className="text-sm" style={{ color: "#b0b3b8" }}>{s.title}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditId(s.id); setEditForm({ ...s }); }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" style={{ color: "#b0b3b8" }} />
                    </button>
                    <button onClick={() => deleteSession(s.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                {s.zoomLink && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#18191a" }}>
                      <span className="text-xs flex-1 truncate font-mono" style={{ color: "#b0b3b8" }}>{s.zoomLink}</span>
                      <button onClick={() => copyText(s.zoomLink!, `link-${s.id}`)} className="p-1 rounded hover:bg-white/10 transition-colors">
                        {copied === `link-${s.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1877F2]" /> : <Copy className="w-3.5 h-3.5" style={{ color: "#65676b" }} />}
                      </button>
                      <a href={s.zoomLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" style={{ color: "#65676b" }} />
                      </a>
                    </div>
                    {s.passcode && (
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#18191a" }}>
                        <span className="text-xs" style={{ color: "#b0b3b8" }}>Passcode:</span>
                        <span className="text-xs font-mono font-bold text-white">{s.passcode}</span>
                        <button onClick={() => copyText(s.passcode!, `pass-${s.id}`)} className="p-1 rounded hover:bg-white/10 transition-colors ml-auto">
                          {copied === `pass-${s.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1877F2]" /> : <Copy className="w-3.5 h-3.5" style={{ color: "#65676b" }} />}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── VIDEO SESSIONS TAB ─────────────────────────────────────── */
function VideoSessionsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [medium, setMedium] = useState<"sinhala" | "tamil" | "english">("sinhala");
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const emptyForm = { title: "", weekNumber: 1, description: "", driveLink: "", medium: "sinhala" as const, isActive: true };
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState<VideoSession | null>(null);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/video-sessions", token);
    if (r.ok) setSessions(await r.json());
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function addSession() {
    const r = await apiFetch("/admin/video-sessions", token, {
      method: "POST", body: JSON.stringify({ ...form, medium, weekNumber: Number(form.weekNumber) }),
    });
    if (r.ok) { toast({ title: "Video session added" }); load(); setShowAdd(false); setForm({ ...emptyForm }); }
  }

  async function saveEdit() {
    if (!editForm) return;
    await apiFetch(`/admin/video-sessions/${editForm.id}`, token, {
      method: "PATCH", body: JSON.stringify(editForm),
    });
    toast({ title: "Video session updated" });
    load(); setEditId(null); setEditForm(null);
  }

  async function deleteSession(id: string) {
    if (!confirm("Delete this video session?")) return;
    await apiFetch(`/admin/video-sessions/${id}`, token, { method: "DELETE" });
    toast({ title: "Deleted" }); load();
  }

  const filtered = sessions.filter(s => s.medium === medium);

  const mediums: { id: "sinhala" | "tamil" | "english"; label: string }[] = [
    { id: "sinhala", label: "Sinhala Medium" },
    { id: "tamil", label: "Tamil Medium" },
    { id: "english", label: "English Medium" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-2xl font-display font-bold text-white flex-1">Video Sessions</h2>
        <Button size="sm" onClick={() => { setShowAdd(v => !v); setForm({ ...emptyForm }); }}
          className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
          <Plus className="w-4 h-4 mr-1" /> Add Video
        </Button>
        <Button variant="ghost" size="sm" onClick={load} style={{ color: "#b0b3b8" }}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Medium sub-tabs */}
      <div className="flex gap-2">
        {mediums.map(m => (
          <button key={m.id} onClick={() => setMedium(m.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            style={{ background: medium === m.id ? "#1877F2" : "#242526", color: medium === m.id ? "#fff" : "#b0b3b8", border: "1px solid #3a3b3c" }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div className="rounded-2xl p-5 space-y-3" style={{ background: "#242526", border: "1px solid #1877F2" }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <p className="font-bold text-white text-sm mb-2">New Video — {mediums.find(m => m.id === medium)?.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Week Number" value={String(form.weekNumber)} type="number" onChange={v => setForm(p => ({ ...p, weekNumber: Number(v) }))} />
            </div>
            <Field label="Title (e.g. Week 1 — Content Creation Basics)" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
            <Field label="Description" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} />
            <Field label="Google Drive Link" value={form.driveLink} onChange={v => setForm(p => ({ ...p, driveLink: v }))} />
            <p className="text-[11px]" style={{ color: "#65676b" }}>Make sure the Google Drive file is set to "Anyone with the link can view".</p>
            <div className="flex gap-3">
              <Button size="sm" onClick={addSession} className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)} style={{ color: "#b0b3b8" }}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12" style={{ color: "#65676b" }}>No video sessions yet for this medium. Add one above.</div>}
        {filtered.sort((a, b) => a.weekNumber - b.weekNumber).map(s => (
          <div key={s.id} className="rounded-2xl p-5" style={{ background: "#242526", border: `1px solid ${s.isActive ? "#1877F2" : "#3a3b3c"}` }}>
            {editId === s.id && editForm ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Week Number" value={String(editForm.weekNumber)} type="number" onChange={v => setEditForm(p => p ? { ...p, weekNumber: Number(v) } : null)} />
                </div>
                <Field label="Title" value={editForm.title} onChange={v => setEditForm(p => p ? { ...p, title: v } : null)} />
                <Field label="Description" value={editForm.description} onChange={v => setEditForm(p => p ? { ...p, description: v } : null)} />
                <Field label="Google Drive Link" value={editForm.driveLink} onChange={v => setEditForm(p => p ? { ...p, driveLink: v } : null)} />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input type="checkbox" checked={editForm.isActive}
                      onChange={e => setEditForm(p => p ? { ...p, isActive: e.target.checked } : null)} />
                    Active
                  </label>
                  <Button size="sm" onClick={saveEdit} className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditId(null); setEditForm(null); }} style={{ color: "#b0b3b8" }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MonitorPlay className="w-4 h-4" style={{ color: "#1877F2" }} />
                      <span className="font-display font-bold text-white">Week {s.weekNumber}: {s.title}</span>
                      {!s.isActive && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#3a3b3c", color: "#65676b" }}>Inactive</span>}
                    </div>
                    {s.description && <p className="text-sm ml-6" style={{ color: "#b0b3b8" }}>{s.description}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditId(s.id); setEditForm({ ...s }); }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" style={{ color: "#b0b3b8" }} />
                    </button>
                    <button onClick={() => deleteSession(s.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2 ml-6" style={{ background: "#18191a" }}>
                  <span className="text-xs flex-1 truncate font-mono" style={{ color: "#b0b3b8" }}>{s.driveLink}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SITE SETTINGS TAB ─────────────────────────────────────── */
type SettingField =
  | { key: string; label: string; type?: "text"; help?: string }
  | { key: string; label: string; type: "textarea"; rows?: number; help?: string }
  | { key: string; label: string; type: "image"; help?: string };

type SettingGroup = { title: string; desc?: string; fields: SettingField[] };

function SettingsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Brand & Links": true });

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/settings", token);
    if (r.ok) setSettings(await r.json());
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function update(key: string, value: string) {
    setSettings(p => ({ ...p, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const r = await apiFetch("/admin/settings", token, { method: "PUT", body: JSON.stringify(settings) });
    if (r.ok) {
      toast({ title: "Saved ✓", description: "Changes will appear on the public site after refresh." });
    } else {
      toast({ title: "Save failed", description: "Image may be too large. Try a smaller one." });
    }
    setSaving(false);
  }

  const groups: SettingGroup[] = [
    {
      title: "Brand & Links",
      desc:  "Logo, brand name and social media links shown across the site.",
      fields: [
        { key: "brand_name",   label: "Brand Name (top-left)" },
        { key: "brand_tag",    label: "Brand Tag (small badge — e.g. Academy)" },
        { key: "profile_image",label: "Profile / Logo Image", type: "image", help: "Used in nav and footer (circular)." },
        { key: "facebook_url", label: "Facebook URL" },
        { key: "whatsapp_url", label: "WhatsApp Group URL" },
      ],
    },
    {
      title: "Hero Section",
      desc:  "The big top section visitors see first.",
      fields: [
        { key: "hero_badge",        label: "Top Badge" },
        { key: "hero_headline_1",   label: "Headline Line 1" },
        { key: "hero_headline_2",   label: "Headline Line 2 (blue)" },
        { key: "hero_headline_3",   label: "Headline Line 3" },
        { key: "hero_description",  label: "Description Paragraph", type: "textarea", rows: 3 },
        { key: "hero_btn_secondary",label: "Secondary Button Text (e.g. Watch Our Content)" },
        { key: "hero_image",        label: "Hero Image (right-side photo)", type: "image" },
        { key: "hero_image_name",   label: "Hero Photo — Name Caption" },
        { key: "hero_image_role",   label: "Hero Photo — Role Caption" },
        { key: "hero_ribbon",       label: "Top-right Ribbon (e.g. #1 in Sri Lanka)" },
        { key: "hero_stat_1",       label: "Trust Line 1 (e.g. 5,000+ students…)" },
        { key: "hero_stat_2",       label: "Trust Line 2 (e.g. 4.9/5 rating)" },
      ],
    },
    {
      title: "Ticker Bar",
      desc:  "Scrolling bar of student earnings. One entry per line.",
      fields: [
        { key: "ticker_text", label: "Ticker Entries (one per line)", type: "textarea", rows: 6 },
      ],
    },
    {
      title: "Stats Strip",
      desc:  "The 4 number tiles below the hero.",
      fields: [
        { key: "stat_1_value", label: "Stat 1 — Number" },
        { key: "stat_1_prefix",label: "Stat 1 — Prefix (e.g. $)" },
        { key: "stat_1_suffix",label: "Stat 1 — Suffix (e.g. K+, %)" },
        { key: "stat_1_label", label: "Stat 1 — Label" },
        { key: "stat_2_value", label: "Stat 2 — Number" },
        { key: "stat_2_prefix",label: "Stat 2 — Prefix" },
        { key: "stat_2_suffix",label: "Stat 2 — Suffix" },
        { key: "stat_2_label", label: "Stat 2 — Label" },
        { key: "stat_3_value", label: "Stat 3 — Number" },
        { key: "stat_3_prefix",label: "Stat 3 — Prefix" },
        { key: "stat_3_suffix",label: "Stat 3 — Suffix" },
        { key: "stat_3_label", label: "Stat 3 — Label" },
        { key: "stat_4_value", label: "Stat 4 — Number" },
        { key: "stat_4_prefix",label: "Stat 4 — Prefix" },
        { key: "stat_4_suffix",label: "Stat 4 — Suffix" },
        { key: "stat_4_label", label: "Stat 4 — Label" },
      ],
    },
    {
      title: "What You Will Learn (Curriculum)",
      desc:  "Three feature cards explaining the curriculum.",
      fields: [
        { key: "curriculum_eyebrow",  label: "Eyebrow (small text above title)" },
        { key: "curriculum_title",    label: "Section Title" },
        { key: "curriculum_subtitle", label: "Section Subtitle", type: "textarea", rows: 2 },
        { key: "learn_1_title", label: "Card 1 — Title" },
        { key: "learn_1_desc",  label: "Card 1 — Description", type: "textarea", rows: 3 },
        { key: "learn_2_title", label: "Card 2 — Title" },
        { key: "learn_2_desc",  label: "Card 2 — Description", type: "textarea", rows: 3 },
        { key: "learn_3_title", label: "Card 3 — Title" },
        { key: "learn_3_desc",  label: "Card 3 — Description", type: "textarea", rows: 3 },
      ],
    },
    {
      title: "How It Works (4 Steps)",
      fields: [
        { key: "howit_eyebrow", label: "Eyebrow" },
        { key: "howit_title",   label: "Section Title" },
        { key: "step_1_title",  label: "Step 1 — Title" },
        { key: "step_1_desc",   label: "Step 1 — Description" },
        { key: "step_2_title",  label: "Step 2 — Title" },
        { key: "step_2_desc",   label: "Step 2 — Description" },
        { key: "step_3_title",  label: "Step 3 — Title" },
        { key: "step_3_desc",   label: "Step 3 — Description" },
        { key: "step_4_title",  label: "Step 4 — Title" },
        { key: "step_4_desc",   label: "Step 4 — Description" },
      ],
    },
    {
      title: "Success Stories (Results)",
      desc:  "Four student success cards with photo, name, earnings and quote.",
      fields: [
        { key: "results_eyebrow",  label: "Eyebrow" },
        { key: "results_title",    label: "Section Title" },
        { key: "results_subtitle", label: "Section Subtitle", type: "textarea", rows: 2 },
        { key: "results_btn",      label: "Button Text" },
        { key: "success_1_image",  label: "Story 1 — Photo", type: "image" },
        { key: "success_1_name",   label: "Story 1 — Name" },
        { key: "success_1_earn",   label: "Story 1 — Earnings (e.g. $1,240/mo)" },
        { key: "success_1_quote",  label: "Story 1 — Quote", type: "textarea", rows: 2 },
        { key: "success_2_image",  label: "Story 2 — Photo", type: "image" },
        { key: "success_2_name",   label: "Story 2 — Name" },
        { key: "success_2_earn",   label: "Story 2 — Earnings" },
        { key: "success_2_quote",  label: "Story 2 — Quote", type: "textarea", rows: 2 },
        { key: "success_3_image",  label: "Story 3 — Photo", type: "image" },
        { key: "success_3_name",   label: "Story 3 — Name" },
        { key: "success_3_earn",   label: "Story 3 — Earnings" },
        { key: "success_3_quote",  label: "Story 3 — Quote", type: "textarea", rows: 2 },
        { key: "success_4_image",  label: "Story 4 — Photo", type: "image" },
        { key: "success_4_name",   label: "Story 4 — Name" },
        { key: "success_4_earn",   label: "Story 4 — Earnings" },
        { key: "success_4_quote",  label: "Story 4 — Quote", type: "textarea", rows: 2 },
      ],
    },
    {
      title: "Class Schedule — Live Batch",
      desc:  "Update each new batch (Batch 14, 15, 16…) here.",
      fields: [
        { key: "schedule_eyebrow",  label: "Eyebrow" },
        { key: "schedule_title",    label: "Section Title" },
        { key: "schedule_subtitle", label: "Section Subtitle" },
        { key: "batch_name",  label: "Batch Name (e.g. Batch 14 — Live)" },
        { key: "batch_label", label: "Batch Subtitle (e.g. Interactive Zoom Sessions)" },
        { key: "batch_start", label: "Batch Badge (e.g. Starting Soon)" },
        { key: "course_fee",  label: "Course Fee (e.g. Rs. 7,000)" },
        { key: "feature_1", label: "Live Feature 1" },
        { key: "feature_2", label: "Live Feature 2" },
        { key: "feature_3", label: "Live Feature 3" },
        { key: "feature_4", label: "Live Feature 4" },
        { key: "zoom_note_title", label: "Zoom Note — Title" },
        { key: "zoom_note_text",  label: "Zoom Note — Description", type: "textarea", rows: 2 },
      ],
    },
    {
      title: "Class Schedule — Self-Paced",
      fields: [
        { key: "selfpaced_title", label: "Self-Paced Title" },
        { key: "selfpaced_label", label: "Self-Paced Subtitle" },
        { key: "selfpaced_feature_1", label: "Self-Paced Feature 1" },
        { key: "selfpaced_feature_2", label: "Self-Paced Feature 2" },
        { key: "selfpaced_feature_3", label: "Self-Paced Feature 3" },
        { key: "selfpaced_feature_4", label: "Self-Paced Feature 4" },
        { key: "whatsapp_card_title", label: "WhatsApp Card — Title" },
        { key: "whatsapp_card_text",  label: "WhatsApp Card — Description" },
      ],
    },
    {
      title: "Payment Section",
      desc:  "Bank details and enrollment steps shown to visitors.",
      fields: [
        { key: "payment_eyebrow",   label: "Eyebrow" },
        { key: "payment_title",     label: "Section Title" },
        { key: "payment_subtitle",  label: "Section Subtitle", type: "textarea", rows: 2 },
        { key: "bank_name",         label: "Bank Name" },
        { key: "bank_account_no",   label: "Account Number" },
        { key: "bank_account_name", label: "Account Name" },
        { key: "bank_branch",       label: "Branch" },
        { key: "enroll_step_1_title", label: "Enroll Step 1 — Title" },
        { key: "enroll_step_1_desc",  label: "Enroll Step 1 — Description" },
        { key: "enroll_step_2_title", label: "Enroll Step 2 — Title" },
        { key: "enroll_step_2_desc",  label: "Enroll Step 2 — Description" },
        { key: "enroll_step_3_title", label: "Enroll Step 3 — Title" },
        { key: "enroll_step_3_desc",  label: "Enroll Step 3 — Description" },
        { key: "enroll_step_4_title", label: "Enroll Step 4 — Title" },
        { key: "enroll_step_4_desc",  label: "Enroll Step 4 — Description" },
      ],
    },
    {
      title: "Registration Form Header",
      fields: [
        { key: "form_eyebrow",  label: "Eyebrow" },
        { key: "form_title",    label: "Title" },
        { key: "form_subtitle", label: "Subtitle", type: "textarea", rows: 2 },
      ],
    },
    {
      title: "Footer",
      fields: [
        { key: "footer_brand",   label: "Footer Brand Name" },
        { key: "footer_tagline", label: "Footer Tagline" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-display font-bold text-white flex-1">Site Content</h2>
        <Button variant="ghost" size="sm" onClick={load} style={{ color: "#b0b3b8" }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Reload
        </Button>
        <Button size="sm" onClick={save} disabled={saving} className="font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
          <Save className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Save All Changes"}
        </Button>
      </div>
      <p className="text-sm" style={{ color: "#b0b3b8" }}>
        Edit every text and image on the public website. Click a section to expand. After saving, refresh the main page to see changes.
      </p>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="ghost" onClick={() => setOpenGroups(Object.fromEntries(groups.map(g => [g.title, true])))}
          className="text-xs" style={{ color: "#b0b3b8" }}>
          Expand All
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpenGroups({})}
          className="text-xs" style={{ color: "#b0b3b8" }}>
          Collapse All
        </Button>
      </div>

      {groups.map(g => {
        const open = !!openGroups[g.title];
        return (
          <div key={g.title} className="rounded-2xl overflow-hidden" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
            <button
              onClick={() => setOpenGroups(p => ({ ...p, [g.title]: !p[g.title] }))}
              className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5"
            >
              <div className="flex-1">
                <p className="font-display font-bold text-white text-sm">{g.title}</p>
                {g.desc && <p className="text-xs mt-0.5" style={{ color: "#65676b" }}>{g.desc}</p>}
              </div>
              {open ? <ChevronUp className="w-4 h-4" style={{ color: "#b0b3b8" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#b0b3b8" }} />}
            </button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="px-5 pb-5 pt-2 space-y-4 border-t" style={{ borderColor: "#3a3b3c" }}>
                    {g.fields.map(f => (
                      <SettingFieldRow key={f.key} field={f} value={settings[f.key] ?? ""} onChange={v => update(f.key, v)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <div className="sticky bottom-4 flex justify-end pt-2">
        <Button onClick={save} disabled={saving} className="font-bold rounded-xl text-white border-0 h-11 px-6 shadow-xl"
          style={{ background: "#1877F2" }}>
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving…" : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}

function SettingFieldRow({ field, value, onChange }: { field: SettingField; value: string; onChange: (v: string) => void }) {
  const labelEl = (
    <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#b0b3b8" }}>{field.label}</label>
  );
  const helpEl = field.help ? <p className="text-[11px] mt-1" style={{ color: "#65676b" }}>{field.help}</p> : null;

  if (field.type === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          value={value}
          rows={field.rows ?? 3}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl px-3 py-2 text-sm text-white resize-y focus:outline-none focus:border-[#1877F2] border"
          style={{ background: "#18191a", borderColor: "#3a3b3c" }}
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div>
        {labelEl}
        <ImageField value={value} onChange={onChange} />
        {helpEl}
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-10 rounded-xl text-white border text-sm"
        style={{ background: "#18191a", borderColor: "#3a3b3c" }}
      />
      {helpEl}
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please use an image under 5MB." });
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const scale = Math.min(MAX / width, MAX / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { onChange(dataUrl); setBusy(false); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const out = canvas.toDataURL("image/jpeg", 0.85);
        onChange(out);
        setBusy(false);
      };
      img.onerror = () => { onChange(dataUrl); setBusy(false); };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: "#18191a", border: "1px solid #3a3b3c" }}
      >
        {value
          ? <img src={value} alt="" className="w-full h-full object-cover" />
          : <ImageIcon className="w-7 h-7" style={{ color: "#65676b" }} />}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white border"
            style={{ background: busy ? "#3a3b3c" : "#1877F2", borderColor: "#1877F2" }}>
            <Upload className="w-3.5 h-3.5" /> {busy ? "Processing…" : value ? "Replace Image" : "Upload Image"}
          </div>
        </label>
        {value && (
          <button onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs font-medium self-start" style={{ color: "#ef4444" }}>
            <Trash className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

/* ── MESSAGES TAB ──────────────────────────────────────────── */
function MessagesTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; message: string; sentAt: string }[]>([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    apiFetch("/admin/students", token).then(r => r.json()).then(setStudents).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!selectedId) return;
    apiFetch(`/admin/messages/${selectedId}`, token).then(r => r.json()).then(setMessages).catch(() => {});
  }, [selectedId, token]);

  async function send() {
    if (!msg.trim() || !selectedId) return;
    setSending(true);
    const r = await apiFetch("/admin/messages", token, {
      method: "POST", body: JSON.stringify({ studentId: selectedId, message: msg }),
    });
    if (r.ok) {
      const m = await r.json();
      setMessages(p => [m, ...p]); setMsg(""); toast({ title: "Message recorded" });
    }
    setSending(false);
  }

  const selected = students.find(s => s.id === selectedId);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-white">Messages</h2>
      <p className="text-sm" style={{ color: "#b0b3b8" }}>Record messages sent to students. Use WhatsApp to send — this log keeps a history.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Student picker */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
          <div className="p-4 border-b" style={{ borderColor: "#3a3b3c" }}>
            <p className="font-bold text-white text-sm">Select Student</p>
          </div>
          <div className="overflow-y-auto max-h-80">
            {students.map(s => (
              <button key={s.id} onClick={() => setSelectedId(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                style={{ borderBottom: "1px solid #3a3b3c", background: selectedId === s.id ? "rgba(24,119,242,0.1)" : "transparent" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "rgba(24,119,242,0.2)" }}>{s.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                  <p className="text-xs truncate" style={{ color: "#b0b3b8" }}>{s.phone}</p>
                </div>
                <StatusBadge status={s.status} />
              </button>
            ))}
          </div>
        </div>

        {/* Message panel */}
        <div className="rounded-2xl flex flex-col" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
          <div className="p-4 border-b" style={{ borderColor: "#3a3b3c" }}>
            <p className="font-bold text-white text-sm">
              {selected ? selected.name : "Select a student to view messages"}
            </p>
            {selected && (
              <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="text-xs mt-0.5 inline-flex items-center gap-1 hover:underline" style={{ color: "#25D366" }}>
                Open WhatsApp <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-52">
            {!selectedId && <p className="text-sm text-center" style={{ color: "#65676b" }}>No student selected.</p>}
            {selectedId && messages.length === 0 && <p className="text-sm text-center" style={{ color: "#65676b" }}>No messages yet.</p>}
            {messages.map(m => (
              <div key={m.id} className="rounded-xl p-3" style={{ background: "#18191a" }}>
                <p className="text-sm text-white">{m.message}</p>
                <p className="text-xs mt-1" style={{ color: "#65676b" }}>{new Date(m.sentAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2" style={{ borderColor: "#3a3b3c" }}>
            <Input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message to log…" disabled={!selectedId}
              className="flex-1 h-10 rounded-xl text-white text-sm border"
              style={{ background: "#18191a", borderColor: "#3a3b3c" }}
              onKeyDown={e => e.key === "Enter" && send()} />
            <Button size="sm" onClick={send} disabled={sending || !msg.trim() || !selectedId}
              className="font-bold rounded-xl text-white border-0 px-4" style={{ background: "#1877F2" }}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── HELPER: FIELD ─────────────────────────────────────────── */
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#b0b3b8" }}>{label}</label>
      <Input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="h-9 rounded-xl text-white border text-sm"
        style={{ background: "#18191a", borderColor: "#3a3b3c" }} />
    </div>
  );
}

/* ── MAIN ADMIN PAGE ───────────────────────────────────────── */
export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") ?? "");
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("dashboard");

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser && ADMIN_EMAILS.includes(firebaseUser.email)) {
        firebaseUser.getIdToken().then((newToken) => {
          setToken(newToken);
          setUser(firebaseUser);
          sessionStorage.setItem("admin_token", newToken);
        });
      } else {
        setToken("");
        setUser(null);
        sessionStorage.removeItem("admin_token");
      }
    });
    return () => unsubscribe();
  }, []);

  // Refresh token periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true);
        setToken(newToken);
        sessionStorage.setItem("admin_token", newToken);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    await logOut();
    setToken("");
    setUser(null);
    sessionStorage.removeItem("admin_token");
  }

  if (!token) return <LoginScreen onLogin={(t, u) => { setToken(t); setUser(u); }} />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard",     icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "students",  label: "Students",       icon: <Users className="w-4 h-4" /> },
    { id: "zoom",      label: "Zoom Sessions",  icon: <Video className="w-4 h-4" /> },
    { id: "videos",    label: "Video Sessions", icon: <MonitorPlay className="w-4 h-4" /> },
    { id: "settings",  label: "Site Settings",  icon: <Settings className="w-4 h-4" /> },
    { id: "messages",  label: "Messages",       icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#18191a", color: "#e4e6eb" }}>
      {/* Top nav */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-5 h-14 border-b"
        style={{ background: "#242526", borderColor: "#3a3b3c" }}>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" style={{ color: "#1877F2" }} />
          <span className="font-display font-bold text-white">Admin Panel</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(24,119,242,0.15)", color: "#1877F2" }}>
            With Soori Academy
          </span>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-xs hidden sm:inline" style={{ color: "#b0b3b8" }}>
              {user.email}
            </span>
          )}
          <a href="/" className="text-xs px-3 py-1.5 rounded-lg border hover:bg-white/5 transition-colors"
            style={{ borderColor: "#3a3b3c", color: "#b0b3b8" }}>
            ← View Website
          </a>
          <button onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Sign out">
            <LogOut className="w-4 h-4" style={{ color: "#b0b3b8" }} />
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 border-r hidden md:flex flex-col py-4 gap-1"
          style={{ background: "#242526", borderColor: "#3a3b3c" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium text-left transition-all"
              style={{
                background: tab === t.id ? "rgba(24,119,242,0.15)" : "transparent",
                color: tab === t.id ? "#1877F2" : "#b0b3b8",
              }}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 flex border-t z-30"
          style={{ background: "#242526", borderColor: "#3a3b3c" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center py-2 gap-1 text-[10px] font-medium transition-colors"
              style={{ color: tab === t.id ? "#1877F2" : "#65676b" }}>
              {t.icon}
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-5 md:p-8 overflow-auto pb-20 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {tab === "dashboard" && <Dashboard token={token} />}
              {tab === "students"  && <StudentsTab token={token} />}
              {tab === "zoom"      && <ZoomTab token={token} />}
              {tab === "videos"    && <VideoSessionsTab token={token} />}
              {tab === "settings"  && <SettingsTab token={token} />}
              {tab === "messages"  && <MessagesTab token={token} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}