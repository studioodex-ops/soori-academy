import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MonitorPlay, LogOut, RefreshCw, Phone, ShieldCheck,
  AlertCircle, ChevronRight, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type StudentSession = {
  phone: string;
  studentId: string;
  name: string;
  medium: string;
  verifiedAt: string;
};

type VideoSession = {
  id: string;
  title: string;
  weekNumber: number;
  description: string;
  medium: string;
  embedUrl: string | null;
};

type ZoomSession = {
  id: string;
  title: string;
  weekNumber: number;
  batch: string;
  passcode: string;
};

const SESSION_KEY = "soori_student_session";

function getStoredSession(): StudentSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function storeSession(session: StudentSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function makeStudentToken(session: StudentSession): string {
  return btoa(JSON.stringify(session));
}

export default function SessionsPage() {
  const { toast } = useToast();
  const [session, setSession] = useState<StudentSession | null>(getStoredSession);
  const [verifying, setVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [zoomSessions, setZoomSessions] = useState<ZoomSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [joiningZoom, setJoiningZoom] = useState<string | null>(null);
  const [activeMedium, setActiveMedium] = useState<string>("sinhala");

  // On mount, verify stored session is still valid
  useEffect(() => {
    if (session) {
      setActiveMedium(session.medium || "sinhala");
      loadSessions(session, session.medium || "sinhala");
    }
  }, []);

  async function loadSessions(studentSession: StudentSession, medium: string) {
    setLoading(true);
    try {
      const token = makeStudentToken(studentSession);
      const r = await fetch(`/api/video-sessions?medium=${medium}`, {
        headers: { Authorization: `Student ${token}` },
      });
      if (r.status === 401) {
        // Session expired
        clearSession();
        setSession(null);
        toast({ title: "Session expired", description: "Please verify again." });
        return;
      }
      if (r.ok) {
        const data = await r.json();
        setSessions(data);
      }
      
      const zr = await fetch(`/api/zoom-sessions`, {
        headers: { Authorization: `Student ${token}` },
      });
      if (zr.ok) {
        const zData = await zr.json();
        setZoomSessions(zData);
      }
    } catch {
      toast({ title: "Failed to load sessions", description: "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function joinZoom(id: string) {
    if (!session) return;
    setJoiningZoom(id);
    try {
      const token = makeStudentToken(session);
      const r = await fetch(`/api/join-zoom/${id}`, {
        method: "POST",
        headers: { Authorization: `Student ${token}` },
      });
      if (r.ok) {
        const data = await r.json();
        if (data.url) {
          window.open(data.url, "_blank");
        } else {
          toast({ title: "Failed", description: "Zoom link not available." });
        }
      } else {
        toast({ title: "Not Authorized", description: "Cannot access this session." });
      }
    } catch {
      toast({ title: "Connection error", description: "Failed to join session." });
    } finally {
      setJoiningZoom(null);
    }
  }

  async function verify() {
    if (!phone.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const r = await fetch("/api/verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await r.json();
      if (data.verified) {
        const newSession: StudentSession = {
          phone: phone.trim(),
          studentId: data.studentId,
          name: data.name,
          medium: data.medium || "sinhala",
          verifiedAt: new Date().toISOString(),
        };
        storeSession(newSession);
        setSession(newSession);
        setActiveMedium(newSession.medium);
        loadSessions(newSession, newSession.medium);
        toast({ title: "Welcome!", description: `Hi ${data.name}, your videos are loading.` });
      } else {
        if (data.reason === "not_approved") {
          setError("Your payment has not been approved yet. Please wait for confirmation or contact us on WhatsApp.");
        } else {
          setError("Phone number not found. Please make sure you registered with this number.");
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setSessions([]);
    setZoomSessions([]);
    setPhone("");
    setError("");
  }

  function switchMedium(medium: string) {
    setActiveMedium(medium);
    if (session) loadSessions(session, medium);
  }

  const mediums = [
    { id: "sinhala", label: "Sinhala Medium" },
    { id: "tamil", label: "Tamil Medium" },
    { id: "english", label: "English Medium" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#18191a", color: "#e4e6eb" }}>
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #1877F2 0%, transparent 70%)" }} />
      </div>

      {/* Top nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
        style={{ backgroundColor: "#242526", borderBottom: "1px solid #3a3b3c" }}>
        <div className="flex items-center gap-3">
          <MonitorPlay className="w-5 h-5" style={{ color: "#1877F2" }} />
          <span className="font-bold text-white">My Sessions</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(24,119,242,0.15)", color: "#1877F2" }}>
            With Soori Academy
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs px-3 py-1.5 rounded-lg border hover:bg-white/5 transition-colors flex items-center gap-1"
            style={{ borderColor: "#3a3b3c", color: "#b0b3b8" }}>
            <Home className="w-3 h-3" /> Home
          </a>
          {session && (
            <button onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" style={{ color: "#b0b3b8" }} />
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Not verified - show login form */}
        {!session && (
          <motion.div className="max-w-md mx-auto mt-16"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl p-8 text-center" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(24,119,242,0.15)", border: "1px solid rgba(24,119,242,0.3)" }}>
                <ShieldCheck className="w-7 h-7" style={{ color: "#1877F2" }} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Access Your Video Sessions</h1>
              <p className="text-sm mb-6" style={{ color: "#b0b3b8" }}>
                Enter the WhatsApp number you registered with to access your enrolled video sessions.
              </p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#b0b3b8" }}>
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#65676b" }} />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+94 7x xxx xxxx"
                      className="h-11 rounded-xl text-white placeholder:text-white/25 border pl-10"
                      style={{ background: "#18191a", borderColor: "#3a3b3c" }}
                      onKeyDown={e => e.key === "Enter" && verify()}
                    />
                  </div>
                </div>

                <Button onClick={verify} disabled={verifying || !phone.trim()}
                  className="w-full h-12 font-bold rounded-xl text-white border-0"
                  style={{ background: "#1877F2" }}>
                  {verifying ? "Verifying…" : (
                    <span className="flex items-center justify-center gap-1">
                      Verify & Access Videos <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              {error && (
                <motion.div className="mt-4 rounded-xl p-4 text-left" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 pt-5 border-t" style={{ borderColor: "#3a3b3c" }}>
                <p className="text-xs mb-3" style={{ color: "#65676b" }}>Having trouble accessing?</p>
                <a href="https://chat.whatsapp.com/KomGpoFV4JQ4ls1KrpVsM9" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full h-10 font-bold rounded-xl border text-sm"
                    style={{ borderColor: "#25D366", color: "#25D366", background: "transparent" }}>
                    Contact on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verified - show video sessions */}
        {session && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Welcome header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Welcome, {session.name}!</h2>
                <p className="text-sm" style={{ color: "#b0b3b8" }}>Your enrolled video sessions are below.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => loadSessions(session, activeMedium)} style={{ color: "#b0b3b8" }}>
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>

            {/* Medium tabs */}
            <div className="flex gap-2 mb-6">
              {mediums.map(m => (
                <button key={m.id} onClick={() => switchMedium(m.id)}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  style={{
                    background: activeMedium === m.id ? "#1877F2" : "#242526",
                    color: activeMedium === m.id ? "#fff" : "#b0b3b8",
                    border: `1px solid ${activeMedium === m.id ? "#1877F2" : "#3a3b3c"}`,
                  }}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Sessions list */}
            {loading && (
              <div className="text-center py-16" style={{ color: "#65676b" }}>Loading videos and sessions…</div>
            )}

            {!loading && zoomSessions.length > 0 && (
              <div className="mb-8 space-y-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-green-500" />
                  Live Zoom Sessions
                </h3>
                {zoomSessions.map(zs => (
                  <motion.div key={zs.id} className="rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    style={{ background: "#242526", border: "1px solid rgba(34,197,94,0.3)" }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400">
                          Week {zs.weekNumber}
                        </span>
                        {zs.batch && (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-white/60">
                            {zs.batch}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white">{zs.title}</h4>
                      {zs.passcode && (
                        <p className="text-sm mt-1 text-white/70">
                          Passcode: <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-green-400">{zs.passcode}</span>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => joinZoom(zs.id)}
                      disabled={joiningZoom === zs.id}
                      className="w-full md:w-auto font-bold bg-green-600 hover:bg-green-700 text-white"
                    >
                      {joiningZoom === zs.id ? "Connecting..." : "Join Live Class"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && sessions.length === 0 && zoomSessions.length === 0 && (
              <div className="rounded-2xl p-12 text-center" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
                <MonitorPlay className="w-12 h-12 mx-auto mb-4" style={{ color: "#65676b" }} />
                <h3 className="text-lg font-bold text-white mb-2">No videos yet</h3>
                <p className="text-sm" style={{ color: "#b0b3b8" }}>
                  Video sessions for this medium will appear here once they are uploaded by the instructor.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {sessions.map(s => (
                <motion.div key={s.id} className="rounded-2xl overflow-hidden"
                  style={{ background: "#242526", border: "1px solid #3a3b3c" }}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Video info header */}
                  <div className="p-5 border-b" style={{ borderColor: "#3a3b3c" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <MonitorPlay className="w-4 h-4" style={{ color: "#1877F2" }} />
                      <span className="font-bold text-white">Week {s.weekNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    {s.description && <p className="text-sm mt-1" style={{ color: "#b0b3b8" }}>{s.description}</p>}
                  </div>

                  {/* Embedded video player */}
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%", background: "#000" }}
                    onContextMenu={e => e.preventDefault()}
                    onCopy={e => e.preventDefault()}
                  >
                    {s.embedUrl ? (
                      <iframe
                        src={s.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                        style={{ border: "none", userSelect: "none" }}
                        title={s.title}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm" style={{ color: "#65676b" }}>Video unavailable — invalid link</p>
                      </div>
                    )}
                    {/* Anti-sharing overlay: invisible layer to prevent easy right-click on iframe */}
                    <div
                      className="absolute inset-0"
                      style={{ zIndex: 1, pointerEvents: "none" }}
                      onContextMenu={e => e.preventDefault()}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12" style={{ borderColor: "#3a3b3c", background: "#18191a" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#65676b" }}>
            Videos are for enrolled students only. Sharing or redistributing content is strictly prohibited.
          </p>
          <a href="/" className="text-xs px-3 py-1.5 rounded-lg border hover:bg-white/5 transition-colors"
            style={{ borderColor: "#3a3b3c", color: "#65676b" }}>
            Back to Website
          </a>
        </div>
      </footer>
    </div>
  );
}
