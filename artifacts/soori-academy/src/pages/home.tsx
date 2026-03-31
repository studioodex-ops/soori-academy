import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Facebook, Youtube, MessageCircle, PlayCircle, Trophy, Users, Globe, ArrowRight, CheckCircle2, Star, Zap, TrendingUp, MonitorPlay } from "lucide-react";
import { SiFacebook, SiYoutube, SiWhatsapp } from "react-icons/si";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  batch: z.string().min(1, { message: "Please select a batch." }),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
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
  }, [end]);

  return <span>{prefix}{count}{suffix}</span>;
}

export default function Home() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      batch: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "ACCESS GRANTED!",
      description: "You're on the list. Our team will drop a message shortly.",
      className: "bg-card border-primary text-foreground glass-card"
    });
    form.reset();
  }

  const scrollToJoin = () => {
    const el = document.getElementById("join-now");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground text-foreground">
      
      {/* Dynamic Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-accent/10 blur-[150px]" 
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl glass-card rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-2xl tracking-tighter text-white glow-text">SOORI</span>
          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/30">Academy</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
          <a href="#about" className="hover:text-primary hover:glow-text transition-all">Mission</a>
          <a href="#success" className="hover:text-primary hover:glow-text transition-all">Results</a>
          <a href="#schedule" className="hover:text-primary hover:glow-text transition-all">Drops</a>
        </div>
        <Button onClick={scrollToJoin} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-500 text-white font-bold rounded-full px-6 shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-primary/50 transition-all hover:scale-105" data-testid="btn-nav-join">
          Join Now <Zap className="ml-2 w-4 h-4" />
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[100dvh] pt-32 pb-20 px-4 relative flex items-center justify-center">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-accent font-bold text-sm mb-8 border-accent/30 shadow-[0_0_15px_rgba(0,255,135,0.2)]"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              ඔබේ Content වලින් මුදල් උපයන්න
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl lg:text-[7rem] font-display font-extrabold text-white leading-[0.9] tracking-tighter mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              TURN VIEWS <br />
              INTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent glow-text">REVENUE.</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl font-medium"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              Sri Lanka's #1 Facebook In-Stream Ads & Content Monetization Academy. Learn from the pioneer, build your empire.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-md mx-auto relative z-10"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Button size="lg" onClick={scrollToJoin} className="h-16 px-10 text-lg bg-primary hover:bg-primary/90 text-white font-bold rounded-full w-full shadow-[0_0_30px_rgba(124,58,237,0.6)] border border-primary/50 transition-transform hover:scale-105" data-testid="btn-hero-join">
                Start Earning Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div 
              className="mt-16 relative w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative rounded-[2rem] overflow-hidden glass-card p-2 glow-border">
                <img 
                  src="/images/hero-educator.png" 
                  alt="Soori presenting" 
                  className="w-full h-[40vh] md:h-[60vh] object-cover rounded-[1.5rem] filter contrast-125 saturate-110"
                />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(0,255,135,0.4)]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm md:text-base tracking-tight">CM Tool Activated</p>
                      <p className="text-accent text-xs font-bold glow-green">Over $1M+ Generated</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Ticker Section */}
      <div className="w-full overflow-hidden bg-primary py-4 border-y border-primary/50 relative z-20 flex whitespace-nowrap shadow-[0_0_30px_rgba(124,58,237,0.3)]">
        <div className="animate-marquee flex gap-8 items-center text-white font-display font-bold text-xl tracking-wider">
          <span>Kasun — $1,240/mo</span> <span className="text-accent">✦</span>
          <span>Nishanthi — $850/mo</span> <span className="text-accent">✦</span>
          <span>Dasun — $2,100/mo</span> <span className="text-accent">✦</span>
          <span>Chaminda — $1,500/mo</span> <span className="text-accent">✦</span>
          <span>Kasun — $1,240/mo</span> <span className="text-accent">✦</span>
          <span>Nishanthi — $850/mo</span> <span className="text-accent">✦</span>
          <span>Dasun — $2,100/mo</span> <span className="text-accent">✦</span>
          <span>Chaminda — $1,500/mo</span> <span className="text-accent">✦</span>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="glass-card rounded-[2rem] p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/10">
              <div className="text-center px-4">
                <h3 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 glow-text">
                  <AnimatedCounter end={5} suffix="K+" />
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Creators Earning</p>
              </div>
              <div className="text-center px-4">
                <h3 className="text-5xl md:text-6xl font-display font-bold text-accent mb-2 glow-green">
                  <AnimatedCounter end={1} prefix="$" suffix="M+" />
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Student Revenue</p>
              </div>
              <div className="text-center px-4">
                <h3 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 glow-text">1st</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">In Sri Lanka</p>
              </div>
              <div className="text-center px-4">
                <h3 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 glow-text">100%</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Practical Guide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">The Blueprint</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
              මොකක්ද මේ In-Stream Ads?<br />
              <span className="text-muted-foreground">What exactly do we teach?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MonitorPlay className="w-8 h-8 text-primary" />,
                title: "Content Creation",
                sinhala: "වීඩියෝ හදන රහස්",
                desc: "Learn how to create highly-engaging, algorithm-friendly videos that pull massive views."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-accent" />,
                title: "CM Tool Mastery",
                sinhala: "CM Tool එක පාවිච්චිය",
                desc: "Navigate the Content Monetization tool like a pro. Optimize your RPM and ad placements."
              },
              {
                icon: <Globe className="w-8 h-8 text-purple-400" />,
                title: "Global Reach",
                sinhala: "ලෝකෙටම යන්න",
                desc: "Tap into high-paying tier 1 countries. Build an international audience that multiplies your revenue."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="glass-card p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-primary/50 transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-primary text-xs font-bold tracking-widest uppercase mb-2">{feature.sinhala}</h4>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 relative z-10 border-y border-white/5 bg-black/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              <span className="block text-primary text-xl md:text-2xl mb-4 uppercase tracking-widest">පියවරෙන් පියවර</span>
              The Monetization Path
            </h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 hidden md:block" />
            
            <div className="grid md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: "01", title: "Join Class", desc: "Enroll in our next drop" },
                { step: "02", title: "Create", desc: "Upload consistently" },
                { step: "03", title: "Unlock CM", desc: "Hit the metrics" },
                { step: "04", title: "Earn", desc: "Cash out monthly" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center font-display font-bold text-2xl text-white mb-6 border-2 border-transparent group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success" className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block glow-green">සාර්ථක වූ සිසුන්</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white">Receipts.</h2>
            </div>
            <p className="text-muted-foreground max-w-md">Real screenshots. Real bank accounts. Ordinary Sri Lankans pulling extraordinary global income.</p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: "Kasun Perera", earn: "$1,240 / mo", quote: "I never thought my daily vlogs could pay my bills. Soori sir changed my life.", img: "/images/success-1.png" },
              { name: "Nishanthi Silva", earn: "$850 / mo", quote: "From a simple housewife to a digital earner. The CM tool lessons were so clear.", img: "/images/success-2.png" },
              { name: "Dasun Fernando", earn: "$2,100 / mo", quote: "Hit my first $2k month just 3 months after joining. The strategies actually work.", img: "/images/success-3.png" },
              { name: "Chaminda Kumara", earn: "$1,500 / mo", quote: "Age is just a number. If I can learn this at 50, anyone can. Thank you Soori Academy.", img: "/images/success-4.png" }
            ].map((story, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
              >
                <Card className="glass-card overflow-hidden h-full flex flex-col group border-white/10 hover:border-accent/50 transition-all duration-500">
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full text-xs font-bold text-accent shadow-[0_0_10px_rgba(0,255,135,0.3)] flex items-center gap-1.5 border border-accent/30">
                      <Star className="w-3.5 h-3.5 fill-current" /> VERIFIED
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h4 className="font-display font-bold text-xl text-white">{story.name}</h4>
                      <p className="text-accent font-display font-bold text-2xl glow-green">{story.earn}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 bg-white/5">
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">"{story.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">මීලඟ පන්තිය</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Upcoming Drops</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group border-primary/50 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-6 right-6 bg-accent text-background text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,135,0.5)]">
                STARTING SOON
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2 mt-4">Batch 14 Live</h3>
              <p className="text-primary mb-8 font-medium">Interactive Zoom Sessions</p>
              
              <ul className="space-y-4 mb-10 text-muted-foreground">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-accent" /> Starts: 15th October 2023</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-accent" /> Duration: 4 Weeks (Weekends)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-accent" /> Lifetime access to recordings</li>
              </ul>
              <Button onClick={scrollToJoin} className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold rounded-2xl glow-border">
                Secure Your Spot
              </Button>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] border-white/10 opacity-80 hover:opacity-100 transition-opacity">
              <h3 className="text-3xl font-display font-bold text-white mb-2 mt-4">Pre-recorded</h3>
              <p className="text-muted-foreground mb-8 font-medium">Learn at your own pace</p>
              
              <ul className="space-y-4 mb-10 text-muted-foreground">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white/50" /> Available Instantly</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white/50" /> Over 40+ HD Video Lessons</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white/50" /> Private Discord Community</li>
              </ul>
              <Button onClick={scrollToJoin} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-14 text-lg font-bold rounded-2xl bg-transparent">
                Unlock Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Join Now Form */}
      <section id="join-now" className="py-32 relative z-10 bg-black/50 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto glass-card rounded-[3rem] p-10 md:p-14 border border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-10" />
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-display font-bold text-white mb-4">Initialize<span className="text-primary">.</span></h2>
              <p className="text-muted-foreground font-medium">Drop your details below. Our team will contact you to complete the setup.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-bold uppercase tracking-wider text-xs">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary focus-visible:border-primary transition-all px-6" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-bold uppercase tracking-wider text-xs">WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="07x xxx xxxx" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary focus-visible:border-primary transition-all px-6" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-bold uppercase tracking-wider text-xs">Select Path</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:ring-primary px-6" data-testid="select-batch">
                            <SelectValue placeholder="Choose your preferred drop" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#111116] border-white/10 text-white">
                          <SelectItem value="batch-14" className="focus:bg-primary/20 focus:text-white">Batch 14 (Online Live)</SelectItem>
                          <SelectItem value="pre-recorded" className="focus:bg-primary/20 focus:text-white">Pre-recorded Portal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-16 mt-8 text-lg font-bold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-400 text-white rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all hover:scale-[1.02]" data-testid="btn-submit-form">
                  Submit Request
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-white">SOORI</span>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Academy</span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white hover:border-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white hover:border-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all">
                <SiYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white hover:border-accent hover:shadow-[0_0_15px_rgba(0,255,135,0.5)] transition-all">
                <SiWhatsapp className="w-5 h-5" />
              </a>
            </div>

            <p className="text-muted-foreground text-sm font-medium">
              © {new Date().getFullYear()} With Soori. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
