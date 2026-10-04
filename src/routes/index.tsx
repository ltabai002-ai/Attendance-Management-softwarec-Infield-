import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import {
  ArrowRight, Banknote, BriefcaseBusiness, Building2, Calculator, Check, ChevronDown, Clock3,
  Construction, HeartPulse, MapPin, MapPinOff, Menu, MessageCircle, MessageSquare, Navigation, Phone,
  Route as RouteIcon, ShieldCheck, UsersRound, Wrench, X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChaosToCalm, CheckBenefit, DashboardVisual, Logo, PhoneFrame, SolutionVisual } from "@/components/infield-visuals";
import { Onboarding } from "@/components/Onboarding";

const title = "INFIELD — Workforce Management App | Live Availability, Attendance & Payroll";
const description = "See who's available, who's outside the work area and who's where — live. Track attendance, field visits and salary for construction, service centers, hospitals and field sales teams in one app. Book a demo.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: InfieldPage,
});

const scenes = [
  { id:"availability", number:"03 / 10", eyebrow:"Know who is available", title:"See Who's Available & Nearby —", accent:"Connect Instantly.", sub:"Find the right person, see their distance, and connect without calling the whole team.", screen:"team", benefits:["Live status of every employee","Distance from you or the job location","Connect in one tap"] },
  { id:"radius", number:"04 / 10", eyebrow:"Work radius alert", title:"Left the Work Area for 30+ Minutes?", accent:"You'll Both Know Instantly.", danger:true, sub:"Set a work zone once. INFIELD keeps managers and employees informed automatically.", screen:"radius", benefits:["Set your own work radius for every site","Alert after 30 minutes outside","Manager and employee both notified"] },
  { id:"resume", number:"05 / 10", eyebrow:"Auto resume", title:"Break Time? No Problem.", accent:"Tracking Resumes Automatically.", sub:"When an employee returns, work tracking restarts without another check-in.", screen:"resume", benefits:["No manual check-in after breaks","Work time pauses outside and resumes inside","Dashboard updates automatically"] },
  { id:"sales", number:"06 / 10", eyebrow:"Field sales tracking", title:"Every Visit. Every Client.", accent:"Every Kilometre Tracked.", sub:"Turn field movement into a clear, verified daily sales picture.", screen:"sales", benefits:["Know where your salesperson went","Visits and clients met, verified","Daily sales progress at a glance"] },
  { id:"attendance", number:"07 / 10", eyebrow:"Site & technician attendance", title:"Who Came, When, and For How Long —", accent:"Counted Automatically.", sub:"See entry, exit and hours worked without manual registers.", screen:"attendance", benefits:["Automatic entry and exit time","Hours worked per person","Present, absent and on-leave in one view"] },
  { id:"payroll", number:"08 / 10", eyebrow:"Salary & payroll", title:"Attendance Turns Into Salary —", accent:"Daily, Weekly or Monthly.", sub:"Convert verified work hours into clear salary calculations.", screen:"payroll", benefits:["Salary calculated from real attendance","Daily, weekly or monthly payouts","No manual registers or calculation errors"] },
];

const industryData = {
  "Construction Site": { metric:"Workers Present", value:"32 / 40", detail:"Site A – Whitefield", copy:"See who came to site, when, and for how long.", icon:Construction },
  "Service Center": { metric:"Technicians", value:"6 Available · 4 Busy", detail:"Live service floor", copy:"Know which technician is free for the next job.", icon:Wrench },
  Hospital: { metric:"Staff on duty", value:"48", detail:"Ward 3: 6 available", copy:"Find available staff instantly.", icon:HeartPulse },
  "Field Sales": { metric:"Visits today", value:"8", detail:"Clients met: 6", copy:"Track every visit and client meeting.", icon:BriefcaseBusiness },
} as const;

