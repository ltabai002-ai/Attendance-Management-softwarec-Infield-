import {
  Banknote,
  Building2,
  Check,
  Clock3,
  Construction,
  MapPin,
  MessageCircle,
  Navigation,
  PhoneCall,
  Route,
  UserRound,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const people = [
  { name: "Arjun S.", status: "Available", distance: "0.8 km", color: "bg-available" },
  { name: "Meera K.", status: "Busy", distance: "1.5 km", color: "bg-busy" },
  { name: "Sanjay R.", status: "Offline", distance: "2.2 km", color: "bg-offline" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="INFIELD">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><MapPin className="size-5" /></span>
      {!compact && <strong className="font-display text-xl font-extrabold tracking-normal">INFIELD</strong>}
    </span>
  );
}

export function PhoneFrame({ scene = "team", label }: { scene?: string; label?: string }) {
  return (
    <div className="phone-shell" aria-label={label ?? "INFIELD app screen"}>
      <div className="phone-speaker" />
      <div className="phone-screen">
        <div className="flex items-center justify-between text-[10px] font-bold text-navy"><Logo compact /><span>9:41</span></div>
        {scene === "team" && <TeamScreen />}
        {scene === "radius" && <RadiusScreen />}
        {scene === "resume" && <ResumeScreen />}
        {scene === "sales" && <SalesScreen />}
        {scene === "attendance" && <AttendanceScreen />}
        {scene === "payroll" && <PayrollScreen />}
        {scene === "dashboard" && <DashboardScreen />}
        {scene === "construction" && <ConstructionScreen />}
        {scene === "serviceCenter" && <ServiceCenterScreen />}
        {scene === "hospital" && <HospitalScreen />}
        {scene === "fieldSales" && <FieldSalesScreen />}
      </div>
    </div>
  );
}

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 font-display text-lg font-bold text-navy">{children}</h3>;
}

