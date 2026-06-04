import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowRight, CheckCircle2, TrendingUp, MonitorPlay,
  Copy, ExternalLink, Video, CreditCard, Upload,
  ChevronRight, BadgeCheck, Banknote, Globe, PlayCircle,
  Star, Users
} from "lucide-react";
import { SiFacebook, SiWhatsapp, SiZoom } from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
// Default profile image (public folder)

type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  // Brand / Nav
  brand_name:        "With Soori",
  brand_tag:         "Academy",
  profile_image:     "",
  // Social links
  facebook_url:      "https://web.facebook.com/withsooriacademy",
  whatsapp_url:      "https://chat.whatsapp.com/KomGpoFV4JQ4ls1KrpVsM9?mode=gi_t",

  // Hero
  hero_badge:        "Sri Lanka's #1 Facebook Monetization Academy",
  hero_headline_1:   "Turn Your",
  hero_headline_2:   "Facebook Content",
  hero_headline_3:   "Into Income.",
  hero_description:  "Learn directly from Soori — the first educator in Sri Lanka to teach Facebook In-Stream Ads and Content Monetization. Real methods, verified results, open to students worldwide.",
  hero_btn_secondary:"Watch Our Content",
  hero_image:        "",
  hero_image_name:   "Soori",
  hero_image_role:   "Founder & Lead Instructor — With Soori Academy",
  hero_ribbon:       "#1 in Sri Lanka",
  hero_stat_1:       "5,000+ students from 10+ countries",
  hero_stat_2:       "4.9 / 5 rating",

  // Ticker (one entry per line)
  ticker_text:       "Kasun — $1,240/mo\nNishanthi — $850/mo\nDasun — $2,100/mo\nChaminda — $1,500/mo\nSaman — $920/mo\nDilani — $1,750/mo\nRuwan — $3,200/mo\nAnusha — $680/mo",

  // Stats (4)
  stat_1_value:      "5", stat_1_suffix: "K+", stat_1_prefix: "", stat_1_label: "Active Students",
  stat_2_value:      "1", stat_2_suffix: "M+", stat_2_prefix: "$", stat_2_label: "Earned by Students",
  stat_3_value:      "10",stat_3_suffix: "+",  stat_3_prefix: "", stat_3_label: "Countries",
  stat_4_value:      "100",stat_4_suffix:"%",  stat_4_prefix: "", stat_4_label: "Practical",

  // Curriculum
  curriculum_eyebrow:"The Curriculum",
  curriculum_title:  "What You Will Learn",
  curriculum_subtitle:"A complete system to activate and grow Facebook Content Monetization — regardless of your current follower count or technical background.",
  learn_1_title:     "Content Creation",
  learn_1_desc:      "Create Facebook-optimised videos that drive high watch time and organic reach. Covers formats, lengths, and proven hook strategies.",
  learn_2_title:     "CM Tool Mastery",
  learn_2_desc:      "Navigate the Content Monetization dashboard. Understand RPM, ad break placement, and how to increase earnings per 1,000 views.",
  learn_3_title:     "Global Audience",
  learn_3_desc:      "Target Tier 1 audiences (US, UK, Canada) for significantly higher CPMs. Scale beyond local reach into international income.",

  // How it works
  howit_eyebrow:     "Step by Step",
  howit_title:       "Your Path to Monetization",
  step_1_title:      "Enroll",       step_1_desc: "Register and complete payment",
  step_2_title:      "Learn",        step_2_desc: "Attend live or self-paced sessions",
  step_3_title:      "Activate CM",  step_3_desc: "Hit Facebook's eligibility criteria",
  step_4_title:      "Earn Monthly", step_4_desc: "Receive payouts directly from Facebook",

  // Results / Success
  results_eyebrow:   "Student Success",
  results_title:     "Real Results. Real People.",
  results_subtitle:  "Verified earnings from students across Sri Lanka who completed our program.",
  results_btn:       "Watch More Success Videos on Facebook",
  success_1_name: "Kasun Perera",    success_1_earn: "$1,240/mo", success_1_quote: "My daily vlogs now pay all my bills. This program is the real thing.", success_1_image: "",
  success_2_name: "Nishanthi Silva", success_2_earn: "$850/mo",   success_2_quote: "No tech background, no problem. The lessons are clear and actionable.", success_2_image: "",
  success_3_name: "Dasun Fernando",  success_3_earn: "$2,100/mo", success_3_quote: "Hit $2k in 3 months. The CM tool strategy alone was worth 10x the fee.", success_3_image: "",
  success_4_name: "Chaminda Kumara", success_4_earn: "$1,500/mo", success_4_quote: "I'm 50 years old and I figured it out. Age is no barrier here.", success_4_image: "",

  // Schedule
  schedule_eyebrow:  "Upcoming",
  schedule_title:    "Class Schedule",
  schedule_subtitle: "Seats are limited. Enroll early to secure your place.",
  batch_name:        "Batch 14 — Live",
  batch_label:       "Interactive Zoom Sessions",
  batch_start:       "Starting Soon",
  course_fee:        "Rs. 7,000",
  feature_1:         "4-week intensive weekend program",
  feature_2:         "Live Q&A with Soori every session",
  feature_3:         "Full recording access lifetime",
  feature_4:         "Private WhatsApp support group",
  zoom_note_title:   "Zoom Links & Passcodes",
  zoom_note_text:    "Session links are sent privately via WhatsApp to enrolled and payment-confirmed students only.",
  selfpaced_title:   "Self-Paced",
  selfpaced_label:   "Pre-recorded Portal",
  selfpaced_feature_1:"Available immediately after payment",
  selfpaced_feature_2:"40+ structured HD video lessons",
  selfpaced_feature_3:"Learn on your own schedule",
  selfpaced_feature_4:"WhatsApp community access",
  whatsapp_card_title:"Join the WhatsApp Community",
  whatsapp_card_text: "Get class updates, tips and direct support from Soori",

  // Payment
  payment_eyebrow:   "Enrollment & Payment",
  payment_title:     "Payment Details",
  payment_subtitle:  "Transfer the course fee to the bank account below, then send your receipt to confirm.",
  bank_name:         "Sampath Bank",
  bank_account_no:   "107052850407",
  bank_account_name: "S V G A Sooriyapura",
  bank_branch:       "Gregory Road, Colombo 7",
  enroll_step_1_title:"Fill the registration form",
  enroll_step_1_desc: "Enter your name, phone, email and batch.",
  enroll_step_2_title:"Transfer the course fee",
  enroll_step_2_desc: "Send the course fee to the bank details on the left.",
  enroll_step_3_title:"Upload or WhatsApp your receipt",
  enroll_step_3_desc: "Submit a photo of your bank slip to confirm payment.",
  enroll_step_4_title:"Get confirmed",
  enroll_step_4_desc: "We will send your class access within 24 hours.",

  // Form
  form_eyebrow:      "Get Started",
  form_title:        "Reserve Your Spot",
  form_subtitle:     "Fill in your details and our team will contact you within 24 hours on WhatsApp.",

  // Footer
  footer_brand:      "With Soori Academy",
  footer_tagline:    "Sri Lanka's #1 Facebook Monetization Educator",
};

