import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowRight, CheckCircle2, Zap, TrendingUp, MonitorPlay,
  Copy, ExternalLink, Video, CreditCard, Lock,
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
import sooriProfile from "@assets/channels4_profile_1774983180425.jpg";

const FACEBOOK_PAGE    = "https://web.facebook.com/withsooriacademy";
const WHATSAPP_GROUP   = "https://chat.whatsapp.com/KomGpoFV4JQ4ls1KrpVsM9?mode=gi_t";
const ZOOM_LINK        = "https://us06web.zoom.us/rec/share/8_QT-jz81BpN63tycdMXYPr6EUaBGvWc3AwX2wUciZvV4I9fUlh-WIytqDyTiBv1.pYRylEodvo0uRfPs";
const ZOOM_PASSCODE    = "0Lx+YB!E";
const COURSE_FEE       = "Rs. 7,000";
const BANK_NAME        = "Sampath Bank";
const BANK_ACCOUNT_NO  = "107052850407";
const BANK_ACCOUNT_NAME = "S V G A Sooriyapura";
const BANK_BRANCH      = "Gregory Road, Colombo 7";

const formSchema = z.object({
  name:    z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone:   z.string().min(10, { message: "Please enter a valid phone number." }),
  email:   z.string().email({ message: "Please enter a valid email address." }),
  country: z.string().min(2, { message: "Please enter your country." }),
  batch:   z.string().min(1, { message: "Please select a batch." }),
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
    <button
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); toast({ title: "Copied!", description: `${label} copied.` }); setTimeout(() => setOk(false), 2000); }}
      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ml-2"
      data-testid={`copy-${label.toLowerCase().replace(/\s/g,"-")}`}
    >
      {ok ? <CheckCircle2 className="w-4 h-4 text-[#1877F2]" /> : <Copy className="w-4 h-4 text-white/50 hover:text-white" />}
    </button>
  );
}

