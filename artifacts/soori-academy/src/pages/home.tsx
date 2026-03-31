import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  PlayCircle, Trophy, Users, Globe, ArrowRight,
  CheckCircle2, Star, Zap, TrendingUp, MonitorPlay,
  Copy, ExternalLink, Video, Calendar, CreditCard,
  Lock, ChevronRight, BadgeCheck, Banknote
} from "lucide-react";
import { SiFacebook, SiYoutube, SiWhatsapp, SiZoom } from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FACEBOOK_PAGE = "https://web.facebook.com/withsooriacademy";
const WHATSAPP_GROUP = "https://chat.whatsapp.com/KomGpoFV4JQ4ls1KrpVsM9?mode=gi_t";
const ZOOM_LINK = "https://us06web.zoom.us/rec/share/8_QT-jz81BpN63tycdMXYPr6EUaBGvWc3AwX2wUciZvV4I9fUlh-WIytqDyTiBv1.pYRylEodvo0uRfPs";
const ZOOM_PASSCODE = "0Lx+YB!E";
const COURSE_FEE = "Rs. 7,000";
const BANK_NAME = "Sampath Bank";
const BANK_ACCOUNT_NO = "107052850407";
const BANK_ACCOUNT_NAME = "S V G A Sooriyapura";
const BANK_BRANCH = "Gregory Road, Colombo 7";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  batch: z.string().min(1, { message: "Please select a batch." }),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, inView]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-muted-foreground hover:text-white"
      data-testid={`btn-copy-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function Home() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", batch: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registration Submitted!",
      description: "Check your WhatsApp — our team will contact you shortly to confirm payment.",
    });
    form.reset();
  }

  const scrollToJoin = () => {
    document.getElementById("join-now")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToPayment = () => {
    document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-foreground">

      {/* Fixed background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25], x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-primary/20 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15], x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[150px]"
        />
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-5xl glass-card rounded-full px-5 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-2xl tracking-tighter text-white">SOORI</span>
          <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30">
            Academy
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#success" className="hover:text-primary transition-colors">Results</a>
          <a href="#schedule" className="hover:text-primary transition-colors">Classes</a>
          <a href="#payment" className="hover:text-primary transition-colors">Payment</a>
        </div>
        <Button
          onClick={scrollToJoin}
          className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 text-white font-bold rounded-full px-5 h-10 text-sm shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-primary/40 hover:scale-105 transition-transform"
          data-testid="btn-nav-join"
        >
          Join Now <Zap className="ml-1.5 w-3.5 h-3.5" />
        </Button>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-[100dvh] flex items-center justify-center pt-28 pb-16 px-4 relative">
        <div className="container mx-auto max-w-6xl flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-accent text-sm font-bold mb-8 border-accent/30 shadow-[0_0_15px_rgba(0,255,135,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Sri Lanka's First Facebook In-Stream Ads Educator
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-display font-extrabold text-white leading-[0.9] tracking-tighter mb-6"
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            TURN VIEWS<br />
            INTO{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-accent glow-text">
              REVENUE.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-10 font-medium leading-relaxed"
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            The original Sri Lankan academy for Facebook Content Monetization & In-Stream Ads.
            Real methods. Real income. From the pioneer himself.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center"
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            <Button
              size="lg"
              onClick={scrollToJoin}
              className="h-14 px-10 text-base bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-[0_0_30px_rgba(124,58,237,0.5)] border border-primary/40 hover:scale-105 transition-transform"
              data-testid="btn-hero-join"
            >
              Enroll Now — {COURSE_FEE} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" data-testid="link-hero-facebook">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full w-full border-white/20 text-white hover:bg-white/10 bg-transparent font-semibold"
              >
                <SiFacebook className="mr-2 w-5 h-5 text-blue-400" /> Watch Our Content
              </Button>
            </a>
          </motion.div>

          <motion.div
            className="mt-14 w-full max-w-4xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-[2rem] overflow-hidden glass-card p-2 glow-border">
              <img
                src="/images/hero-educator.png"
                alt="Soori — Founder of With Soori Academy"
                className="w-full h-[42vh] md:h-[58vh] object-cover rounded-[1.5rem] brightness-110 contrast-110"
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">CM Tool Activated</p>
                    <p className="text-accent text-xs font-bold glow-green">Over $1M+ Generated by Students</p>
                  </div>
                </div>
                <a
                  href={FACEBOOK_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-3 rounded-2xl flex items-center gap-2 hover:bg-white/15 transition-colors"
                  data-testid="link-hero-fb-page"
                >
                  <SiFacebook className="w-5 h-5 text-blue-400" />
                  <span className="text-white text-sm font-semibold hidden sm:block">Our Facebook Page</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EARNINGS TICKER ── */}
      <div className="w-full overflow-hidden bg-primary/90 py-4 border-y border-primary/60 relative z-20 flex whitespace-nowrap shadow-[0_0_30px_rgba(124,58,237,0.3)]">
        <div className="animate-marquee flex gap-10 items-center text-white font-display font-bold text-base tracking-wider pr-10">
          {["Kasun — $1,240/mo", "Nishanthi — $850/mo", "Dasun — $2,100/mo", "Chaminda — $1,500/mo",
            "Saman — $920/mo", "Dilani — $1,750/mo", "Ruwan — $3,200/mo", "Anusha — $680/mo",
            "Kasun — $1,240/mo", "Nishanthi — $850/mo", "Dasun — $2,100/mo", "Chaminda — $1,500/mo",
            "Saman — $920/mo", "Dilani — $1,750/mo", "Ruwan — $3,200/mo", "Anusha — $680/mo"].map((item, i) => (
            <span key={i} className="flex items-center gap-4">
              {item} <span className="text-accent opacity-70">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="glass-card rounded-[2rem] p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-white/10">
              {[
                { val: 5, suffix: "K+", label: "Active Students", color: "text-white glow-text" },
                { val: 1, prefix: "$", suffix: "M+", label: "Student Revenue", color: "text-accent glow-green" },
                { val: 1, suffix: "st", label: "In Sri Lanka", color: "text-white glow-text" },
                { val: 100, suffix: "%", label: "Practical", color: "text-white glow-text" },
              ].map((s, i) => (
                <div key={i} className="text-center px-4">
                  <div className={`text-5xl md:text-6xl font-display font-bold mb-2 ${s.color}`}>
                    <AnimatedCounter end={s.val} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">The Blueprint</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
              What Exactly Do We Teach?
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl">
              A complete system to monetize your Facebook content — from setup to your first payout.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MonitorPlay className="w-8 h-8 text-primary" />,
                sinhala: "වීඩියෝ හදන රහස්",
                title: "Content Creation",
                desc: "Create engaging, algorithm-optimized videos. Learn the formats, lengths, and hooks that drive real watch time.",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-accent" />,
                sinhala: "CM Tool එක",
                title: "CM Tool Mastery",
                desc: "Navigate Facebook's Content Monetization tool. Understand RPM, ad breaks, and how to maximize every view.",
              },
              {
                icon: <Globe className="w-8 h-8 text-violet-400" />,
                sinhala: "ලෝකෙටම යන්න",
                title: "Global Audience",
                desc: "Target Tier 1 countries (US, UK, CA) for higher CPMs. Scale your income beyond local reach.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="glass-card p-8 rounded-3xl group cursor-default"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/40 transition-colors">
                  {f.icon}
                </div>
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase">{f.sinhala}</span>
                <h3 className="text-xl font-display font-bold text-white mt-1 mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 relative z-10 border-y border-white/5 bg-black/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">පියවරෙන් පියවර</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">The Path to Monetization</h2>
          </div>
          <div className="relative">
            <div className="absolute top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent hidden md:block" />
            <div className="grid md:grid-cols-4 gap-10 relative z-10">
              {[
                { step: "01", title: "Enroll", desc: "Register & pay course fee" },
                { step: "02", title: "Learn", desc: "Attend live or pre-recorded sessions" },
                { step: "03", title: "Unlock CM", desc: "Hit Facebook's eligibility criteria" },
                { step: "04", title: "Earn", desc: "Receive monthly payouts" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center font-display font-bold text-2xl text-white mb-5 border-2 border-transparent group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section id="success" className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block glow-green">සාර්ථක වූ සිසුන්</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white">Real Receipts.</h2>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm">
              Verified earnings from real students. These are ordinary people with extraordinary results.
            </p>
          </div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {[
              { name: "Kasun Perera", earn: "$1,240 / mo", quote: "My daily vlogs now pay my bills and more. Soori sir's system is the real deal.", img: "/images/success-1.png" },
              { name: "Nishanthi Silva", earn: "$850 / mo", quote: "As a housewife with no tech background, I never thought this was possible. Now it's my income.", img: "/images/success-2.png" },
              { name: "Dasun Fernando", earn: "$2,100 / mo", quote: "Hit $2k in just 3 months. The CM tool strategy alone was worth 10x the course fee.", img: "/images/success-3.png" },
              { name: "Chaminda Kumara", earn: "$1,500 / mo", quote: "I'm 50 and I figured it out. Age is no barrier when the teaching is this clear.", img: "/images/success-4.png" },
            ].map((story, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="glass-card overflow-hidden h-full flex flex-col group border-white/10 hover:border-accent/40 transition-all duration-500">
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <img
                      src={story.img}
                      alt={story.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                    <div className="absolute top-3 right-3 glass-card px-2.5 py-1 rounded-full text-[10px] font-bold text-accent border border-accent/30 flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 fill-accent text-background" /> VERIFIED
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h4 className="font-display font-bold text-white">{story.name}</h4>
                      <p className="text-accent font-display font-bold text-2xl glow-green">{story.earn}</p>
                    </div>
                  </div>
                  <CardContent className="p-5 bg-white/5 flex-1">
                    <p className="text-muted-foreground text-sm leading-relaxed">"{story.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Facebook Page CTA */}
          <motion.div
            className="mt-12 text-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          >
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" data-testid="link-facebook-page">
              <Button className="h-14 px-10 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-full text-base shadow-[0_0_30px_rgba(24,119,242,0.4)] border border-blue-500/40 hover:scale-105 transition-transform">
                <SiFacebook className="mr-2 w-5 h-5" />
                Watch Student Videos on Our Facebook Page
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CLASS SCHEDULE ── */}
      <section id="schedule" className="py-32 relative z-10 border-y border-white/5 bg-black/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">මීලඟ පන්තිය</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-3">Upcoming Classes</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Seats are limited per batch. Reserve your spot early to avoid missing out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Batch Card */}
            <motion.div
              className="glass-card p-8 rounded-[2rem] relative overflow-hidden border-primary/40 shadow-[0_0_40px_rgba(124,58,237,0.15)] group"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-5 right-5 bg-accent text-background text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_12px_rgba(0,255,135,0.5)]">
                NEXT DROP
              </div>
              <div className="flex items-center gap-3 mb-6 mt-3">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">Batch 14 — Live</h3>
                  <p className="text-primary text-sm font-semibold">Interactive Zoom Sessions</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> 4-week intensive weekend program</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> Live Q&A with Soori every session</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> Recording access for all sessions</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> Private WhatsApp support group</li>
              </ul>

              {/* Zoom Link */}
              <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <SiZoom className="w-5 h-5 text-[#2D8CFF]" />
                  <span className="text-white font-bold text-sm">Week 4 — Live Session Recording</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 mb-2">
                  <span className="text-muted-foreground text-xs truncate flex-1">{ZOOM_LINK.substring(0, 45)}…</span>
                  <CopyButton text={ZOOM_LINK} label="Zoom Link" />
                  <a href={ZOOM_LINK} target="_blank" rel="noopener noreferrer" className="ml-1 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" data-testid="link-zoom">
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-white" />
                  </a>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">Passcode:</span>
                  <span className="text-white text-xs font-mono font-bold">{ZOOM_PASSCODE}</span>
                  <CopyButton text={ZOOM_PASSCODE} label="Passcode" />
                </div>
              </div>

              <Button onClick={scrollToJoin} className="w-full bg-primary hover:bg-primary/90 text-white h-13 text-base font-bold rounded-2xl glow-border" data-testid="btn-batch14-enroll">
                Enroll in Batch 14 — {COURSE_FEE}
              </Button>
            </motion.div>

            {/* Pre-recorded Card */}
            <motion.div
              className="glass-card p-8 rounded-[2rem] border-white/10 group"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { duration: 0.6, delay: 0.15, ease: "easeOut" } } }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-6 mt-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <PlayCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">Self-Paced</h3>
                  <p className="text-muted-foreground text-sm font-semibold">Pre-recorded Portal Access</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white/40 flex-shrink-0" /> Available immediately after payment</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white/40 flex-shrink-0" /> 40+ structured video lessons</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white/40 flex-shrink-0" /> Learn at your own schedule</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white/40 flex-shrink-0" /> WhatsApp support community</li>
              </ul>
              <Button onClick={scrollToJoin} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-13 text-base font-bold rounded-2xl bg-transparent" data-testid="btn-selfpaced-enroll">
                Enroll — Self-Paced — {COURSE_FEE}
              </Button>
            </motion.div>
          </div>

          {/* WhatsApp Group */}
          <motion.div
            className="mt-10 glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-[#25D366]/30 shadow-[0_0_20px_rgba(37,211,102,0.1)]"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#25D366]/20 rounded-2xl flex items-center justify-center">
                <SiWhatsapp className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="text-white font-bold">Join Our WhatsApp Community</p>
                <p className="text-muted-foreground text-sm">Get class updates, tips & direct support from Soori</p>
              </div>
            </div>
            <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-group">
              <Button className="bg-[#25D366] hover:bg-[#1fbd5a] text-white font-bold rounded-full px-6 h-11 hover:scale-105 transition-transform flex-shrink-0 shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                <SiWhatsapp className="mr-2 w-4 h-4" /> Join Group
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PAYMENT DETAILS ── */}
      <section id="payment" className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block glow-green">ගෙවීම</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-3">Payment Details</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Complete your bank transfer and send the receipt to our WhatsApp to confirm your enrollment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Bank Details Card */}
            <motion.div
              className="glass-card rounded-[2rem] p-8 border-primary/30"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                  <Banknote className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Bank Transfer</h3>
                  <p className="text-muted-foreground text-sm">{BANK_NAME}</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Account Number", value: BANK_ACCOUNT_NO, copyable: true },
                  { label: "Account Name", value: BANK_ACCOUNT_NAME, copyable: true },
                  { label: "Branch", value: BANK_BRANCH, copyable: false },
                  { label: "Bank", value: BANK_NAME, copyable: false },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold font-mono text-sm">{item.value}</p>
                      {item.copyable && <CopyButton text={item.value} label={item.label} />}
                    </div>
                  </div>
                ))}
                <div className="bg-accent/10 rounded-xl p-4 border border-accent/30 mt-2">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Course Fee</p>
                  <p className="text-accent font-display font-bold text-3xl glow-green">{COURSE_FEE}</p>
                </div>
              </div>
            </motion.div>

            {/* How to Pay Steps */}
            <motion.div
              className="glass-card rounded-[2rem] p-8 border-white/10 flex flex-col justify-between"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { duration: 0.6, delay: 0.15, ease: "easeOut" } } }}
            >
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-6">How to Enroll</h3>
                <div className="space-y-5">
                  {[
                    { n: "1", t: "Fill the registration form below", d: "Enter your name, phone & batch selection." },
                    { n: "2", t: "Make the bank transfer", d: `Transfer ${COURSE_FEE} to the account on the left.` },
                    { n: "3", t: "Send your receipt", d: "WhatsApp a photo of the transfer receipt to our team." },
                    { n: "4", t: "Get confirmed", d: "We will send your class access within 24 hours." },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 mt-0.5">
                        {step.n}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{step.t}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" data-testid="link-payment-whatsapp" className="mt-8">
                <Button className="w-full bg-[#25D366] hover:bg-[#1fbd5a] text-white font-bold rounded-2xl h-12 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform">
                  <SiWhatsapp className="mr-2 w-5 h-5" />
                  Send Receipt via WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM ── */}
      <section id="join-now" className="py-32 relative z-10 bg-black/40 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">ලියාපදිංචි වන්න</span>
              <h2 className="text-4xl font-display font-bold text-white mb-3">Reserve Your Spot</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Fill in your details. Our team will contact you on WhatsApp within 24 hours to confirm your enrollment and payment.
              </p>
            </div>

            <motion.div
              className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-primary/25 relative overflow-hidden"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            >
              <div className="absolute top-0 right-0 w-56 h-56 bg-primary/15 rounded-full blur-[80px] -z-10" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent/8 rounded-full blur-[80px] -z-10" />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
                            {...field}
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-xs font-bold uppercase tracking-widest">WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="07x xxx xxxx"
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/30"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Select Batch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-white focus:border-primary focus:ring-primary/30" data-testid="select-batch">
                              <SelectValue placeholder="Choose your preferred option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="batch-14">Batch 14 — Live Zoom Sessions</SelectItem>
                            <SelectItem value="self-paced">Self-Paced — Pre-recorded Portal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>Course Fee</span>
                    </div>
                    <span className="text-accent font-display font-bold text-xl glow-green">{COURSE_FEE}</span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-bold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 text-white rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)] mt-2 hover:scale-[1.02] transition-transform"
                    data-testid="btn-submit-form"
                  >
                    Submit Registration <ChevronRight className="ml-1 w-5 h-5" />
                  </Button>
                  <p className="text-muted-foreground text-xs text-center">
                    After submitting, transfer {COURSE_FEE} to the bank details above and send your receipt to our WhatsApp.
                  </p>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/10 py-12 bg-black/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display font-bold text-2xl tracking-tighter text-white">SOORI</span>
                <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30">
                  Academy
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Sri Lanka's first and leading Facebook In-Stream Ads & Content Monetization Academy.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-3">
                <a
                  href={FACEBOOK_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] transition-all"
                  data-testid="link-footer-facebook"
                >
                  <SiFacebook className="w-5 h-5 text-[#1877F2]" />
                </a>
                <a
                  href={WHATSAPP_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-[#25D366]/50 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all"
                  data-testid="link-footer-whatsapp"
                >
                  <SiWhatsapp className="w-5 h-5 text-[#25D366]" />
                </a>
                <a
                  href={ZOOM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-[#2D8CFF]/50 hover:shadow-[0_0_15px_rgba(45,140,255,0.4)] transition-all"
                  data-testid="link-footer-zoom"
                >
                  <SiZoom className="w-5 h-5 text-[#2D8CFF]" />
                </a>
              </div>
              <p className="text-muted-foreground text-xs">
                &copy; {new Date().getFullYear()} With Soori Academy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
