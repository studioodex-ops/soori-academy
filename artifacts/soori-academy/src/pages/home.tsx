import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Facebook, Youtube, MessageCircle, PlayCircle, Trophy, Users, Globe, ArrowRight, CheckCircle2, Star } from "lucide-react";
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
      staggerChildren: 0.2
    }
  }
};

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
      title: "Registration Successful!",
      description: "We will contact you shortly with the class details.",
    });
    form.reset();
  }

  const scrollToJoin = () => {
    const el = document.getElementById("join-now");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-accent selection:text-accent-foreground">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
              S
            </div>
            <span className="font-display font-bold text-xl text-primary">With Soori</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#schedule" className="hover:text-primary transition-colors">Schedule</a>
            <a href="#success" className="hover:text-primary transition-colors">Success Stories</a>
          </div>
          <Button onClick={scrollToJoin} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20 rounded-full px-6" data-testid="btn-nav-join">
            Join Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary/5 to-transparent -z-10 pointer-events-none" />
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                <Trophy className="w-4 h-4" />
                <span>Sri Lanka's #1 Facebook Monetization Academy</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
                <span className="block text-primary text-3xl md:text-4xl lg:text-5xl mb-2">ඔබේ Content වලින්</span>
                Earn Money with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Facebook In-Stream Ads</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Learn from Soori, the pioneer who introduced Facebook Content Monetization to Sri Lanka. Transform your daily videos into a real income stream.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={scrollToJoin} className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-full w-full sm:w-auto shadow-xl shadow-accent/20" data-testid="btn-hero-join">
                  Start Earning Today <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto bg-white border-border hover:bg-secondary/50" data-testid="btn-hero-learn">
                  <PlayCircle className="mr-2 w-5 h-5 text-primary" /> Watch Video
                </Button>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-muted-foreground">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                      <img src={`/images/success-${i}.png`} alt="Student" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-bold">5,000+ Students</span>
                  <span>Already Earning</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white">
                <img 
                  src="/images/hero-educator.png" 
                  alt="Soori presenting" 
                  className="w-full h-auto aspect-[4/5] md:aspect-square lg:aspect-[4/5] object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm md:text-base">CM Tool Activated</p>
                    <p className="text-muted-foreground text-xs font-medium">Over $1M+ Generated</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">5K+</h3>
              <p className="text-primary-foreground/80 font-medium">Active Students</p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">$1M+</h3>
              <p className="text-primary-foreground/80 font-medium">Student Earnings</p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">1st</h3>
              <p className="text-primary-foreground/80 font-medium">In Sri Lanka</p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">100%</h3>
              <p className="text-primary-foreground/80 font-medium">Practical Guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              <span className="block text-primary text-2xl md:text-3xl mb-2">මොකක්ද මේ In-Stream Ads?</span>
              What exactly do we teach?
            </h2>
            <p className="text-lg text-muted-foreground">
              Facebook In-Stream Ads allow creators to earn money by including short video ads in their qualifying videos. We teach you the exact blueprint to activate this and scale your income.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <PlayCircle className="w-8 h-8 text-primary" />,
                title: "Content Creation",
                sinhala: "වීඩියෝ හදන රහස්",
                desc: "Learn how to create engaging videos that Facebook's algorithm loves and audiences want to watch."
              },
              {
                icon: <Facebook className="w-8 h-8 text-primary" />,
                title: "CM Tool Mastery",
                sinhala: "CM Tool එක පාවිච්චිය",
                desc: "Master the Content Monetization tool. Understand analytics, RPM, and how to maximize your ad revenue."
              },
              {
                icon: <Globe className="w-8 h-8 text-primary" />,
                title: "Global Reach",
                sinhala: "ලෝකෙටම යන්න",
                desc: "Don't limit yourself to Sri Lanka. Learn strategies to build an international audience that pays higher RPMs."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-primary text-sm font-bold mb-1">{feature.sinhala}</h4>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              <span className="block text-primary text-2xl md:text-3xl mb-2">පියවරෙන් පියවර</span>
              Your Path to Monetization
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 -translate-y-1/2 hidden md:block" />
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Join Class", desc: "Enroll in our next batch" },
                { step: "02", title: "Create", desc: "Upload daily content" },
                { step: "03", title: "Unlock CM", desc: "Hit Facebook's criteria" },
                { step: "04", title: "Earn", desc: "Get paid via In-Stream Ads" }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-background rounded-full border-4 border-primary flex items-center justify-center font-display font-bold text-xl text-primary mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              <span className="block text-primary text-2xl md:text-3xl mb-2">සාර්ථක වූ සිසුන්</span>
              Real Results. Real People.
            </h2>
            <p className="text-lg text-muted-foreground">See how ordinary Sri Lankans are earning extraordinary income.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kasun Perera", earn: "$1,240 / mo", quote: "I never thought my daily vlogs could pay my bills. Soori sir changed my life.", img: "/images/success-1.png" },
              { name: "Nishanthi Silva", earn: "$850 / mo", quote: "From a simple housewife to a digital earner. The CM tool lessons were so clear.", img: "/images/success-2.png" },
              { name: "Dasun Fernando", earn: "$2,100 / mo", quote: "Hit my first $2k month just 3 months after joining. The strategies actually work.", img: "/images/success-3.png" },
              { name: "Chaminda Kumara", earn: "$1,500 / mo", quote: "Age is just a number. If I can learn this at 50, anyone can. Thank you Soori Academy.", img: "/images/success-4.png" }
            ].map((story, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1 } }
                }}
              >
                <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-green-600 shadow-lg flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" /> Verified
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h4 className="font-bold text-lg mb-1">{story.name}</h4>
                    <p className="text-primary font-bold text-xl mb-4">{story.earn}</p>
                    <p className="text-muted-foreground text-sm italic relative pl-4 flex-1">
                      <span className="absolute left-0 top-0 text-2xl text-primary/20 font-serif">"</span>
                      {story.quote}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-educator.png')] opacity-5 bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                <span className="block text-accent text-2xl md:text-3xl mb-2">මීලඟ පන්තිය</span>
                Upcoming Classes
              </h2>
              <p className="text-primary-foreground/80 text-lg">Seats fill up fast. Reserve your spot in the next batch.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white text-foreground p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">
                  STARTING SOON
                </div>
                <h3 className="text-2xl font-bold mb-2">Batch 14 - Online Live</h3>
                <p className="text-muted-foreground mb-6">Learn directly via Zoom with live Q&A sessions.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Starts: 15th October 2023</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Duration: 4 Weeks (Weekends)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Lifetime access to recordings</li>
                </ul>
                <Button onClick={scrollToJoin} className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg rounded-xl">
                  Select Batch 14
                </Button>
              </div>

              <div className="bg-primary-foreground/10 border border-white/20 text-white p-8 rounded-3xl backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-2">Batch 15 - Pre-recorded</h3>
                <p className="text-white/70 mb-6">Learn at your own pace with our structured portal.</p>
                <ul className="space-y-3 mb-8 text-white/90">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-accent" /> Available Instantly</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-accent" /> Over 40+ Video Lessons</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-accent" /> Private Community Access</li>
                </ul>
                <Button onClick={scrollToJoin} variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 h-12 text-lg rounded-xl">
                  Select Pre-recorded
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Now Form */}
      <section id="join-now" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-card border border-border shadow-2xl rounded-[2.5rem] p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Join the Academy</h2>
              <p className="text-muted-foreground">Fill out the form below and our team will contact you to complete enrollment.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" className="h-12 rounded-xl bg-background" {...field} data-testid="input-name" />
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
                      <FormLabel className="text-foreground">WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="07x xxx xxxx" className="h-12 rounded-xl bg-background" {...field} data-testid="input-phone" />
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
                      <FormLabel className="text-foreground">Select Batch</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-background" data-testid="select-batch">
                            <SelectValue placeholder="Choose your preferred batch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="batch-14">Batch 14 (Online Live)</SelectItem>
                          <SelectItem value="pre-recorded">Pre-recorded Portal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-xl shadow-accent/20 mt-4" data-testid="btn-submit-form">
                  Complete Registration
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                  S
                </div>
                <span className="font-display font-bold text-2xl">With Soori</span>
              </div>
              <p className="text-white/60 mb-6 max-w-sm">
                Sri Lanka's pioneering academy for Facebook Content Monetization and In-Stream Ads. Empowering digital creators.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <SiFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                  <SiYoutube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                  <SiWhatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#about" className="hover:text-white transition-colors">About Academy</a></li>
                <li><a href="#success" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#schedule" className="hover:text-white transition-colors">Class Schedule</a></li>
                <li><a href="#join-now" className="hover:text-white transition-colors">Enroll Now</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-white/60">
                <li className="flex items-start gap-3">
                  <SiWhatsapp className="w-5 h-5 text-green-500 mt-1" />
                  <span>+94 77 123 4567<br/><span className="text-sm opacity-70">Message us on WhatsApp</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-1" />
                  <span>hello@withsoori.com<br/><span className="text-sm opacity-70">For business inquiries</span></span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm">
            <p>&copy; {new Date().getFullYear()} With Soori Academy. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed & Built for Sri Lankan Creators</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