export default function Home() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", country: "", batch: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registration Received!",
      description: "Our team will contact you on WhatsApp within 24 hours to confirm your enrollment.",
    });
    form.reset();
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#18191a", color: "#e4e6eb" }}>

      {/* Subtle background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #1877F2 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-1/4 w-[50vw] h-[50vw] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #1877F2 0%, transparent 70%)" }} />
      </div>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
        style={{ backgroundColor: "#242526", borderBottom: "1px solid #3a3b3c" }}
      >
        <div className="flex items-center gap-3">
          <img src={sooriProfile} alt="Soori" className="w-9 h-9 rounded-full object-cover border-2 border-[#1877F2]" />
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white tracking-tight">With Soori</span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{ color: "#1877F2", borderColor: "rgba(24,119,242,0.4)", background: "rgba(24,119,242,0.1)" }}>
              Academy
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#b0b3b8" }}>
          <a href="#about"    className="hover:text-white transition-colors">About</a>
          <a href="#results"  className="hover:text-white transition-colors">Results</a>
          <a href="#schedule" className="hover:text-white transition-colors">Classes</a>
          <a href="#payment"  className="hover:text-white transition-colors">Payment</a>
        </div>
        <Button
          onClick={() => scrollTo("join-now")}
          className="h-9 px-5 text-sm font-bold rounded-lg text-white border-0"
          style={{ background: "#1877F2" }}
          data-testid="btn-nav-join"
        >
          Enroll Now
        </Button>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-20 px-4 md:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left — text */}
            <motion.div className="flex-1 text-center lg:text-left" initial="hidden" animate="visible" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{ background: "rgba(24,119,242,0.12)", color: "#1877F2", border: "1px solid rgba(24,119,242,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] animate-pulse" />
                Sri Lanka's #1 Facebook Monetization Academy
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.0] tracking-tight mb-6">
                Turn Your<br />
                <span style={{ color: "#1877F2" }}>Facebook Content</span><br />
                Into Income.
              </h1>

              <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: "#b0b3b8" }}>
                Learn directly from Soori — the first educator in Sri Lanka to teach
                Facebook In-Stream Ads and Content Monetization. Real methods, verified results,
                open to students worldwide.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => scrollTo("join-now")}
                  className="h-13 px-8 text-base font-bold rounded-xl text-white border-0 w-full sm:w-auto"
                  style={{ background: "#1877F2" }}
                  data-testid="btn-hero-enroll"
                >
                  Enroll Now — {COURSE_FEE} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto" data-testid="link-hero-fb">
                  <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold rounded-xl w-full"
                    style={{ borderColor: "#3a3b3c", color: "#e4e6eb", background: "#242526" }}>
                    <SiFacebook className="mr-2 w-5 h-5" style={{ color: "#1877F2" }} />
                    Watch Our Content
                  </Button>
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#b0b3b8" }}>
                  <Users className="w-4 h-4" style={{ color: "#1877F2" }} />
                  <span><strong className="text-white">5,000+</strong> students from 10+ countries</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#b0b3b8" }}>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span><strong className="text-white">4.9</strong> / 5 rating</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Soori's photo */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-30" style={{ background: "#1877F2" }} />
                <div className="relative rounded-[2rem] overflow-hidden border-2" style={{ borderColor: "#1877F2" }}>
                  <img
                    src={sooriProfile}
                    alt="Soori — Founder, With Soori Academy"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5"
                    style={{ background: "linear-gradient(to top, #18191a 0%, transparent 100%)" }}>
                    <p className="text-white font-display font-bold text-xl">Soori</p>
                    <p className="text-sm font-medium" style={{ color: "#1877F2" }}>
                      Founder &amp; Lead Instructor — With Soori Academy
                    </p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl font-bold text-sm text-white shadow-xl"
                  style={{ background: "#1877F2" }}>
                  #1 in Sri Lanka
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── EARNINGS TICKER ── */}
      <div className="w-full overflow-hidden py-3 border-y" style={{ background: "#1877F2", borderColor: "#166fe5" }}>
        <div className="animate-marquee flex gap-10 whitespace-nowrap font-display font-bold text-sm tracking-wide text-white">
          {["Kasun — $1,240/mo","Nishanthi — $850/mo","Dasun — $2,100/mo","Chaminda — $1,500/mo",
            "Saman — $920/mo","Dilani — $1,750/mo","Ruwan — $3,200/mo","Anusha — $680/mo",
            "Kasun — $1,240/mo","Nishanthi — $850/mo","Dasun — $2,100/mo","Chaminda — $1,500/mo",
            "Saman — $920/mo","Dilani — $1,750/mo","Ruwan — $3,200/mo","Anusha — $680/mo"].map((t,i) => (
            <span key={i} className="flex items-center gap-6">{t} <span className="opacity-40">•</span></span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: 5,   prefix: "",  suffix: "K+",  label: "Active Students"  },
            { val: 1,   prefix: "$", suffix: "M+",  label: "Earned by Students" },
            { val: 10,  prefix: "",  suffix: "+",   label: "Countries Represented" },
            { val: 100, prefix: "",  suffix: "%",   label: "Practical Curriculum" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-6 text-center"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08 } } }}
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-1">
                <AnimatedCounter end={s.val} prefix={s.prefix} suffix={s.suffix} />
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>The Curriculum</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">What You Will Learn</h2>
            <p className="text-base max-w-2xl" style={{ color: "#b0b3b8" }}>
              A complete, step-by-step system to activate and grow Facebook Content Monetization —
              regardless of your current follower count or technical background.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <MonitorPlay className="w-6 h-6" />, title: "Content Creation", desc: "Create Facebook-optimised videos that drive high watch time and organic reach. Covers formats, lengths, and proven hook strategies." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "CM Tool Mastery", desc: "Navigate the Content Monetization dashboard. Understand RPM, ad break placement, and how to increase earnings per 1,000 views." },
              { icon: <Globe className="w-6 h-6" />,        title: "Global Audience Growth", desc: "Target Tier 1 audiences in the US, UK, and Canada for significantly higher CPMs. Scale beyond local reach into international income." },
            ].map((f, i) => (
              <motion.div key={i} className="rounded-2xl p-7 group"
                style={{ background: "#242526", border: "1px solid #3a3b3c" }}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                whileHover={{ y: -4 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-[#1877F2]"
                  style={{ background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)" }}>
                  {f.icon}
                </div>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>Step by Step</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Your Path to Monetization</h2>
          </div>
          <div className="relative">
            <div className="absolute top-9 left-0 right-0 h-px hidden md:block" style={{ background: "linear-gradient(to right, transparent, rgba(24,119,242,0.4), transparent)" }} />
            <div className="grid md:grid-cols-4 gap-10 relative z-10">
              {[
                { n: "01", t: "Enroll",         d: "Register and complete payment" },
                { n: "02", t: "Learn",           d: "Attend live or self-paced sessions" },
                { n: "03", t: "Activate CM",     d: "Hit Facebook's eligibility criteria" },
                { n: "04", t: "Earn Monthly",    d: "Receive payouts directly from Facebook" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-18 h-18 rounded-full flex items-center justify-center font-display font-bold text-xl text-white mb-4 border-2 transition-all w-[72px] h-[72px]"
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
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>Student Success</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Real Results. Real People.</h2>
            </div>
            <p className="text-sm max-w-sm" style={{ color: "#b0b3b8" }}>
              Verified earnings from students across Sri Lanka who completed our program.
            </p>
          </div>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { name: "Kasun Perera",    earn: "$1,240/mo", q: "My daily vlogs now pay all my bills. This program is the real thing.", img: "/images/success-1.png" },
              { name: "Nishanthi Silva", earn: "$850/mo",   q: "No tech background, no problem. The lessons are clear and actionable.", img: "/images/success-2.png" },
              { name: "Dasun Fernando",  earn: "$2,100/mo", q: "Hit $2k in 3 months. The CM tool strategy alone was worth 10x the fee.", img: "/images/success-3.png" },
              { name: "Chaminda Kumara", earn: "$1,500/mo", q: "I'm 50 years old and I figured it out. Age is no barrier here.", img: "/images/success-4.png" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="overflow-hidden h-full flex flex-col group" style={{ background: "#242526", border: "1px solid #3a3b3c" }}>
                  <div className="aspect-square relative overflow-hidden" style={{ background: "#18191a" }}>
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
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
                    <p className="text-sm leading-relaxed" style={{ color: "#b0b3b8" }}>"{s.q}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="mt-10 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" data-testid="link-fb-results">
              <Button className="h-12 px-8 font-bold rounded-xl text-white border-0 text-sm"
                style={{ background: "#1877F2" }}>
                <SiFacebook className="mr-2 w-4 h-4" />
                Watch More Success Videos on Facebook
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CLASSES ── */}
      <section id="schedule" className="py-24 px-4 border-y" style={{ borderColor: "#3a3b3c", background: "#1c1e1f" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>Upcoming</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">Class Schedule</h2>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>
              Seats are limited. Enroll early to secure your place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Live batch */}
            <motion.div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "#242526", border: "1px solid #1877F2", boxShadow: "0 0 30px rgba(24,119,242,0.1)" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              whileHover={{ scale: 1.01 }}>
              <div className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: "#1877F2", color: "#fff" }}>
                NEXT BATCH
              </div>
              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)" }}>
                  <Video className="w-5 h-5" style={{ color: "#1877F2" }} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Batch 14 — Live</h3>
                  <p className="text-sm font-medium" style={{ color: "#1877F2" }}>Interactive Zoom Sessions</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 text-sm" style={{ color: "#b0b3b8" }}>
                {["4-week intensive weekend program","Live Q&A with Soori every session","Full recording access lifetime","Private WhatsApp support group"].map(t => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#1877F2" }} />{t}</li>
                ))}
              </ul>

              {/* Zoom link */}
              <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
                <div className="flex items-center gap-2 mb-3">
                  <SiZoom className="w-4 h-4 text-[#2D8CFF]" />
                  <span className="font-semibold text-white text-xs">Week 4 — Session Recording</span>
                </div>
                <div className="flex items-center rounded-lg px-3 py-2 mb-2" style={{ background: "#242526" }}>
                  <span className="text-xs truncate flex-1" style={{ color: "#b0b3b8" }}>{ZOOM_LINK.substring(0, 44)}…</span>
                  <CopyBtn text={ZOOM_LINK} label="Zoom Link" />
                  <a href={ZOOM_LINK} target="_blank" rel="noopener noreferrer" className="ml-1 p-1.5 rounded-lg hover:bg-white/10 transition-colors" data-testid="link-zoom">
                    <ExternalLink className="w-4 h-4" style={{ color: "#b0b3b8" }} />
                  </a>
                </div>
                <div className="flex items-center rounded-lg px-3 py-2" style={{ background: "#242526" }}>
                  <Lock className="w-3.5 h-3.5 mr-2" style={{ color: "#b0b3b8" }} />
                  <span className="text-xs mr-2" style={{ color: "#b0b3b8" }}>Passcode:</span>
                  <span className="text-xs font-mono font-bold text-white">{ZOOM_PASSCODE}</span>
                  <CopyBtn text={ZOOM_PASSCODE} label="Passcode" />
                </div>
              </div>

              <Button onClick={() => scrollTo("join-now")} className="w-full h-12 text-sm font-bold rounded-xl text-white border-0"
                style={{ background: "#1877F2" }} data-testid="btn-batch14">
                Enroll in Batch 14 — {COURSE_FEE}
              </Button>
            </motion.div>

            {/* Self-paced */}
            <motion.div className="rounded-2xl p-8"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, delay: 0.12, ease: "easeOut" } } }}
              whileHover={{ scale: 1.01 }}>
              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#3a3b3c", border: "1px solid #4a4b4c" }}>
                  <PlayCircle className="w-5 h-5" style={{ color: "#b0b3b8" }} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Self-Paced</h3>
                  <p className="text-sm font-medium" style={{ color: "#b0b3b8" }}>Pre-recorded Portal</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6 text-sm" style={{ color: "#b0b3b8" }}>
                {["Available immediately after payment","40+ structured HD video lessons","Learn on your own schedule","WhatsApp community access"].map(t => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#65676b" }} />{t}</li>
                ))}
              </ul>
              <Button onClick={() => scrollTo("join-now")} className="w-full h-12 text-sm font-bold rounded-xl border" data-testid="btn-selfpaced"
                style={{ background: "transparent", borderColor: "#3a3b3c", color: "#e4e6eb" }}>
                Enroll — Self-Paced — {COURSE_FEE}
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
                <p className="font-bold text-white text-sm">Join the WhatsApp Community</p>
                <p className="text-xs" style={{ color: "#b0b3b8" }}>Get class updates, tips and direct support from Soori</p>
              </div>
            </div>
            <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp">
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>Enrollment & Payment</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">Payment Details</h2>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>
              Transfer the course fee to the bank account below, then send your receipt to our WhatsApp to confirm.
            </p>
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
                  <p className="text-sm" style={{ color: "#b0b3b8" }}>{BANK_NAME}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Account Number", val: BANK_ACCOUNT_NO, copy: true },
                  { label: "Account Name",   val: BANK_ACCOUNT_NAME, copy: true },
                  { label: "Branch",          val: BANK_BRANCH, copy: false },
                  { label: "Bank",            val: BANK_NAME, copy: false },
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
                  <p className="text-3xl font-display font-bold text-white">{COURSE_FEE}</p>
                </div>
              </div>
            </motion.div>

            {/* Steps */}
            <motion.div className="rounded-2xl p-7 flex flex-col justify-between"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, delay: 0.12, ease: "easeOut" } } }}>
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-6">How to Enroll</h3>
                <div className="space-y-5">
                  {[
                    { n: "1", t: "Fill the registration form",     d: "Enter your name, phone, email and batch." },
                    { n: "2", t: "Transfer the course fee",        d: `Send ${COURSE_FEE} to the bank details on the left.` },
                    { n: "3", t: "Send your payment receipt",      d: "WhatsApp a photo of the bank slip to our team." },
                    { n: "4", t: "Get your access confirmed",       d: "We will confirm and send class access within 24 hours." },
                  ].map(s => (
                    <div key={s.n} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
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
              <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-receipt" className="mt-7">
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
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1877F2" }}>Get Started</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Reserve Your Spot</h2>
            <p className="text-sm" style={{ color: "#b0b3b8" }}>
              Fill in your details. Our team will contact you within 24 hours on WhatsApp to confirm payment and access.
            </p>
          </div>
          <motion.div className="rounded-2xl p-8" style={{ background: "#242526", border: "1px solid #3a3b3c" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {[
                  { name: "name" as const,    label: "Full Name",        placeholder: "Your full name", type: "text"  },
                  { name: "phone" as const,   label: "WhatsApp Number",  placeholder: "+94 7x xxx xxxx", type: "tel"  },
                  { name: "email" as const,   label: "Email Address",    placeholder: "your@email.com", type: "email" },
                  { name: "country" as const, label: "Country",          placeholder: "e.g. Sri Lanka, USA, UK", type: "text" },
                ].map(f => (
                  <FormField key={f.name} control={form.control} name={f.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: "#b0b3b8" }}>{f.label}</FormLabel>
                        <FormControl>
                          <Input type={f.type} placeholder={f.placeholder}
                            className="h-11 rounded-xl text-white placeholder:text-white/25 border focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]"
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
                          <SelectItem value="batch-14">Batch 14 — Live Zoom Sessions</SelectItem>
                          <SelectItem value="self-paced">Self-Paced — Pre-recorded Portal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between rounded-xl px-4 py-3 mt-1"
                  style={{ background: "#18191a", border: "1px solid #3a3b3c" }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#b0b3b8" }}>
                    <CreditCard className="w-4 h-4" style={{ color: "#1877F2" }} />
                    <span>Course Fee</span>
                  </div>
                  <span className="font-display font-bold text-xl text-white">{COURSE_FEE}</span>
                </div>
                <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl text-white border-0 mt-1"
                  style={{ background: "#1877F2" }} data-testid="btn-submit">
                  Submit Registration <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
                <p className="text-xs text-center" style={{ color: "#65676b" }}>
                  Open to students worldwide. After submitting, transfer {COURSE_FEE} to the bank above and send your receipt via WhatsApp.
                </p>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10 px-4" style={{ borderColor: "#3a3b3c", background: "#18191a" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={sooriProfile} alt="Soori" className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: "#1877F2" }} />
            <div>
              <p className="font-display font-bold text-white">With Soori Academy</p>
              <p className="text-xs" style={{ color: "#65676b" }}>Sri Lanka's #1 Facebook Monetization Educator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" data-testid="link-footer-fb"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#1877F2"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#3a3b3c"}>
              <SiFacebook className="w-5 h-5 text-[#1877F2]" />
            </a>
            <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" data-testid="link-footer-wa"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#25D366"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#3a3b3c"}>
              <SiWhatsapp className="w-5 h-5 text-[#25D366]" />
            </a>
            <a href={ZOOM_LINK} target="_blank" rel="noopener noreferrer" data-testid="link-footer-zoom"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#242526", border: "1px solid #3a3b3c" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#2D8CFF"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#3a3b3c"}>
              <SiZoom className="w-5 h-5 text-[#2D8CFF]" />
            </a>
          </div>
          <p className="text-xs" style={{ color: "#65676b" }}>
            &copy; {new Date().getFullYear()} With Soori Academy. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
