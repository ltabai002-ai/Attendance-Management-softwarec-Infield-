import {
  Banknote,
  Building2,
  Check,
  Clock3,
  Construction,
  MapPin,
  Navigation,
  PhoneCall,
  Route,
  UserRound,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

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
      </div>
    </div>
  );
}

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 font-display text-lg font-bold text-navy">{children}</h3>;
}

function TeamScreen() {
  return <><ScreenTitle>Team Now</ScreenTitle><div className="mt-3 grid grid-cols-3 gap-1">{[["18","Available","text-available"],["9","Busy","text-busy-dark"],["5","Offline","text-offline"]].map(([n,l,c])=><div key={l} className="rounded-lg bg-soft-tint p-2 text-center"><b className={`block text-xl ${c}`}>{n}</b><span className="text-[9px] text-muted-foreground">{l}</span></div>)}</div><div className="mt-3 space-y-2">{people.map((p)=><div key={p.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-border bg-card p-2"><span className="grid size-8 place-items-center rounded-full bg-soft-tint text-primary"><UserRound className="size-4"/></span><span className="min-w-0"><b className="block truncate text-[11px] text-navy">{p.name}</b><span className="text-[9px] text-muted-foreground">{p.distance}</span></span><span className="flex items-center gap-1 text-[9px] text-navy"><i className={`size-2 rounded-full ${p.color}`}/>{p.status}</span></div>)}</div></>;
}

function MapCanvas({ outside = false }: { outside?: boolean }) {
  return <div className="map-canvas mt-3"><div className="map-road map-road-a"/><div className="map-road map-road-b"/><div className="radius-ring"/><div className="absolute left-[42%] top-[40%] grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow"><Building2 className="size-5"/></div><motion.div animate={{ x: outside ? 72 : 0, y: outside ? -44 : 0 }} transition={{ duration: 1.5 }} className="absolute left-[48%] top-[58%] grid size-7 place-items-center rounded-full bg-alert text-primary-foreground"><UserRound className="size-4"/></motion.div></div>;
}

function RadiusScreen() {
  return <><ScreenTitle>Work Radius</ScreenTitle><MapCanvas outside/><div className="mt-3 flex justify-center gap-1 text-[9px]"><span className="chip">05 min</span><span className="chip">15 min</span><span className="rounded-md bg-alert px-2 py-1 font-bold text-primary-foreground">30 min</span></div><div className="mt-3 rounded-xl border border-alert/30 bg-alert-soft p-3 text-[10px] text-navy"><b className="block text-alert">Employee Outside Work Radius</b>Pooja M. · More than 30 minutes</div></>;
}

function ResumeScreen() {
  return <><ScreenTitle>Work Tracking</ScreenTitle><MapCanvas/><div className="mt-3 rounded-xl bg-available-soft p-3 text-center text-[11px] font-bold text-available">✓ Back in Work Area</div><div className="mt-3 flex items-center justify-between rounded-xl border border-border p-3 text-[10px]"><span><b className="block text-navy">Pooja M.</b><span className="text-muted-foreground">Working · 2:14 PM</span></span><span className="rounded-full bg-available px-3 py-1 font-bold text-primary-foreground">ON</span></div></>;
}

function SalesScreen() {
  return <><ScreenTitle>Field Visits</ScreenTitle><div className="map-canvas mt-3"><svg viewBox="0 0 220 130" className="h-full w-full" aria-label="Salesperson route map"><path d="M18 105 C55 20, 95 120, 145 45 S190 35,205 18" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="7 6"/><circle cx="22" cy="104" r="8" fill="var(--available)"/><circle cx="110" cy="77" r="8" fill="var(--available)"/><circle cx="203" cy="20" r="8" fill="var(--available)"/></svg></div><div className="mt-3 grid grid-cols-2 gap-2">{[["8","Visits"],["6","Clients Met"],["24 km","Distance"],["72%","Progress"]].map(([n,l])=><div key={l} className="rounded-lg bg-soft-tint p-2"><b className="block text-base text-primary">{n}</b><span className="text-[9px] text-muted-foreground">{l}</span></div>)}</div></>;
}

function AttendanceScreen() {
  return <><ScreenTitle>Site Attendance</ScreenTitle><div className="mt-3 rounded-xl bg-soft-tint p-3"><div className="flex items-end justify-between"><Construction className="size-12 text-primary"/><div className="text-right"><b className="block text-2xl text-navy">32</b><span className="text-[9px] text-muted-foreground">Workers present</span></div></div></div><div className="mt-3 space-y-2">{[["Ramesh K.","9:00 AM","9 hrs"],["Suresh P.","9:10 AM","8h 55m"]].map(([n,t,h])=><div key={n} className="grid grid-cols-[1fr_auto] rounded-lg border border-border p-2 text-[10px]"><b className="text-navy">{n}</b><span className="text-primary">{h}</span><span className="text-muted-foreground">In {t} · Out 6:00 PM</span></div>)}</div><div className="mt-3 flex justify-between rounded-lg bg-navy p-2 text-[9px] text-on-dark"><span>Present 32</span><span>Absent 5</span><span>Leave 3</span></div></>;
}

function PayrollScreen() {
  return <><ScreenTitle>Salary & Payroll</ScreenTitle><div className="mt-3 flex items-center justify-between rounded-xl bg-soft-tint p-3 text-primary">{[Clock3,Navigation,Banknote].map((Icon,i)=><span key={i} className="flex items-center"><Icon className="size-5"/>{i<2&&<span className="ml-2 text-muted-foreground">→</span>}</span>)}</div><div className="mt-3 space-y-2">{[["Daily","₹800"],["Weekly","₹5,600"],["Monthly","₹24,000"]].map(([l,n],i)=><div key={l} className={`rounded-xl border p-3 ${i===2?"border-primary bg-primary text-primary-foreground":"border-border bg-card text-navy"}`}><span className="text-[10px] opacity-75">{l} Salary</span><b className="block text-xl">{n}</b></div>)}</div><p className="mt-2 text-center text-[9px] text-muted-foreground">Based on ₹800/day</p></>;
}

export function ChaosToCalm() {
  const reduce = useReducedMotion();
  const [calm,setCalm] = useState(Boolean(reduce));
  const replay = () => { if(reduce) return; setCalm(false); window.setTimeout(()=>setCalm(true),1500); };
  useEffect(()=>{ if(reduce) return; const id=window.setTimeout(()=>setCalm(true),1500); return()=>window.clearTimeout(id)},[reduce]);
  return <div className="relative mx-auto flex min-h-[500px] max-w-[520px] flex-col items-center justify-center overflow-hidden" data-chaos-state={calm?"calm":"chaos"}><AnimatePresence mode="wait">{calm?<motion.div key="calm" initial={{opacity:0,scale:.75}} animate={{opacity:1,scale:1}}><PhoneFrame scene="team" label="Calm team dashboard"/></motion.div>:<motion.div key="chaos" exit={{opacity:0,scale:.3}} className="absolute inset-0"><span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl border border-on-dark/20 bg-on-dark/10 px-3 py-2 text-sm text-on-dark">Who is available?</span><span className="absolute bottom-20 left-2 rounded-xl border border-on-dark/20 bg-on-dark/10 px-3 py-2 text-sm text-on-dark">Who is outside?</span><span className="absolute right-2 top-1/3 rounded-xl border border-on-dark/20 bg-on-dark/10 px-3 py-2 text-sm text-on-dark">Who is where?</span>{Array.from({length:10}).map((_,i)=><motion.span key={i} className="absolute grid size-9 place-items-center rounded-full bg-on-dark text-primary shadow" style={{left:`${12+(i*37)%80}%`,top:`${18+(i*23)%65}%`}} animate={{x:[0,(i%2?18:-15),0],y:[0,(i%3?12:-18),0]}} transition={{duration:1+(i%3)*.25,repeat:Infinity}}><UserRound className="size-4"/></motion.span>)}</motion.div>}</AnimatePresence><button type="button" onClick={replay} className="mt-4 min-h-11 rounded-lg px-4 text-sm font-semibold text-on-dark/80 hover:text-on-dark">↺ Replay</button></div>;
}

export function DashboardVisual() {
  const tiles = [[MapPin,"Location","18 available"],[UsersRound,"Employees","32 present"],[Clock3,"Attendance","9h avg"],[Route,"Field Tracking","8 visits"],[Navigation,"Sales","72%"],[Banknote,"Payroll","₹24,000"]] as const;
  return <div className="dashboard-shell"><div className="flex items-center justify-between border-b border-border px-5 py-4"><Logo/><span className="text-xs text-muted-foreground">Live dashboard</span></div><div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">{tiles.map(([Icon,label,value])=><motion.div whileHover={{y:-4}} key={label} className="rounded-xl border border-border bg-card p-4"><Icon className="size-5 text-primary"/><b className="mt-4 block text-sm text-navy">{label}</b><span className="text-xs text-muted-foreground">{value}</span></motion.div>)}</div></div>;
}

export function SolutionVisual() {
  const items = [[UsersRound,"Employees"],[MapPin,"Location"],[Clock3,"Attendance"],[Navigation,"Sales"],[Banknote,"Salary"]] as const;
  return <div className="relative grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]"> <div className="grid gap-3">{items.slice(0,3).map(([Icon,l])=><Mini key={l} Icon={Icon} label={l}/>)}</div><PhoneFrame/><div className="grid gap-3">{items.slice(3).map(([Icon,l])=><Mini key={l} Icon={Icon} label={l}/>)}</div></div>;
}
function Mini({Icon,label}:{Icon:typeof MapPin;label:string}) {return <motion.div whileInView={{opacity:1,x:0}} initial={{opacity:0,x:-15}} viewport={{once:true}} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card"><span className="grid size-10 place-items-center rounded-lg bg-soft-tint text-primary"><Icon className="size-5"/></span><b className="text-sm text-navy">{label}</b></motion.div>}

export function CheckBenefit({children}:{children:React.ReactNode}) { return <li className="flex items-start gap-3"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-soft-tint text-primary"><Check className="size-3"/></span><span>{children}</span></li> }
