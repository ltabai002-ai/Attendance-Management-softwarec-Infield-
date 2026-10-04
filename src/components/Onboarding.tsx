import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  "Owner / Founder",
  "HR / Admin Manager",
  "Operations Manager",
  "Sales Manager",
  "Project / Site Manager",
  "Other"
];

const challengesList = [
  { id: "tracking", label: "Difficulty tracking team attendance and locations" },
  { id: "payroll", label: "Manual payroll calculation and timesheet errors" },
  { id: "leaving", label: "Employees leaving the work area without notice" },
  { id: "sales", label: "Lack of visibility into field sales or site visits" },
  { id: "scheduling", label: "Chaotic team communication and scheduling" }
];

const features = [
  { id: "availability", label: "Live Staff Availability & Locations" },
  { id: "attendance", label: "Auto Attendance & Timesheets" },
  { id: "radius", label: "Work Area Radius Alerts" },
  { id: "payroll", label: "Auto Payroll & Salary Calculation" },
  { id: "visits", label: "Field Sales & Visit Tracking" },
  { id: "roster", label: "Shift Scheduling & Roster Management" }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactCity, setContactCity] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleChallenge = (id: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2 && selectedChallenges.length > 0) {
      setStep(3);
    } else if (step === 3 && selectedFeatures.length > 0) {
      setStep(4);
    } else if (step === 4 && contactName && contactPhone && businessName && contactCity && teamSize) {
      setIsSubmitting(true);
      try {
        const payload = {
          role: selectedRole,
          challenges: selectedChallenges.map(id => challengesList.find(c => c.id === id)?.label).join(" | "),
          features: selectedFeatures.map(id => features.find(f => f.id === id)?.label).join(" | "),
          name: contactName,
          phone: contactPhone,
          business: businessName,
          city: contactCity,
          teamSize: teamSize,
          timestamp: new Date().toISOString()
        };

        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxulGiwHQXHipMx74m1Xv65zZgSIpY7Ni2h0U1iYy2HSA7nx7HKrdL66_dzVz1Ttdg/exec";
        
        if (GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_SCRIPT_WEB_APP_URL") {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
          });
        }
      } catch (err) {
        console.error("Failed to send data to Google Sheets", err);
      } finally {
        setIsSubmitting(false);
        sessionStorage.setItem("onboarding_complete_session", "true");
        onComplete();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-6">
      <div className="absolute inset-0 z-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat opacity-5 mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl scene-card bg-card p-6 shadow-scene sm:p-10">
        <div className="mb-8 flex items-center justify-between">
          <img src="/logo.png" alt="INFIELD" className="h-8 w-auto object-contain brightness-0" />
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-muted-foreground hidden sm:block">
              Step {step} of 4
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              sessionStorage.setItem("onboarding_complete_session", "true");
              onComplete();
            }}>
              Explore Website <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                What is your role?
              </h2>
              <p className="mt-2 text-muted-foreground">
                We'll customize your experience based on your needs.
              </p>
              
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex min-h-[3.5rem] items-center justify-between rounded-xl border px-4 py-2 text-left font-semibold transition-colors ${
                      selectedRole === role
                        ? "border-primary bg-soft-tint text-primary"
                        : "border-border bg-background text-navy hover:border-primary/50 hover:bg-soft-tint/50"
                    }`}
                  >
                    {role}
                    {selectedRole === role && <Check className="size-5" />}
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <Button
                  variant="hero"
                  size="lg"
                  disabled={!selectedRole}
                  onClick={handleNext}
                >
                  Continue <ArrowRight />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                What are the challenges you are facing?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Select all the issues that apply to your team.
              </p>
              
              <div className="mt-8 grid gap-3 sm:grid-cols-1">
                {challengesList.map((challenge) => {
                  const isSelected = selectedChallenges.includes(challenge.id);
                  return (
                    <button
                      key={challenge.id}
                      onClick={() => toggleChallenge(challenge.id)}
                      className={`flex min-h-[3.5rem] items-center justify-between rounded-xl border px-4 py-2 text-left font-semibold transition-colors ${
                        isSelected
                          ? "border-primary bg-soft-tint text-primary"
                          : "border-border bg-background text-navy hover:border-primary/50 hover:bg-soft-tint/50"
                      }`}
                    >
                      {challenge.label}
                      <div className={`grid size-6 shrink-0 place-items-center rounded-md border ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background'}`}>
                        {isSelected && <Check className="size-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  disabled={selectedChallenges.length === 0}
                  onClick={handleNext}
                >
                  Continue <ArrowRight />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                What features do you need?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Select all the solutions that will help your business run smoother.
              </p>
              
              <div className="mt-8 grid gap-3 sm:grid-cols-1">
                {features.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`flex min-h-[3.5rem] items-center justify-between rounded-xl border px-4 py-2 text-left font-semibold transition-colors ${
                        isSelected
                          ? "border-primary bg-soft-tint text-primary"
                          : "border-border bg-background text-navy hover:border-primary/50 hover:bg-soft-tint/50"
                      }`}
                    >
                      {feature.label}
                      <div className={`grid size-6 shrink-0 place-items-center rounded-md border ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background'}`}>
                        {isSelected && <Check className="size-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  disabled={selectedFeatures.length === 0}
                  onClick={handleNext}
                >
                  Continue <ArrowRight />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                Almost there!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Tell us a little bit about yourself so we can help.
              </p>
              
              <div className="mt-8 grid gap-4 sm:grid-cols-1">
                <label className="grid gap-2 text-sm font-semibold text-navy">
                  <span>Full Name</span>
                  <input
                    className="flex min-h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Your name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      className="flex min-h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Your phone number"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    <span>City / Location</span>
                    <input
                      className="flex min-h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="e.g. Bangalore"
                      value={contactCity}
                      onChange={(e) => setContactCity(e.target.value)}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    <span>Business Name</span>
                    <input
                      className="flex min-h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Name of your organization"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-navy">
                    <span>Team Size</span>
                    <select
                      className="flex min-h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                    >
                      <option value="">Select team size</option>
                      <option value="1-20">1 - 20</option>
                      <option value="21-50">21 - 50</option>
                      <option value="51-200">51 - 200</option>
                      <option value="200+">200+</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  disabled={!contactName || !contactPhone || !businessName || !contactCity || !teamSize || isSubmitting}
                  onClick={handleNext}
                >
                  {isSubmitting ? "Booking..." : "Book an Appointment"} <ArrowRight />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
