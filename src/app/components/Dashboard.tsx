import React, { useState, useEffect } from "react";
import { 
  Users, 
  Droplets, 
  MapPin, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  User,
  Zap,
  ShieldCheck,
  Star,
  X,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./ui/utils";
import { auth, api } from "../../lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface SOSAlert {
  id: string;
  userName: string;
  bloodGroup: string;
  location: string;
  urgency: string;
  hospital: string;
  message: string;
  createdAt: string;
  respondedBy: any[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([]);
  const [requests, setRequests] = useState([
    { id: 1, bloodGroup: "O-", distance: "2.4 km", urgency: "Critical", patient: "Emergency Trauma", isPriority: true },
    { id: 2, bloodGroup: "O-", distance: "5.1 km", urgency: "Medium", patient: "Surgery Prep", isPriority: false },
  ]);

  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [healthAnswers, setHealthAnswers] = useState({
    alcohol: null as boolean | null,
    donated: null as boolean | null,
    sick: null as boolean | null
  });
  const [eligibilityResult, setEligibilityResult] = useState<'eligible' | 'ineligible' | null>(null);

  // Mock eligibility days remaining
  const daysRemaining = 42; 
  const isTimeEligible = daysRemaining <= 0;

  // Load current user and SOS alerts on mount
  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    loadSOSAlerts();

    // Poll for SOS alerts every 10 seconds
    const interval = setInterval(loadSOSAlerts, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadSOSAlerts = async () => {
    try {
      const { alerts } = await api.getActiveSOS();
      setSOSAlerts(alerts);
    } catch (error) {
      console.error("Failed to load SOS alerts:", error);
    }
  };

  const respondToSOS = async (sosId: string) => {
    if (!currentUser) return;
    
    try {
      await api.respondToSOS(sosId, currentUser.id, currentUser.name, currentUser.phone);
      toast.success("You've responded to this SOS alert!");
      loadSOSAlerts();
    } catch (error: any) {
      toast.error(error.message || "Failed to respond to SOS");
    }
  };

  const handleAction = (id: number, action: string) => {
    if (action === "accept") {
      setSelectedRequestId(id);
      setShowHealthCheck(true);
      // Reset health check
      setHealthAnswers({ alcohol: null, donated: null, sick: null });
      setEligibilityResult(null);
    } else {
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const submitHealthCheck = () => {
    // Logic: If any answer is YES, ineligible
    if (healthAnswers.alcohol === true || healthAnswers.donated === true || healthAnswers.sick === true) {
      setEligibilityResult('ineligible');
    } else {
      setEligibilityResult('eligible');
    }
  };

  const confirmAcceptance = () => {
    if (selectedRequestId) {
      setRequests(prev => prev.filter(r => r.id !== selectedRequestId));
      setShowHealthCheck(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black text-2xl ring-4 ring-white shadow-xl">
            {currentUser?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none mb-1">
              Welcome back, {currentUser?.name || "Loading..."}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-slate-400 font-medium text-sm flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-500" /> Verified {currentUser?.role || "User"} • {currentUser?.bloodGroup || "Type not set"}
              </p>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                  {currentUser?.rating?.toFixed(1) || "5.0"} • Highly Reliable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl border border-slate-100">
          <span className={`text-[10px] font-black uppercase tracking-widest px-4 ${isAvailable ? "text-emerald-600" : "text-slate-400"}`}>
            {isAvailable ? "Available to Donate" : "Offline"}
          </span>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${isAvailable ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"}`}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Timer */}
        <div className="lg:col-span-1 space-y-8">
          {/* Eligibility Card */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eligibility Status</p>
                {isTimeEligible ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Clock size={20} className="text-red-500" />}
              </div>
              
              <div className="space-y-2">
                {isTimeEligible ? (
                  <h3 className="text-2xl font-black text-slate-900 italic">Ready to donate ✅</h3>
                ) : (
                  <h3 className="text-2xl font-black text-slate-900">Next eligible in <span className="text-red-600 italic">{daysRemaining} Days</span></h3>
                )}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isTimeEligible ? "100%" : "65%" }}
                    className={`h-full ${isTimeEligible ? 'bg-emerald-500' : 'bg-red-600'}`}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${isTimeEligible ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'} flex items-center justify-center`}>
                  {isTimeEligible ? <ShieldCheck size={16} /> : <Droplets size={16} fill="currentColor" />}
                </div>
                <p className="text-xs font-bold text-slate-600 leading-tight">
                  {isTimeEligible ? "You've met all safety intervals. Your blood is at peak quality." : "Last donation: Jan 15, 2026. Keep resting to ensure quality."}
                </p>
              </div>
            </div>
          </div>

          {/* Points & Rewards Preview */}
          <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <Award size={32} className="text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Honor Points</span>
              </div>
              <div>
                <p className="text-5xl font-black">2,450</p>
                <p className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={14} /> Top 5% in your region
                </p>
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Explore Rewards
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Requests & Leaderboard */}
        <div className="lg:col-span-2 space-y-8">
          {/* Incoming Requests */}
          <section className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
              <Zap size={18} className="text-red-600" /> Incoming Requests
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {requests.length > 0 ? requests.map((req) => (
                  <motion.div 
                    key={req.id}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "bg-white p-6 rounded-[32px] border shadow-sm space-y-6 hover:shadow-md transition-all group",
                      req.isPriority ? "border-red-200 ring-1 ring-red-100" : "border-slate-100"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 flex flex-col items-center justify-center border border-red-100 text-red-600 font-black text-xs">
                        {req.bloodGroup}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {req.isPriority && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-red-600 text-white rounded-lg flex items-center gap-1 animate-pulse">
                            <AlertCircle size={10} /> High Priority 🔴
                          </span>
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${req.urgency === 'Critical' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'}`}>
                          {req.urgency}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{req.patient}</h4>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {req.distance} away
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => handleAction(req.id, "accept")}
                        disabled={!isTimeEligible}
                        className={cn(
                          "flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95",
                          isTimeEligible 
                            ? "bg-slate-900 text-white hover:bg-red-600" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        )}
                      >
                        {isTimeEligible ? "Accept" : "Wait 42d"}
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, "reject")}
                        className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-red-600 transition-all active:scale-95"
                      >
                        Pass
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="md:col-span-2 py-12 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">No active requests in your area.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* SOS Emergency Alerts */}
          {sosAlerts.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600 animate-pulse" /> Emergency SOS Alerts
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {sosAlerts.map((sos) => (
                  <motion.div
                    key={sos.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 p-6 rounded-[32px] border-2 border-red-200 shadow-lg space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-xl">
                          {sos.bloodGroup}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg">{sos.userName} needs {sos.bloodGroup}</h4>
                          <p className="text-sm font-bold text-red-700 flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {sos.location} • {sos.urgency} urgency
                          </p>
                          {sos.hospital && (
                            <p className="text-xs text-slate-600 font-medium mt-1">📍 {sos.hospital}</p>
                          )}
                        </div>
                      </div>
                      
                      <span className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest animate-pulse">
                        LIVE SOS
                      </span>
                    </div>

                    {sos.message && (
                      <div className="relative z-10 p-4 bg-white rounded-2xl border border-red-100">
                        <p className="text-sm text-slate-700 font-medium italic">"{sos.message}"</p>
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">
                          {sos.respondedBy.length} responders
                        </span>
                      </div>
                      
                      <button
                        onClick={() => respondToSOS(sos.id)}
                        disabled={sos.respondedBy.some((r: any) => r.userId === currentUser?.id)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                      >
                        {sos.respondedBy.some((r: any) => r.userId === currentUser?.id) ? "Responded ✓" : "I Can Help"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Leaderboard & Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Network Heroes</h3>
              <div className="space-y-4">
                {[
                  { name: "Elena R.", points: 8200, rank: 1 },
                  { name: "Marcus T.", points: 2450, rank: 2, me: true },
                  { name: "Julie W.", points: 2100, rank: 3 },
                ].map((hero, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${hero.me ? 'bg-red-50 border border-red-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-4">{hero.rank}</span>
                      <p className="font-bold text-slate-900 text-sm">{hero.name}</p>
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{hero.points} pts</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Unlocked Perks</h3>
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emerald-900 text-xs">Free Medical Checkup</p>
                    <p className="text-[10px] text-emerald-700 font-medium">Available at City General</p>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between grayscale opacity-50">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Premium Insurance 10% Off</p>
                    <p className="text-[10px] text-slate-400 font-medium">Need 500 more points</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Eligibility Check Modal */}
      <AnimatePresence>
        {showHealthCheck && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHealthCheck(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 leading-none">Health Eligibility Check</h3>
                    <p className="text-slate-400 font-medium text-sm italic">Safety protocol for real-world emergency use</p>
                  </div>
                  <button onClick={() => setShowHealthCheck(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    { key: 'alcohol', question: "Have you consumed alcohol in the last 24 hours?" },
                    { key: 'donated', question: "Have you donated blood in the last 3 months?" },
                    { key: 'sick', question: "Are you feeling sick or unwell today?" },
                  ].map((q) => (
                    <div key={q.key} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <p className="font-bold text-slate-900 flex-1 leading-tight">{q.question}</p>
                      <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
                        <button 
                          onClick={() => setHealthAnswers(prev => ({ ...prev, [q.key]: true }))}
                          className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            healthAnswers[q.key as keyof typeof healthAnswers] === true ? "bg-red-600 text-white shadow-md shadow-red-200" : "text-slate-400 hover:bg-slate-50"
                          )}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setHealthAnswers(prev => ({ ...prev, [q.key]: false }))}
                          className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            healthAnswers[q.key as keyof typeof healthAnswers] === false ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : "text-slate-400 hover:bg-slate-50"
                          )}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {eligibilityResult === null ? (
                    <button 
                      onClick={submitHealthCheck}
                      disabled={healthAnswers.alcohol === null || healthAnswers.donated === null || healthAnswers.sick === null}
                      className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
                    >
                      Submit Evaluation
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-6 rounded-[24px] border flex items-center justify-between gap-4",
                        eligibilityResult === 'eligible' ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center",
                          eligibilityResult === 'eligible' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                        )}>
                          {eligibilityResult === 'eligible' ? <CheckCircle2 size={24} /> : <X size={24} />}
                        </div>
                        <div>
                          <p className={cn("font-black text-lg", eligibilityResult === 'eligible' ? "text-emerald-900" : "text-red-900")}>
                            {eligibilityResult === 'eligible' ? "You are eligible to donate ✅" : "You are not eligible to donate ❌"}
                          </p>
                          <p className="text-slate-500 text-xs font-medium">
                            {eligibilityResult === 'eligible' ? "Your responses match medical guidelines." : "Please consult a doctor or wait before your next attempt."}
                          </p>
                        </div>
                      </div>
                      
                      {eligibilityResult === 'eligible' ? (
                        <button 
                          onClick={confirmAcceptance}
                          className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                        >
                          Confirm Accept
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowHealthCheck(false)}
                          className="px-6 py-4 bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all active:scale-95"
                        >
                          Close
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}