function InfieldPage() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("reset") || urlParams.has("questionnaire")) {
        sessionStorage.removeItem("onboarding_complete_session");
        localStorage.removeItem("onboarding_complete_v3");
        return true;
      }
      return !sessionStorage.getItem("onboarding_complete_session");
    }
    return false;
  });

  const { scrollYProgress } = useScroll();
  const [scrolled,setScrolled] = useState(false);
  const [menu,setMenu] = useState(false);
  const [contactVisible,setContactVisible] = useState(false);
  useMotionValueEvent(useScroll().scrollY,"change",v=>setScrolled(v>24));
  useEffect(()=>{ document.body.style.overflow=menu||showOnboarding?"hidden":""; return()=>{document.body.style.overflow=""}},[menu,showOnboarding]);
  useEffect(()=>{ const el=document.querySelector("#contact"); if(!el)return; const observer=new IntersectionObserver(([entry])=>setContactVisible(entry.isIntersecting),{threshold:.1}); observer.observe(el); return()=>observer.disconnect(); },[]);
  
  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return <main>
    <motion.div className="progress-line" style={{scaleX:scrollYProgress}} />
    <Navbar scrolled={scrolled} open={menu} setOpen={setMenu}/>
    <Hero/>
    <TrustStrip/>
    <ProblemSection/>
    <TransitionQuestion/>
    <Solution/>
    <Industries/>
    <Story/>
    <Everything/>
    <Steps/>
    <Why/>
    <Faq/>
    <Contact/>
    <Footer/>
    <a aria-label="Chat on WhatsApp" title="Chat on WhatsApp" className={`fixed right-4 z-40 grid size-13 place-items-center rounded-full bg-whatsapp text-on-dark shadow-scene transition-[bottom] md:bottom-5 md:size-14 ${contactVisible?"bottom-5":"bottom-20"}`} href="https://wa.me/919164060961?text=Hi%20INFIELD%20Team%2C%20I%27m%20interested%20in%20your%20workforce%20management%20app."><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></a>
    {!contactVisible&&<div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 bg-card p-2 shadow-[0_-8px_25px_color-mix(in_oklab,var(--navy)_12%,transparent)] md:hidden" style={{paddingBottom:"max(.5rem,env(safe-area-inset-bottom))"}}><Button asChild variant="outline" size="lg"><a href="tel:+919164060961"><Phone/>Call</a></Button><Button asChild variant="hero" size="lg"><a href="#contact">Book a Demo</a></Button></div>}
  </main>;
}

function Navbar({scrolled,open,setOpen}:{scrolled:boolean;open:boolean;setOpen:(v:boolean)=>void}) {
  const links=[["Problem","#problem"],["Features","#features"],["Payroll","#payroll"],["FAQ","#faq"],["Contact","#contact"]];
  return <header className={`fixed inset-x-0 top-[3px] z-50 transition-all ${scrolled?"bg-card/95 text-navy shadow-card backdrop-blur":"text-on-dark"}`}><nav className="content-wrap grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><a href="#problem" className={`w-fit rounded-xl p-2 ${scrolled?"":"bg-card text-navy"}`}><img src="/logo.png" alt="INFIELD" className="h-8 w-auto object-contain" /></a><div className="hidden items-center gap-5 lg:flex">{links.map(([l,h])=><a className="text-sm font-semibold hover:text-primary" href={h} key={l}>{l}</a>)}<a className="flex items-center gap-2 text-sm font-semibold" href="tel:+919164060961"><Phone className="size-4"/>+91 9164060961</a><Button asChild variant="hero" size="lg"><a href="#contact">Book a Demo</a></Button></div><Button aria-label="Open menu" onClick={()=>setOpen(true)} variant="ghost" size="icon" className={`lg:hidden ${scrolled?"text-navy":"text-on-dark hover:bg-on-dark/10"}`}><Menu/></Button></nav>{open&&<div className="scene-gradient fixed inset-0 z-50 flex flex-col p-5 text-on-dark lg:hidden"><div className="flex items-center justify-between"><span className="rounded-xl bg-card p-2 text-navy"><img src="/logo.png" alt="INFIELD" className="h-8 w-auto object-contain" /></span><Button aria-label="Close menu" onClick={()=>setOpen(false)} variant="heroOutline" size="icon"><X/></Button></div><div className="mt-16 grid gap-3">{links.map(([l,h])=><a onClick={()=>setOpen(false)} className="border-b border-on-dark/20 py-4 font-display text-3xl font-bold" href={h} key={l}>{l}</a>)}</div><Button asChild variant="hero" size="lg" className="mt-auto w-full"><a onClick={()=>setOpen(false)} href="#contact">Book a Demo <ArrowRight/></a></Button></div>}</header>;
}