function TeamScreen() {
  return <><ScreenTitle>Team Now</ScreenTitle><div className="mt-3 grid grid-cols-3 gap-1">{[["18","Available","text-available"],["9","Busy","text-busy-dark"],["5","Offline","text-offline"]].map(([n,l,c])=><div key={l} className="rounded-lg bg-soft-tint p-2 text-center"><b className={`block text-xl ${c}`}>{n}</b><span className="text-xs text-muted-foreground">{l}</span></div>)}</div><div className="mt-3 space-y-2">{people.map((p)=><div key={p.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-border bg-card p-2"><span className="grid size-8 place-items-center rounded-full bg-soft-tint text-primary"><UserRound className="size-4"/></span><span className="min-w-0"><b className="block truncate text-xs text-navy">{p.name}</b><span className="text-xs text-muted-foreground">{p.distance}</span></span><span className="flex items-center gap-1 text-xs text-navy"><i className={`size-2 rounded-full ${p.color}`}/>{p.status}</span></div>)}</div><div className="mt-3"><div className="w-full text-center rounded-xl bg-primary text-primary-foreground text-xs font-bold py-3">Connect</div></div></>;
}

function MapCanvas({ outside = false }: { outside?: boolean }) {
  return <div className="map-canvas mt-3"><div className="map-road map-road-a"/><div className="map-road map-road-b"/><div className="radius-ring"/><div className="absolute left-[42%] top-[40%] grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow"><Building2 className="size-5"/></div><motion.div animate={{ x: outside ? 72 : 0, y: outside ? -44 : 0 }} transition={{ duration: 1.5 }} className="absolute left-[48%] top-[58%] grid size-7 place-items-center rounded-full bg-alert text-primary-foreground"><UserRound className="size-4"/></motion.div></div>;
}

function RadiusScreen() {
  return <><ScreenTitle>Work Radius</ScreenTitle><MapCanvas outside/><div className="mt-3 flex justify-center gap-1 text-xs"><span className="chip">05 min</span><span className="chip">15 min</span><span className="rounded-md bg-alert px-2 py-1 font-bold text-primary-foreground">30 min</span></div><div className="mt-3 rounded-xl border border-alert/30 bg-alert-soft p-3 text-xs text-navy"><b className="block text-alert">Employee Outside Work Radius</b>Pooja M. · More than 30 minutes</div></>;
}

function ResumeScreen() {
  return <><ScreenTitle>Work Tracking</ScreenTitle><MapCanvas/><div className="mt-3 rounded-xl bg-available-soft p-3 text-center text-xs font-bold text-available">✓ Back in Work Area</div><div className="mt-3 flex items-center justify-between rounded-xl border border-border p-3 text-xs"><span><b className="block text-navy">Pooja M.</b><span className="text-muted-foreground">Working · 2:14 PM</span></span><span className="rounded-full bg-available px-3 py-1 font-bold text-primary-foreground">ON</span></div></>;
}

function SalesScreen() {
  return <><ScreenTitle>Field Visits</ScreenTitle><div className="map-canvas mt-3"><svg viewBox="0 0 220 130" className="h-full w-full" aria-label="Salesperson route map"><path d="M18 105 C55 20, 95 120, 145 45 S190 35,205 18" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="7 6"/><circle cx="22" cy="104" r="8" fill="var(--available)"/><circle cx="110" cy="77" r="8" fill="var(--available)"/><circle cx="203" cy="20" r="8" fill="var(--available)"/></svg></div><div className="mt-3 grid grid-cols-2 gap-2">{[["8","Visits"],["6","Clients Met"],["24 km","Distance"],["72%","Progress"]].map(([n,l])=><div key={l} className="rounded-lg bg-soft-tint p-2"><b className="block text-base text-primary">{n}</b><span className="text-xs text-muted-foreground">{l}</span></div>)}</div></>;
}

function AttendanceScreen() {
  return <><ScreenTitle>Site Attendance</ScreenTitle><div className="mt-3 rounded-xl bg-soft-tint p-3"><div className="flex items-end justify-between"><Construction className="size-12 text-primary"/><div className="text-right"><b className="block text-2xl text-navy">32</b><span className="text-xs text-muted-foreground">Workers present</span></div></div></div><div className="mt-3 space-y-2">{[["Ramesh K.","9:00 AM","9 hrs"],["Suresh P.","9:10 AM","8h 55m"]].map(([n,t,h])=><div key={n} className="grid grid-cols-[1fr_auto] rounded-lg border border-border p-2 text-xs"><b className="text-navy">{n}</b><span className="text-primary">{h}</span><span className="text-muted-foreground">In {t} · Out 6:00 PM</span></div>)}</div><div className="mt-3 flex justify-between rounded-lg bg-navy p-2 text-xs text-on-dark"><span>Present 32</span><span>Absent 5</span><span>Leave 3</span></div></>;
}

function PayrollScreen() {
  return <><ScreenTitle>Salary & Payroll</ScreenTitle><div className="mt-3 flex items-center justify-between rounded-xl bg-soft-tint p-3 text-primary">{[Clock3,Navigation,Banknote].map((Icon,i)=><span key={i} className="flex items-center"><Icon className="size-5"/>{i<2&&<span className="ml-2 text-muted-foreground">→</span>}</span>)}</div><div className="mt-3 space-y-2">{[["Daily","₹800"],["Weekly","₹5,600"],["Monthly","₹24,000"]].map(([l,n],i)=><div key={l} className={`rounded-xl border p-3 flex items-center justify-between ${i===2?"border-primary bg-primary text-primary-foreground":"border-border bg-card text-navy"}`}><span className="text-xs opacity-90 font-bold">{l} Salary</span><b className="block text-lg">{n}</b></div>)}</div><p className="mt-3 text-center text-xs text-muted-foreground">Based on ₹800/day</p></>;
}

function DashboardScreen() {
  const cards = [[UsersRound,"Employees"],[MapPin,"Location"],[Clock3,"Attendance"],[Navigation,"Sales"],[Banknote,"Salary"]];
  return <><ScreenTitle>Live Dashboard</ScreenTitle><div className="mt-5 relative flex flex-col gap-4"><div className="absolute left-7 top-4 bottom-4 w-px border-l-2 border-dashed border-primary/30" />{cards.map(([Icon,l])=><div key={l as string} className="relative flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm"><div className="grid size-12 place-items-center rounded-lg bg-soft-tint text-primary relative z-10"><Icon className="size-6" /></div><b className="text-sm text-navy">{l as string}</b></div>)}</div></>;
}

function ConstructionScreen() {
  return <><ScreenTitle>Site Attendance</ScreenTitle><div className="mt-3 rounded-xl bg-soft-tint p-3"><div className="flex items-end justify-between"><Construction className="size-12 text-primary"/><div className="text-right"><b className="block text-2xl text-navy">32 / 40</b><span className="text-xs text-muted-foreground">Workers present</span></div></div></div><div className="mt-3 space-y-2">{[["Ramesh K.","9:00 AM","9 hrs"],["Suresh P.","9:10 AM","8h 55m"]].map(([n,t,h])=><div key={n} className="grid grid-cols-[1fr_auto] rounded-lg border border-border p-2 text-xs"><b className="text-navy">{n}</b><span className="text-primary">{h}</span><span className="text-muted-foreground">In {t}</span></div>)}</div></>;
}

function ServiceCenterScreen() {
  return <><ScreenTitle>Service Floor</ScreenTitle><div className="mt-3 grid grid-cols-2 gap-2">{[["6","Available","text-available"],["4","Busy","text-busy-dark"]].map(([n,l,c])=><div key={l} className="rounded-lg bg-soft-tint p-3 text-center"><b className={`block text-2xl ${c}`}>{n}</b><span className="text-xs text-muted-foreground">{l}</span></div>)}</div><div className="mt-3 space-y-2">{[["Arjun S.","Free"],["Meera K.","Job #42"]].map(([n,s])=><div key={n} className="grid grid-cols-[1fr_auto] items-center rounded-lg border border-border p-3 text-xs"><b className="text-navy">{n}</b><span className="text-muted-foreground">{s}</span></div>)}</div></>;
}

function HospitalScreen() {
  return <><ScreenTitle>Hospital Staff</ScreenTitle><div className="mt-3 rounded-xl bg-soft-tint p-4 flex items-center justify-between"><div className="grid size-10 place-items-center bg-card rounded-full text-primary"><UsersRound className="size-5"/></div><div className="text-right"><b className="block text-2xl text-navy">48</b><span className="text-xs text-muted-foreground">Staff on duty</span></div></div><div className="mt-3 space-y-2">{[["Dr. Sharma","Available"],["Nurse Priya","Ward 3"]].map(([n,s])=><div key={n} className="grid grid-cols-[1fr_auto] items-center rounded-lg border border-border p-3 text-xs"><b className="text-navy">{n}</b><span className="text-muted-foreground">{s}</span></div>)}</div></>;
}

function FieldSalesScreen() {
  return <><ScreenTitle>Field Visits</ScreenTitle><div className="mt-3 grid grid-cols-2 gap-2">{[["8","Visits"],["6","Clients Met"]].map(([n,l])=><div key={l} className="rounded-lg bg-soft-tint p-3 text-center"><b className="block text-2xl text-primary">{n}</b><span className="text-xs text-muted-foreground">{l}</span></div>)}</div><div className="mt-3 space-y-2">{[["Client A","Meeting Done"],["Client B","On the way"]].map(([n,s])=><div key={n} className="grid grid-cols-[1fr_auto] items-center rounded-lg border border-border p-3 text-xs"><b className="text-navy">{n}</b><span className="text-muted-foreground">{s}</span></div>)}</div></>;
}

export function ChaosToCalm() {
  const reduce = useReducedMotion();
  const [calm,setCalm] = useState(Boolean(reduce));
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const replay = () => { if(reduce) return; setCalm(false); window.setTimeout(()=>setCalm(true),2800); };
  
  useEffect(()=>{ 
    if(reduce || !isInView) return; 
    const id=window.setTimeout(()=>setCalm(true),2800); 
    return()=>window.clearTimeout(id)
  },[reduce, isInView]);

  return <div ref={ref} className="relative mx-auto flex min-h-[500px] w-full max-w-[520px] flex-col items-center justify-center overflow-hidden" data-chaos-state={calm?"calm":"chaos"}><AnimatePresence mode="wait">{calm?<motion.div key="calm" initial={{opacity:0,scale:.8,filter:"blur(8px)"}} animate={{opacity:1,scale:1,filter:"blur(0px)"}} transition={{type:"spring",bounce:.4,duration:.8}}><PhoneFrame scene="team" label="Calm team dashboard"/></motion.div>:<motion.div key="chaos" exit={{opacity:0,scale:0.4,filter:"blur(12px)"}} transition={{duration:0.6}} className="absolute inset-0 flex items-center justify-center w-full"><div className="relative w-full h-full max-w-[420px]"><motion.div initial={{opacity:0, scale:0.5, y:20, rotate:-4}} animate={{opacity:1, scale:1, y:[0,-4,0], rotate:-4}} transition={{duration:2, repeat:Infinity}} className="absolute top-[12%] left-0 z-10 flex w-[230px] items-start gap-3 rounded-2xl border border-on-dark/20 bg-on-dark/10 p-3 shadow-2xl backdrop-blur-xl"><div className="relative mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-alert-soft text-alert"><PhoneCall className="size-4" /><span className="absolute -right-1 -top-1 flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert opacity-75"/><span className="relative inline-flex size-3 rounded-full bg-alert"/></span></div><div><b className="block text-xs font-bold text-on-dark/70 uppercase tracking-wider">Missed Call</b><span className="text-sm font-semibold text-on-dark">"Where is the team??"</span></div></motion.div><motion.div initial={{opacity:0, scale:0.5, y:20, rotate:3}} animate={{opacity:1, scale:1, y:[0,4,0], rotate:3}} transition={{delay:0.3, duration:2.2, repeat:Infinity}} className="absolute top-[35%] right-0 z-10 flex w-[240px] items-start gap-3 rounded-2xl border border-whatsapp/40 bg-whatsapp/20 p-3 shadow-2xl backdrop-blur-xl"><div className="relative mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-whatsapp text-on-dark"><MessageCircle className="size-4" /><span className="absolute -right-1 -top-1 flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-dark opacity-75"/><span className="relative inline-flex size-3 rounded-full bg-on-dark"/></span></div><div><b className="block text-xs font-bold text-on-dark/70 uppercase tracking-wider">Site Manager</b><span className="text-sm font-semibold text-on-dark">"Arjun didn't reach yet."</span></div></motion.div><motion.div initial={{opacity:0, scale:0.5, y:20, rotate:-2}} animate={{opacity:1, scale:1, y:[0,-3,0], rotate:-2}} transition={{delay:0.6, duration:1.8, repeat:Infinity}} className="absolute bottom-[20%] left-[5%] z-10 flex w-[240px] items-start gap-3 rounded-2xl border border-sky/40 bg-sky/20 p-3 shadow-2xl backdrop-blur-xl"><div className="relative mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky text-deep-navy"><Banknote className="size-4" /></div><div><b className="block text-xs font-bold text-on-dark/70 uppercase tracking-wider">Accounts</b><span className="text-sm font-semibold text-on-dark">"Manual payroll is a mess."</span></div></motion.div>{Array.from({length:7}).map((_,i)=><motion.span key={i} className="absolute grid size-10 place-items-center rounded-full bg-on-dark/20 text-on-dark backdrop-blur-md border border-on-dark/30 shadow-lg" style={{left:`${25+(i*29)%50}%`,top:`${15+(i*17)%65}%`}} animate={{x:[0,(i%2?25:-30),0],y:[0,(i%3?20:-25),0],scale:[1,1.1,1]}} transition={{duration:1.5+(i%3)*.3,repeat:Infinity}}><UserRound className="size-5"/></motion.span>)}</div></motion.div>}</AnimatePresence><button type="button" onClick={replay} className="mt-4 min-h-11 rounded-lg px-4 text-sm font-semibold text-on-dark/60 hover:text-on-dark transition-colors relative z-20">↺ Replay</button></div>;
}

export function DashboardVisual() {
  const tiles = [[MapPin,"Location","18 available"],[UsersRound,"Employees","32 present"],[Clock3,"Attendance","9h avg"],[Route,"Field Tracking","8 visits"],[Navigation,"Sales","72%"],[Banknote,"Payroll","₹24,000"]] as const;
  return <div className="dashboard-shell"><div className="flex items-center justify-between border-b border-border px-5 py-4"><Logo/><span className="text-xs text-muted-foreground">Live dashboard</span></div><div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">{tiles.map(([Icon,label,value])=><motion.div whileHover={{y:-4}} key={label} className="rounded-xl border border-border bg-card p-4"><Icon className="size-5 text-primary"/><b className="mt-4 block text-sm text-navy">{label}</b><span className="text-xs text-muted-foreground">{value}</span></motion.div>)}</div></div>;
}

export function SolutionVisual() {
  return <div className="flex justify-center"><PhoneFrame scene="dashboard"/></div>;
}
function Mini({Icon,label}:{Icon:typeof MapPin;label:string}) {return <motion.div whileInView={{opacity:1,x:0}} initial={{opacity:0,x:-15}} viewport={{once:true}} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card"><span className="grid size-10 place-items-center rounded-lg bg-soft-tint text-primary"><Icon className="size-5"/></span><b className="text-sm text-navy">{label}</b></motion.div>}

export function CheckBenefit({children}:{children:React.ReactNode}) { return <li className="flex items-start gap-3"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-soft-tint text-primary"><Check className="size-3"/></span><span>{children}</span></li> }