function useSiteSettings(): SiteSettings {
  const [s, setS] = useState<SiteSettings>(DEFAULTS);
  useEffect(() => {
    fetch("/api/settings").then(r => r.ok ? r.json() : null).then(data => {
      if (data) setS(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);
  return s;
}

const formSchema = z.object({
  name:    z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone:   z.string().min(10, { message: "Please enter a valid phone number." }),
  email:   z.string().email({ message: "Please enter a valid email address." }),
  country: z.string().min(2, { message: "Please enter your country." }),
  batch:   z.string().min(1, { message: "Please select a batch." }),
  medium:  z.string().min(1, { message: "Please select your preferred medium." }),
});

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function AnimatedCounter({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = end / (1800 / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= end) { setN(end); clearInterval(t); } else setN(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [end, inView]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  const { toast } = useToast();
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); toast({ title: "Copied!", description: `${label} copied.` }); setTimeout(() => setOk(false), 2000); }}
      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ml-2">
      {ok ? <CheckCircle2 className="w-4 h-4 text-[#1877F2]" /> : <Copy className="w-4 h-4 text-white/50 hover:text-white" />}
    </button>
  );
}

/* ── RECEIPT UPLOAD STEP ── shown after successful registration */
function ReceiptUpload({ studentId, courseFee, settings, onDone }: {
  studentId: number; courseFee: string; settings: SiteSettings; onDone: () => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function upload() {
    if (!preview) return;
    setUploading(true);
    try {
      await fetch(`/api/register/${studentId}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptData: preview }),
      });
      toast({ title: "Receipt uploaded!", description: "Our team will confirm your payment within 24 hours." });
      onDone();
    } catch {
      toast({ title: "Upload failed", description: "Please send your receipt via WhatsApp instead." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <motion.div className="rounded-2xl p-7 text-center" style={{ background: "#242526", border: "1px solid #1877F2" }}
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-[#10b981]" />
      <h3 className="text-xl font-display font-bold text-white mb-2">Registration Submitted!</h3>
      <p className="text-sm mb-6" style={{ color: "#b0b3b8" }}>
        Now transfer <strong className="text-white">{courseFee}</strong> to the bank details below,
        then upload your receipt here or send it via WhatsApp.
      </p>

      <div className="space-y-3 text-left mb-6">
        {[
          { label: "Account Number", val: settings.bank_account_no, copy: true },
          { label: "Account Name",   val: settings.bank_account_name, copy: true },
          { label: "Bank",           val: settings.bank_name, copy: false },
          { label: "Branch",         val: settings.bank_branch, copy: false },
        ].map(r => (
          <div key={r.label} className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#65676b" }}>{r.label}</p>
              <p className="font-mono font-bold text-white text-sm">{r.val}</p>
            </div>
            {r.copy && <CopyBtn text={r.val} label={r.label} />}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <label className="flex flex-col items-center gap-3 rounded-xl p-5 cursor-pointer border-2 border-dashed transition-colors hover:border-[#1877F2]"
          style={{ borderColor: preview ? "#1877F2" : "#3a3b3c", background: "#18191a" }}>
          {preview
            ? <img src={preview} alt="Receipt preview" className="max-h-40 rounded-xl object-contain" />
            : <><Upload className="w-8 h-8" style={{ color: "#65676b" }} /><span className="text-sm" style={{ color: "#b0b3b8" }}>Click to upload payment receipt photo</span></>
          }
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {preview && (
          <Button onClick={upload} disabled={uploading} className="w-full h-12 font-bold rounded-xl text-white border-0" style={{ background: "#1877F2" }}>
            {uploading ? "Uploading…" : "Submit Receipt"}
          </Button>
        )}
        <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full h-12 font-bold rounded-xl border text-white" style={{ borderColor: "#25D366", color: "#25D366", background: "transparent" }}>
            <SiWhatsapp className="mr-2 w-4 h-4" /> Send Receipt via WhatsApp Instead
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const settings = useSiteSettings();
  const [registeredId, setRegisteredId] = useState<number | null>(null);
  const [receiptDone, setReceiptDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", country: "", batch: "", medium: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const { studentId } = await res.json();
        setRegisteredId(studentId);
        form.reset();
      } else {
        toast({ title: "Registration failed", description: "Please try again or contact us on WhatsApp." });
      }
    } catch {
      toast({ title: "Connection error", description: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const courseFee = settings.course_fee;
  const profileImg = settings.profile_image || "/channels4_profile_1774983180425.jpg";
  const heroImg    = settings.hero_image    || "/channels4_profile_1774983180425.jpg";
  const features   = [settings.feature_1, settings.feature_2, settings.feature_3, settings.feature_4].filter(Boolean);
  const selfFeatures = [settings.selfpaced_feature_1, settings.selfpaced_feature_2, settings.selfpaced_feature_3, settings.selfpaced_feature_4].filter(Boolean);
  const tickerItems = settings.ticker_text.split("\n").map(s => s.trim()).filter(Boolean);

  const stats = [
    { value: parseInt(settings.stat_1_value) || 0, prefix: settings.stat_1_prefix, suffix: settings.stat_1_suffix, label: settings.stat_1_label },
    { value: parseInt(settings.stat_2_value) || 0, prefix: settings.stat_2_prefix, suffix: settings.stat_2_suffix, label: settings.stat_2_label },
    { value: parseInt(settings.stat_3_value) || 0, prefix: settings.stat_3_prefix, suffix: settings.stat_3_suffix, label: settings.stat_3_label },
    { value: parseInt(settings.stat_4_value) || 0, prefix: settings.stat_4_prefix, suffix: settings.stat_4_suffix, label: settings.stat_4_label },
  ];

  const learnCards = [
    { icon: <MonitorPlay className="w-6 h-6" />, title: settings.learn_1_title, desc: settings.learn_1_desc },
    { icon: <TrendingUp className="w-6 h-6" />,  title: settings.learn_2_title, desc: settings.learn_2_desc },
    { icon: <Globe className="w-6 h-6" />,        title: settings.learn_3_title, desc: settings.learn_3_desc },
  ];

  const steps = [
    { n: "01", t: settings.step_1_title, d: settings.step_1_desc },
    { n: "02", t: settings.step_2_title, d: settings.step_2_desc },
    { n: "03", t: settings.step_3_title, d: settings.step_3_desc },
    { n: "04", t: settings.step_4_title, d: settings.step_4_desc },
  ];

  const successStories = [1, 2, 3, 4].map(i => ({
    name:  settings[`success_${i}_name`],
    earn:  settings[`success_${i}_earn`],
    quote: settings[`success_${i}_quote`],
    image: settings[`success_${i}_image`],
  }));

  const enrollSteps = [
    { n: "1", t: settings.enroll_step_1_title, d: settings.enroll_step_1_desc },
    { n: "2", t: settings.enroll_step_2_title, d: settings.enroll_step_2_desc },
    { n: "3", t: settings.enroll_step_3_title, d: settings.enroll_step_3_desc },
    { n: "4", t: settings.enroll_step_4_title, d: settings.enroll_step_4_desc },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#18191a", color: "#e4e6eb" }}>

      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #1877F2 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-1/4 w-[50vw] h-[50vw] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #1877F2 0%, transparent 70%)" }} />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
        style={{ backgroundColor: "#242526", borderBottom: "1px solid #3a3b3c" }}>
        <div className="flex items-center gap-3">
          <img src={profileImg} alt={settings.brand_name} className="w-9 h-9 rounded-full object-cover border-2 border-[#1877F2]" />
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white tracking-tight">{settings.brand_name}</span>
            {settings.brand_tag && (
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                style={{ color: "#1877F2", borderColor: "rgba(24,119,242,0.4)", background: "rgba(24,119,242,0.1)" }}>
                {settings.brand_tag}
              </span>
            )}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#b0b3b8" }}>
          <a href="#about"    className="hover:text-white transition-colors">About</a>
          <a href="#results"  className="hover:text-white transition-colors">Results</a>
          <a href="#schedule" className="hover:text-white transition-colors">Classes</a>
          <a href="#payment"  className="hover:text-white transition-colors">Payment</a>
          <a href="/sessions" className="hover:text-[#1877F2] transition-colors font-semibold">My Sessions</a>
        </div>
        <Button onClick={() => scrollTo("join-now")} className="h-9 px-5 text-sm font-bold rounded-lg text-white border-0"
          style={{ background: "#1877F2" }} data-testid="btn-nav-join">
          Enroll Now
        </Button>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-20 px-4 md:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div className="flex-1 text-center lg:text-left" initial="hidden" animate="visible" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{ background: "rgba(24,119,242,0.12)", color: "#1877F2", border: "1px solid rgba(24,119,242,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] animate-pulse" />
                {settings.hero_badge}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.0] tracking-tight mb-6">
                {settings.hero_headline_1}<br />
                <span style={{ color: "#1877F2" }}>{settings.hero_headline_2}</span><br />
                {settings.hero_headline_3}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: "#b0b3b8" }}>
                {settings.hero_description}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => scrollTo("join-now")}
                  className="h-13 px-8 text-base font-bold rounded-xl text-white border-0 w-full sm:w-auto"
                  style={{ background: "#1877F2" }} data-testid="btn-hero-enroll">
                  Enroll Now — {courseFee} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" data-testid="link-hero-fb">
                  <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold rounded-xl w-full"
                    style={{ borderColor: "#3a3b3c", color: "#e4e6eb", background: "#242526" }}>
                    <SiFacebook className="mr-2 w-5 h-5" style={{ color: "#1877F2" }} /> {settings.hero_btn_secondary}
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                {settings.hero_stat_1 && (
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#b0b3b8" }}>
                    <Users className="w-4 h-4" style={{ color: "#1877F2" }} />
                    <span>{settings.hero_stat_1}</span>
                  </div>
                )}
                {settings.hero_stat_2 && (
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#b0b3b8" }}>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{settings.hero_stat_2}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div className="flex-1 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-30" style={{ background: "#1877F2" }} />
                <div className="relative rounded-[2rem] overflow-hidden border-2" style={{ borderColor: "#1877F2" }}>
                  <img src={heroImg} alt={settings.hero_image_name} className="w-full aspect-square object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, #18191a 0%, transparent 100%)" }}>
                    <p className="text-white font-display font-bold text-xl">{settings.hero_image_name}</p>
                    <p className="text-sm font-medium" style={{ color: "#1877F2" }}>{settings.hero_image_role}</p>
                  </div>
                </div>
                {settings.hero_ribbon && (
                  <div className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl font-bold text-sm text-white shadow-xl" style={{ background: "#1877F2" }}>
                    {settings.hero_ribbon}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      {tickerItems.length > 0 && (
        <div className="w-full overflow-hidden py-3 border-y" style={{ background: "#1877F2", borderColor: "#166fe5" }}>
          <div className="animate-marquee flex gap-10 whitespace-nowrap font-display font-bold text-sm tracking-wide text-white">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="flex items-center gap-6">{t} <span className="opacity-40">•</span></span>
            ))}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={i} className="rounded-2xl p-6 text-center"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08 } } }}>
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-1">
                <AnimatedCounter end={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b0b3b8" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>{settings.curriculum_eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">{settings.curriculum_title}</h2>
            <p className="text-base max-w-2xl" style={{ color: "#b0b3b8" }}>{settings.curriculum_subtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {learnCards.map((f, i) => (
              <motion.div key={i} className="rounded-2xl p-7 group" style={{ background: "#242526", border: "1px solid #3a3b3c" }}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                whileHover={{ y: -4 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-[#1877F2]"
                  style={{ background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)" }}>{f.icon}</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#b0b3b8" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 border-y" style={{ borderColor: "#3a3b3c", background: "#1c1e1f" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>{settings.howit_eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">{settings.howit_title}</h2>
          </div>
          <div className="relative">
            <div className="absolute top-9 left-0 right-0 h-px hidden md:block" style={{ background: "linear-gradient(to right, transparent, rgba(24,119,242,0.4), transparent)" }} />
            <div className="grid md:grid-cols-4 gap-10 relative z-10">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-display font-bold text-xl text-white mb-4 border-2 transition-all"
                    style={{ background: "#242526", borderColor: "#3a3b3c" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1877F2"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(24,119,242,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#3a3b3c"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    {s.n}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{s.t}</h3>
                  <p className="text-xs" style={{ color: "#b0b3b8" }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section id="results" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>{settings.results_eyebrow}</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">{settings.results_title}</h2>
            </div>
            <p className="text-sm max-w-sm" style={{ color: "#b0b3b8" }}>{settings.results_subtitle}</p>
          </div>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {successStories.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="overflow-hidden h-full flex flex-col group" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
                  <div className="aspect-square relative overflow-hidden flex items-center justify-center" style={{ background: "#18191a" }}>
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    ) : (
                      <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                        style={{ background: "rgba(24,119,242,0.2)" }}>
                        {s.name?.charAt(0) ?? "?"}
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #18191a 0%, transparent 60%)" }} />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
                      style={{ background: "rgba(24,119,242,0.9)", color: "#fff" }}>
                      <BadgeCheck className="w-3 h-3" /> VERIFIED
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <p className="font-display font-bold text-white text-base">{s.name}</p>
                      <p className="font-display font-bold text-xl" style={{ color: "#1877F2" }}>{s.earn}</p>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1" style={{ background: "#242526" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "#b0b3b8" }}>"{s.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="mt-10 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" data-testid="link-fb-results">
              <Button className="h-12 px-8 font-bold rounded-xl text-white border-0 text-sm" style={{ background: "#1877F2" }}>
                <SiFacebook className="mr-2 w-4 h-4" /> {settings.results_btn} <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CLASSES ── */}
      <section id="schedule" className="py-24 px-4 border-y" style={{ borderColor: "#3a3b3c", background: "#1c1e1f" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>{settings.schedule_eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">{settings.schedule_title}</h2>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>{settings.schedule_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Live batch */}
            <motion.div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "#242526", border: "1px solid #1877F2", boxShadow: "0 0 30px rgba(24,119,242,0.1)" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} whileHover={{ scale: 1.01 }}>
              {settings.batch_start && (
                <div className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: "#1877F2", color: "#fff" }}>
                  {settings.batch_start}
                </div>
              )}
              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)" }}>
                  <Video className="w-5 h-5" style={{ color: "#1877F2" }} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{settings.batch_name}</h3>
                  <p className="text-sm font-medium" style={{ color: "#1877F2" }}>{settings.batch_label}</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 text-sm" style={{ color: "#b0b3b8" }}>
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#1877F2" }} />{f}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
                <div className="flex items-center gap-2">
                  <SiZoom className="w-4 h-4 text-[#2D8CFF]" />
                  <span className="font-semibold text-white text-xs">{settings.zoom_note_title}</span>
                </div>
                <p className="text-xs mt-2" style={{ color: "#b0b3b8" }}>{settings.zoom_note_text}</p>
              </div>
              <Button onClick={() => scrollTo("join-now")} className="w-full h-12 text-sm font-bold rounded-xl text-white border-0"
                style={{ background: "#1877F2" }} data-testid="btn-batch14">
                Enroll in {settings.batch_name} — {courseFee}
              </Button>
            </motion.div>

            {/* Self-paced */}
            <motion.div className="rounded-2xl p-8" style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, delay: 0.12, ease: "easeOut" } } }}
              whileHover={{ scale: 1.01 }}>
              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#3a3b3c", border: "1px solid #4a4b4c" }}>
                  <PlayCircle className="w-5 h-5" style={{ color: "#b0b3b8" }} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{settings.selfpaced_title}</h3>
                  <p className="text-sm font-medium" style={{ color: "#b0b3b8" }}>{settings.selfpaced_label}</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 text-sm" style={{ color: "#b0b3b8" }}>
                {selfFeatures.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#65676b" }} />{t}
                  </li>
                ))}
              </ul>
              <Button onClick={() => scrollTo("join-now")} className="w-full h-12 text-sm font-bold rounded-xl border"
                style={{ background: "transparent", borderColor: "#3a3b3c", color: "#e4e6eb" }} data-testid="btn-selfpaced">
                Enroll — {settings.selfpaced_title} — {courseFee}
              </Button>
            </motion.div>
          </div>

          {/* WhatsApp community */}
          <motion.div className="mt-6 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: "#242526", border: "1px solid rgba(37,211,102,0.25)" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)" }}>
                <SiWhatsapp className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{settings.whatsapp_card_title}</p>
                <p className="text-xs" style={{ color: "#b0b3b8" }}>{settings.whatsapp_card_text}</p>
              </div>
            </div>
            <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp">
              <Button className="font-bold rounded-xl h-10 px-6 text-white border-0 text-sm flex-shrink-0" style={{ background: "#25D366" }}>
                <SiWhatsapp className="mr-2 w-4 h-4" /> Join Group
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PAYMENT ── */}
      <section id="payment" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>{settings.payment_eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">{settings.payment_title}</h2>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>{settings.payment_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Bank card */}
            <motion.div className="rounded-2xl p-7" style={{ background: "#242526", border: "1px solid #1877F2", boxShadow: "0 0 20px rgba(24,119,242,0.08)" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)" }}>
                  <Banknote className="w-5 h-5" style={{ color: "#1877F2" }} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">Bank Transfer</h3>
                  <p className="text-sm" style={{ color: "#b0b3b8" }}>{settings.bank_name}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Account Number", val: settings.bank_account_no, copy: true },
                  { label: "Account Name",   val: settings.bank_account_name, copy: true },
                  { label: "Branch",         val: settings.bank_branch, copy: false },
                  { label: "Bank",           val: settings.bank_name, copy: false },
                ].map(r => (
                  <div key={r.label} className="rounded-xl px-4 py-3" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#65676b" }}>{r.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-bold text-white text-sm">{r.val}</p>
                      {r.copy && <CopyBtn text={r.val} label={r.label} />}
                    </div>
                  </div>
                ))}
                <div className="rounded-xl px-4 py-4 mt-1" style={{ background: "rgba(24,119,242,0.1)", border: "1px solid rgba(24,119,242,0.3)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#1877F2" }}>Course Fee</p>
                  <p className="text-3xl font-display font-bold text-white">{courseFee}</p>
                </div>
              </div>
            </motion.div>

            {/* Steps */}
            <motion.div className="rounded-2xl p-7 flex flex-col justify-between" style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, delay: 0.12, ease: "easeOut" } } }}>
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-6">How to Enroll</h3>
                <div className="space-y-5">
                  {enrollSteps.map(s => (
                    <div key={s.n} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(24,119,242,0.15)", border: "1px solid rgba(24,119,242,0.35)", color: "#1877F2" }}>
                        {s.n}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{s.t}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#b0b3b8" }}>{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-receipt" className="mt-7">
                <Button className="w-full h-11 font-bold rounded-xl text-white border-0 text-sm" style={{ background: "#25D366" }}>
                  <SiWhatsapp className="mr-2 w-4 h-4" /> Send Receipt via WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM ── */}
      <section id="join-now" className="py-24 px-4 border-t" style={{ borderColor: "#3a3b3c", background: "#1c1e1f" }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>{settings.form_eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{settings.form_title}</h2>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>{settings.form_subtitle}</p>
          </div>

          {registeredId && !receiptDone ? (
            <ReceiptUpload studentId={registeredId} courseFee={courseFee} settings={settings} onDone={() => setReceiptDone(true)} />
          ) : receiptDone ? (
            <motion.div className="rounded-2xl p-10 text-center" style={{ background: "#242526", border: "1px solid #10b981" }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-[#10b981]" />
              <h3 className="text-2xl font-display font-bold text-white mb-2">You're All Set!</h3>
              <p className="text-sm mb-6" style={{ color: "#b0b3b8" }}>
                Your registration and receipt have been submitted. Our team will confirm your enrollment via WhatsApp within 24 hours.
              </p>
              <a href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer">
                <Button className="font-bold rounded-xl text-white border-0 h-11 px-6" style={{ background: "#25D366" }}>
                  <SiWhatsapp className="mr-2 w-4 h-4" /> Join WhatsApp Community
                </Button>
              </a>
            </motion.div>
          ) : (
            <motion.div className="rounded-2xl p-8" style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {[
                    { name: "name" as const,    label: "Full Name",       placeholder: "Your full name",     type: "text"  },
                    { name: "phone" as const,   label: "WhatsApp Number", placeholder: "+94 7x xxx xxxx",   type: "tel"   },
                    { name: "email" as const,   label: "Email Address",   placeholder: "your@email.com",    type: "email" },
                    { name: "country" as const, label: "Country",         placeholder: "e.g. Sri Lanka, USA, UK", type: "text" },
                  ].map(f => (
                    <FormField key={f.name} control={form.control} name={f.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: "#b0b3b8" }}>{f.label}</FormLabel>
                          <FormControl>
                            <Input type={f.type} placeholder={f.placeholder}
                              className="h-11 rounded-xl text-white placeholder:text-white/25 border focus:border-[#1877F2]"
                              style={{ background: "#18191a", borderColor: "#3a3b3c" }}
                              {...field} data-testid={`input-${f.name}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormField control={form.control} name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: "#b0b3b8" }}>Select Batch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl text-white border focus:border-[#1877F2]"
                              style={{ background: "#18191a", borderColor: "#3a3b3c" }} data-testid="select-batch">
                              <SelectValue placeholder="Choose your preferred option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent style={{ background: "#242526", borderColor: "#3a3b3c" }}>
                            <SelectItem value="batch-14">{settings.batch_name}</SelectItem>
                            <SelectItem value="self-paced">{settings.selfpaced_title} — {settings.selfpaced_label}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: "#b0b3b8" }}>Select Medium</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl text-white border focus:border-[#1877F2]"
                              style={{ background: "#18191a", borderColor: "#3a3b3c" }} data-testid="select-medium">
                              <SelectValue placeholder="Choose your preferred medium" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent style={{ background: "#242526", borderColor: "#3a3b3c" }}>
                            <SelectItem value="sinhala">Sinhala Medium</SelectItem>
                            <SelectItem value="tamil">Tamil Medium</SelectItem>
                            <SelectItem value="english">English Medium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#b0b3b8" }}>
                      <CreditCard className="w-4 h-4" style={{ color: "#1877F2" }} /><span>Course Fee</span>
                    </div>
                    <span className="font-display font-bold text-xl text-white">{courseFee}</span>
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full h-12 text-sm font-bold rounded-xl text-white border-0 mt-1"
                    style={{ background: "#1877F2" }} data-testid="btn-submit">
                    {submitting ? "Submitting…" : <span className="flex items-center justify-center gap-1">Submit Registration <ChevronRight className="w-4 h-4" /></span>}
                  </Button>
                  <p className="text-xs text-center" style={{ color: "#65676b" }}>
                    Open to students worldwide. After submitting, transfer {courseFee} to the bank above.
                  </p>
                </form>
              </Form>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10 px-4" style={{ borderColor: "#3a3b3c", background: "#18191a" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={profileImg} alt="Soori" className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: "#1877F2" }} />
            <div>
              <p className="font-display font-bold text-white">{settings.footer_brand}</p>
              <p className="text-xs" style={{ color: "#65676b" }}>{settings.footer_tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[
              { href: settings.facebook_url, icon: <SiFacebook className="w-5 h-5 text-[#1877F2]" />,  testId: "link-footer-fb" },
              { href: settings.whatsapp_url, icon: <SiWhatsapp className="w-5 h-5 text-[#25D366]" />,  testId: "link-footer-wa" },
            ].map(l => (
              <a key={l.testId} href={l.href} target="_blank" rel="noopener noreferrer" data-testid={l.testId}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
                {l.icon}
              </a>
            ))}
            <a href="/admin" className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5"
              style={{ borderColor: "#3a3b3c", color: "#65676b" }}>
              Admin
            </a>
          </div>
          <p className="text-xs" style={{ color: "#65676b" }}>
            &copy; {new Date().getFullYear()} {settings.footer_brand}. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