function Hero(){return <section id="problem" className="scene-gradient relative min-h-[860px] overflow-hidden pb-24 pt-28 text-on-dark sm:min-h-[820px] lg:pt-36"><div className="absolute inset-0 z-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen pointer-events-none" /><div className="absolute inset-0 z-0 dot-grid pointer-events-none" /><div className="content-wrap relative z-10 grid items-center gap-8 lg:grid-cols-2"><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="relative z-10"><span className="inline-flex rounded-full border border-on-dark/20 bg-on-dark/10 px-3 py-2 text-xs font-bold uppercase">Workforce Management App</span><h1 className="mt-5 max-w-[640px] font-display text-[clamp(30px,4.2vw,52px)] font-extrabold leading-[1.15]">Who's Available? Who's Outside? Who's Where?<br/><span className="text-sky">See It All in One App.</span></h1><p className="mt-6 max-w-2xl text-base leading-7 text-on-dark/80 sm:text-lg">Live location, attendance, and field visits — tracked on one dashboard. Designed specifically for construction, service centers, hospitals, and sales teams.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero" size="lg"><a href="#contact">Book a Demo Today <ArrowRight/></a></Button><Button asChild variant="heroOutline" size="lg"><a href="#features">See How It Works</a></Button></div><p className="mt-4 text-sm text-on-dark/70">Works on Android & iPhone · Setup support included</p></motion.div><ChaosToCalm/></div></section>}

function TrustStrip(){const items=[[Navigation,"Live Availability"],[MapPin,"Work Radius Alerts"],[Clock3,"Attendance & Hours"],[Banknote,"Auto Payroll"]] as const;return <div className="content-wrap relative z-10 -mt-[40px] scene-card"><div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">{items.map(([Icon,label])=><div key={label} className="flex items-center gap-3 p-4 sm:p-6"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft-tint text-primary"><Icon className="size-5"/></span><b className="text-sm text-navy sm:text-base">{label}</b></div>)}</div></div>}

function ProblemSection() {
  const problems = [
    { icon: MapPinOff, title: "Where is my team?", desc: "No live visibility of field staff. Constant calling to check locations." },
    { icon: MessageSquare, title: "Who came to work?", desc: "Chaotic WhatsApp groups and manual attendance tracking." },
    { icon: Calculator, title: "How much to pay?", desc: "Errors and wasted hours calculating manual salary and overtime." }
  ];
  return <section id="problem-cards" className="section-pad bg-background"><div className="content-wrap"><div className="text-center"><span className="eyebrow">The Problem</span><h2 className="mt-5 font-display text-[clamp(26px,3vw,40px)] font-bold text-navy max-w-[720px] mx-auto">Managing a Moving Team is Chaos</h2></div><div className="mt-12 grid gap-6 md:grid-cols-3">{problems.map(p=><div key={p.title} className="scene-card p-6 sm:p-8"><span className="grid size-12 place-items-center rounded-full bg-alert-soft text-alert"><p.icon className="size-6"/></span><h3 className="mt-6 text-xl font-bold text-navy">{p.title}</h3><p className="mt-3 text-lg text-muted-foreground">{p.desc}</p></div>)}</div></div></section>;
}

function TransitionQuestion() {
  return <section className="section-pad relative overflow-hidden bg-primary text-primary-foreground"><div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity pointer-events-none" /><div className="absolute inset-0 z-0 bg-primary/50 pointer-events-none" /><div className="content-wrap relative z-10 text-center max-w-4xl mx-auto"><h2 className="font-display text-[clamp(28px,4vw,48px)] font-bold leading-tight drop-shadow-md">Have you ever thought that all these problems could be solved in just one app?</h2></div></section>;
}

function Industries(){const [active,setActive]=useState<keyof typeof industryData>("Construction Site");const d=industryData[active];const Icon=d.icon;return <section className="section-pad bg-background"><div className="content-wrap"><div className="mx-auto max-w-760 text-center"><span className="eyebrow">Built for moving teams</span><h2 className="mt-5 font-display text-[clamp(26px,3vw,40px)] font-bold text-navy max-w-[720px] mx-auto">One App for Every Team That <span className="text-primary">Works On the Move</span></h2></div><div className="mt-10 flex gap-2 overflow-x-auto pb-2">{Object.keys(industryData).map(k=><Button key={k} onClick={()=>setActive(k as keyof typeof industryData)} variant={active===k?"hero":"lightOutline"} size="lg" className="shrink-0">{k}</Button>)}</div><motion.div key={active} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mx-auto mt-8 grid max-w-4xl items-center gap-8 scene-card p-5 sm:p-8 md:grid-cols-2"><div><span className="grid size-14 place-items-center rounded-xl bg-soft-tint text-primary"><Icon/></span><p className="mt-5 text-sm font-bold uppercase text-primary">{d.metric}</p><h3 className="mt-2 text-3xl font-bold text-navy">{d.value}</h3><p className="mt-2 font-semibold text-navy">{d.detail}</p><p className="mt-5 text-lg">{d.copy}</p>{(active==="Construction Site"||active==="Service Center")&&<div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card p-2 pr-4 w-fit"><img src={active==="Construction Site"?"/construction.png":"/support.png"} alt="Industry professional" className="size-12 rounded-full object-cover shadow-sm"/><span className="text-xs font-semibold text-navy max-w-[150px] leading-tight">Built specifically for your team's workflow.</span></div>}</div><div className="mx-auto relative"><PhoneFrame scene={active==="Service Center"?"serviceCenter":active==="Field Sales"?"fieldSales":active==="Hospital"?"hospital":"construction"}/></div></motion.div></div></section>}

function Chapter({n,eyebrow,title,accent,dark=false}:{n:string;eyebrow:string;title:string;accent:string;dark?:boolean}){const [n1, n2] = n.split(" / "); return <div><div className="chapter-number"><span className="chapter-number-first">{n1}</span> <span className="text-muted-foreground">/ {n2}</span></div><span className="eyebrow mt-4">{eyebrow}</span><h2 className={`mt-5 font-display text-[clamp(24px,2.4vw,34px)] font-bold leading-tight ${dark?"text-on-dark":"text-navy"}`}>{title}<br/><span className={dark?"text-sky":"text-primary"}>{accent}</span></h2></div>}

function Solution(){return <section className="section-pad bg-light-blue"><div className="content-wrap grid items-center gap-12 lg:grid-cols-2"><div><Chapter n="02 / 10" eyebrow="The solution" title="One App." accent="Complete Workforce Visibility."/><p className="mt-5 text-lg">Built to make team management simple — for every size of business.</p></div><SolutionVisual/></div></section>}

function Story(){const [active,setActive]=useState(0);return <section id="features" className="section-pad bg-background"><div className="content-wrap"><div className="mx-auto max-w-3xl text-center"><span className="eyebrow">The product story</span><h2 className="mt-5 text-[clamp(26px,3vw,40px)] font-bold text-navy max-w-[720px] mx-auto">See How INFIELD Works — <span className="text-primary">Scene by Scene</span></h2></div><div className="mt-16 hidden lg:grid lg:grid-cols-2 gap-16"><div className="sticky top-[15vh] flex h-[calc(100vh-15vh)] items-center justify-center"><PhoneFrame scene={scenes[active].screen}/><div className="ml-5 grid gap-3">{scenes.map((s,i)=><button type="button" aria-label={`View ${s.eyebrow}`} onClick={()=>setActive(i)} key={s.id} className={`size-3 rounded-full transition ${active===i?"bg-primary scale-125":"bg-soft-tint"}`}/>)}</div></div><div>{scenes.map((s,i)=><StoryChapter scene={s} key={s.id} onEnter={()=>setActive(i)}/>)}</div></div><div className="mt-12 grid gap-20 lg:hidden">{scenes.map(s=><StoryChapter scene={s} mobile key={s.id}/>)}</div></div></section>}

function StoryChapter({scene,onEnter,mobile=false}:{scene:typeof scenes[number];onEnter?:()=>void;mobile?:boolean}) {const [n1, n2] = scene.number.split(" / "); return <motion.article id={scene.id} onViewportEnter={onEnter} viewport={{amount:.55}} className={`${mobile?"":"flex min-h-[80vh] items-center"}`}><div className="w-full"><div className="chapter-number"><span className="chapter-number-first">{n1}</span> <span className="text-muted-foreground">/ {n2}</span></div><span className="eyebrow mt-4">{scene.eyebrow}</span><h3 className="mt-5 text-[clamp(24px,2.4vw,34px)] font-bold leading-tight text-navy">{scene.title}<br/><span className={scene.danger?"text-alert":"text-primary"}>{scene.accent}</span></h3><p className="mt-4 max-w-xl text-lg">{scene.sub}</p>{mobile&&<div className="my-8 flex justify-center"><PhoneFrame scene={scene.screen}/></div>}<ul className="mt-6 grid gap-3">{scene.benefits.map(b=><CheckBenefit key={b}>{b}</CheckBenefit>)}</ul><a href="#contact" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-primary">Book a Demo <ArrowRight className="size-4"/></a></div></motion.article>}

function Everything(){return <><section className="section-pad bg-light-blue"><div className="content-wrap grid items-center gap-12 lg:grid-cols-2"><div><Chapter n="09 / 10" eyebrow="Everything in one place" title="Everything Your Team Needs." accent="One Dashboard."/><p className="mt-5 text-lg">Six live views come together into one clear operating picture.</p></div><DashboardVisual/></div></section><div className="bg-primary py-5 text-primary-foreground"><div className="content-wrap grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><b className="min-w-0 font-display text-lg sm:text-2xl">See INFIELD running for your team.</b><Button asChild variant="secondary" size="lg"><a href="#contact">Book a Demo Today</a></Button></div></div></>}

function Why(){const items=[[Navigation,"Live Availability"],[MapPin,"Work Radius Alerts"],[Clock3,"Auto Attendance"],[RouteIcon,"Field Visit Proof"],[Banknote,"Auto Payroll"],[Wrench,"Setup Support"]] as const;return <section className="section-pad"><div className="content-wrap"><div className="text-center"><span className="eyebrow">Why INFIELD</span><h2 className="mt-5 text-[clamp(26px,3vw,40px)] font-bold text-navy max-w-[720px] mx-auto">Why Businesses Choose INFIELD</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{items.map(([Icon,l])=><div key={l} className="flex items-center gap-4 lg:flex-col lg:text-center"><span className="grid size-14 shrink-0 place-items-center rounded-full bg-soft-tint text-primary"><Icon/></span><b className="text-sm text-navy">{l}</b></div>)}</div><div className="mx-auto mt-12 flex max-w-3xl items-start gap-4 scene-card p-6"><ShieldCheck className="size-8 shrink-0 text-primary"/><p className="font-semibold text-navy">Tracking only during working hours · Employee consent · Your data stays private</p></div></div></section>}

function Steps(){const steps=["Book a Demo","Add Your Team","Set Your Work Radius","See Your Team Live","Payroll Calculated Automatically"];return <section id="how-it-works" className="section-pad bg-light-blue"><div className="content-wrap"><div className="text-center"><span className="eyebrow">How to get started</span><h2 className="mt-5 text-[clamp(26px,3vw,40px)] font-bold text-navy max-w-[720px] mx-auto">Get Started in 5 Simple Steps</h2></div><div className="relative mt-12 grid gap-4 md:grid-cols-5">{steps.map((s,i)=><div key={s} className="relative flex items-center gap-4 md:flex-col md:text-center"><span className="z-10 grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">{i+1}</span><b className="text-navy">{s}</b>{i<4&&<span className="absolute left-6 top-12 h-[calc(100%+1rem)] border-l-2 border-dashed border-primary/25 md:left-[calc(50%+1.5rem)] md:top-6 md:h-0 md:w-[calc(100%-1rem)] md:border-l-0 md:border-t-2"/>}</div>)}</div></div></section>}

function Faq(){const qs=["Do employees need a smartphone?","Is tracking only during working hours?","What happens during breaks?","Can I set a different radius for each site?","Does it drain battery or data?","How is salary calculated?","How much does it cost?"];return <section id="faq" className="section-pad"><div className="content-wrap flex flex-col items-center text-center gap-10"><div className="w-full max-w-[720px]"><span className="eyebrow">FAQ</span><h2 className="mt-5 text-[clamp(26px,3vw,40px)] font-bold text-navy">Questions Business Owners Ask</h2></div><Accordion type="single" defaultValue="q0" collapsible className="scene-card w-full max-w-[800px] px-5">{qs.map((q,i)=><AccordionItem key={q} value={`q${i}`}><AccordionTrigger className="py-5 text-left text-base font-bold text-navy hover:no-underline">{q}</AccordionTrigger><AccordionContent className="text-base text-left text-muted-foreground">Yes, you can track this easily in the INFIELD app.</AccordionContent></AccordionItem>)}</Accordion></div></section>}

const rolesOptions = [
  "Owner / Founder",
  "HR / Admin Manager",
  "Operations Manager",
  "Sales Manager",
  "Project / Site Manager",
  "Other"
];

const challengesOptions = [
  { id: "tracking", label: "Difficulty tracking team attendance and locations" },
  { id: "payroll", label: "Manual payroll calculation and timesheet errors" },
  { id: "leaving", label: "Employees leaving the work area without notice" },
  { id: "sales", label: "Lack of visibility into field sales or site visits" },
  { id: "scheduling", label: "Chaotic team communication and scheduling" }
];

const featuresOptions = [
  { id: "availability", label: "Live Staff Availability & Locations" },
  { id: "attendance", label: "Auto Attendance & Timesheets" },
  { id: "radius", label: "Work Area Radius Alerts" },
  { id: "payroll", label: "Auto Payroll & Salary Calculation" },
  { id: "visits", label: "Field Sales & Visit Tracking" },
  { id: "roster", label: "Shift Scheduling & Roster Management" }
];

type FormData = {
  role: string;
  challenge: string;
  feature: string;
  name: string;
  company: string;
  phone: string;
  city: string;
  team_size: string;
};

const emptyForm: FormData = {
  role: "",
  challenge: "",
  feature: "",
  name: "",
  company: "",
  phone: "",
  city: "",
  team_size: ""
};

function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const setField = (k: keyof FormData, v: any) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const whatsapp = useMemo(() => {
    const msg = `Hi INFIELD Team, I want a demo of the workforce management app.\n\nRole: ${form.role}\nChallenge: ${form.challenge}\nFeature Needed: ${form.feature}\nName: ${form.name}\nBusiness: ${form.company}\nPhone: ${form.phone}\nCity: ${form.city}\nTeam Size: ${form.team_size}`;
    return `https://wa.me/919164060961?text=${encodeURIComponent(msg)}`;
  }, [form]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof FormData, string>> = {};
    if (!form.role) next.role = "Select your role";
    if (!form.challenge) next.challenge = "Select your main challenge";
    if (!form.feature) next.feature = "Select feature needed";
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (form.company.trim().length < 2) next.company = "Enter your business name";
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Enter a valid 10-digit mobile number";
    if (form.city.trim().length < 2) next.city = "Enter your city";
    if (!form.team_size) next.team_size = "Select your team size";

    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("loading");

    const payload = {
      role: form.role,
      challenges: form.challenge,
      features: form.feature,
      name: form.name,
      phone: form.phone,
      business: form.company,
      city: form.city,
      teamSize: form.team_size,
      timestamp: new Date().toISOString()
    };

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxulGiwHQXHipMx74m1Xv65zZgSIpY7Ni2h0U1iYy2HSA7nx7HKrdL66_dzVz1Ttdg/exec";

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed sending to Google Sheets", err);
    }

    try {
      await supabase.from("demo_requests").insert({
        name: form.name,
        company: form.company,
        phone: form.phone,
        city: form.city,
        team_size: form.team_size,
        industry: form.role,
        message: `Challenge: ${payload.challenges} | Feature: ${payload.features}`
      });
    } catch (err) {}

    setStatus("success");
  };

  return (
    <section id="contact" className="scene-gradient relative overflow-hidden section-pad text-on-dark">
      <div className="absolute inset-0 z-0 bg-[url('/support.png')] bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none mix-blend-luminosity" />
      <div className="absolute inset-0 z-0 bg-deep-navy/40 pointer-events-none" />
      <div className="absolute inset-0 z-0 dot-grid opacity-50 pointer-events-none" />
      <div className="content-wrap relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Chapter n="10 / 10" eyebrow="Book your demo" title="Don't Just Manage Your Team." accent="Manage Your Workforce. Smarter." dark/>
          <p className="mt-5 text-lg text-on-dark/80">One app. One dashboard. Complete workforce control.</p>
          <ul className="mt-7 grid gap-3">
            {["Free demo", "No obligation", "Setup support included"].map(x => (
              <li className="flex items-center gap-3" key={x}>
                <span className="grid size-6 place-items-center rounded-full bg-sky text-deep-navy"><Check className="size-4"/></span>
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-10 max-w-lg">
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-on-dark/20 bg-on-dark/10 p-4">
              <img src="/support.png" alt="Customer Support" className="size-14 rounded-full object-cover shadow-sm"/>
              <div className="min-w-0">
                <b className="block text-sm text-on-dark">Talk to a real human</b>
                <span className="text-sm text-on-dark/80">Our experts will configure the app for your needs.</span>
              </div>
            </div>
            <DashboardVisual/>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="rounded-2xl bg-card p-5 text-foreground shadow-scene sm:p-8 relative z-10">
          <h3 className="text-2xl font-bold text-navy">Book a Demo Today</h3>
          {status === "success" ? (
            <div className="mt-8 rounded-xl bg-available-soft p-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-available text-primary-foreground"><Check/></span>
              <h4 className="mt-4 text-xl font-bold text-navy">Thank You! Your Request Has Been Saved.</h4>
              <p className="mt-2 text-muted-foreground">Our team will reach out to you shortly.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              <Field label="What is your role?*" error={errors.role}>
                <select
                  className={`field ${errors.role ? "field-error" : ""}`}
                  value={form.role}
                  onChange={e => setField("role", e.target.value)}
                >
                  <option value="">Select your role...</option>
                  {rolesOptions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>

              <Field label="What are the challenges you are facing?*" error={errors.challenge}>
                <select
                  className={`field ${errors.challenge ? "field-error" : ""}`}
                  value={form.challenge}
                  onChange={e => setField("challenge", e.target.value)}
                >
                  <option value="">Select your main challenge...</option>
                  {challengesOptions.map(c => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="What features do you need?*" error={errors.feature}>
                <select
                  className={`field ${errors.feature ? "field-error" : ""}`}
                  value={form.feature}
                  onChange={e => setField("feature", e.target.value)}
                >
                  <option value="">Select feature needed...</option>
                  {featuresOptions.map(f => (
                    <option key={f.id} value={f.label}>{f.label}</option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name*" error={errors.name}>
                  <input
                    className={`field ${errors.name ? "field-error" : ""}`}
                    value={form.name}
                    onChange={e => setField("name", e.target.value)}
                    placeholder="Your full name"
                  />
                </Field>

                <Field label="Phone Number*" error={errors.phone}>
                  <div className="grid grid-cols-[auto_1fr]">
                    <span className="grid min-h-12 place-items-center rounded-l-xl border border-r-0 border-input bg-muted px-3 text-sm">+91</span>
                    <input
                      inputMode="numeric"
                      maxLength={10}
                      className={`field rounded-l-none ${errors.phone ? "field-error" : ""}`}
                      value={form.phone}
                      onChange={e => setField("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit number"
                    />
                  </div>
                </Field>

                <Field label="City / Location*" error={errors.city}>
                  <input
                    className={`field ${errors.city ? "field-error" : ""}`}
                    value={form.city}
                    onChange={e => setField("city", e.target.value)}
                    placeholder="e.g. Bangalore"
                  />
                </Field>

                <Field label="Business Name*" error={errors.company}>
                  <input
                    className={`field ${errors.company ? "field-error" : ""}`}
                    value={form.company}
                    onChange={e => setField("company", e.target.value)}
                    placeholder="Name of your organization"
                  />
                </Field>
              </div>

              <Field label="Team Size*" error={errors.team_size}>
                <select
                  className={`field ${errors.team_size ? "field-error" : ""}`}
                  value={form.team_size}
                  onChange={e => setField("team_size", e.target.value)}
                >
                  <option value="">Select team size...</option>
                  {["1–20", "21–50", "51–200", "200+"].map(x => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </Field>

              {status === "error" && (
                <p className="text-sm font-semibold text-alert">
                  We couldn't save your request. Please try again.
                </p>
              )}

              <Button
                disabled={status === "loading"}
                variant="hero"
                size="lg"
                className="mt-2 w-full"
              >
                {status === "loading" ? (
                  <span className="size-5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                ) : (
                  <MessageCircle />
                )}
                {status === "loading" ? "Booking..." : "Book an Appointment"}
                <ArrowRight />
              </Button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
function Field({label,error,children}:{label:string;error?:string;children:React.ReactNode}){return <label className="grid gap-2 text-sm font-semibold text-navy"><span>{label}</span>{children}{error&&<span className="text-xs text-alert">{error}</span>}</label>}

function Footer(){return <footer className="scene-gradient pb-24 pt-14 text-on-dark md:pb-8"><div className="content-wrap grid gap-10 md:grid-cols-4"><div><span className="inline-flex rounded-xl bg-card p-2 text-navy"><img src="/logo.png" alt="INFIELD" className="h-8 w-auto object-contain" /></span><p className="mt-4 text-on-dark/75">Manage Your Workforce. Smarter.</p></div><FooterCol title="Features" links={[["Availability","#availability"],["Work Radius","#radius"],["Auto Resume","#resume"],["Field Sales","#sales"],["Attendance","#attendance"],["Payroll","#payroll"]]}/><FooterCol title="Industries" links={[["Construction","#contact"],["Service Center","#contact"],["Hospital","#contact"],["Field Sales","#contact"]]}/><div><h3 className="font-bold">Contact</h3><div className="mt-4 grid gap-3 text-sm text-on-dark/75"><a href="tel:+919164060961">+91 9164060961</a><a href="https://wa.me/919164060961">WhatsApp</a><span>Email: Confirm with INFIELD</span></div></div></div><div className="content-wrap mt-12 flex flex-col gap-3 border-t border-on-dark/20 pt-6 text-sm text-on-dark/70 sm:flex-row sm:justify-between"><span>© 2026 INFIELD. All rights reserved.</span><span>Privacy Policy · Terms & Conditions</span></div></footer>}
function FooterCol({title,links}:{title:string;links:string[][]}){return <div><h3 className="font-bold">{title}</h3><div className="mt-4 grid gap-3 text-sm text-on-dark/75">{links.map(([l,h])=><a href={h} key={l}>{l}</a>)}</div></div>}