import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  Phone, 
  AlertCircle, 
  MoreVertical, 
  Zap,
  ArrowLeft,
  Truck,
  Heart,
  Droplets,
  Hospital
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

export function EmergencyFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, accepted, on-way, confirmed
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulated request flow
    const timers = [
      setTimeout(() => setStatus("accepted"), 2500),
      setTimeout(() => setStatus("on-way"), 5000),
      setTimeout(() => {
        setStatus("confirmed");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f87171', '#fee2e2']
        });
      }, 10000)
    ];

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 100);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/results")}
          className="p-3 hover:bg-white rounded-2xl transition-colors text-slate-400 border border-slate-100 shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Live Connection</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Status Column */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 text-center space-y-8 overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-50 overflow-hidden">
              <motion.div 
                className="h-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                animate={{ width: `${progress}%` }} 
              />
            </div>

            <AnimatePresence mode="wait">
              {status === "loading" && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-50" />
                    <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-red-600">
                      <Zap size={40} className="animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Sending Broadcast...</h2>
                    <p className="text-slate-400 font-medium">Notifying nearest hospitals and matching donors.</p>
                  </div>
                </motion.div>
              )}

              {status === "accepted" && (
                <motion.div 
                  key="accepted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mx-auto w-32 h-32 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border-4 border-emerald-100">
                    <CheckCircle2 size={50} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Hospital Confirmed! ✅</h2>
                    <p className="text-slate-400 font-medium">City General Hospital has reserved 4 units of O- Negative for your request.</p>
                  </div>
                </motion.div>
              )}

              {status === "on-way" && (
                <motion.div 
                  key="on-way"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mx-auto w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border-4 border-blue-100 overflow-hidden relative">
                    <Truck size={50} className="relative z-10" />
                    <div className="absolute inset-0 bg-blue-100/30 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Blood in Transit 🚛</h2>
                    <p className="text-slate-400 font-medium">Courier is currently 1.2km away from City General Hospital.</p>
                  </div>
                </motion.div>
              )}

              {status === "confirmed" && (
                <motion.div 
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="mx-auto w-32 h-32 rounded-full bg-red-50 flex items-center justify-center text-red-600 border-4 border-red-100 shadow-xl shadow-red-200/50">
                    <Heart size={50} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Mission Successful</h2>
                    <p className="text-slate-400 font-medium">Donor Accepted & Hospital units confirmed. Life saved.</p>
                  </div>
                  <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                    View Receipt & Log
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Live Tracking Map Section */}
          <div className="bg-white p-4 rounded-[48px] border border-slate-100 shadow-2xl relative overflow-hidden h-[400px] group">
            <img 
              src="https://images.unsplash.com/photo-1722082839841-45473f5a15cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwc2F0ZWxsaXRlJTIwdmlldyUyMG1vZGVybnxlbnwxfHx8fDE3NzQ0MzE1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080" 
              className="w-full h-full object-cover rounded-[32px] opacity-70 grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Live Map"
            />
            
            {/* Moving Donor Marker */}
            <motion.div 
              animate={{ 
                x: [0, 50, 100, 150, 200], 
                y: [0, -20, -50, -80, -100] 
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 left-1/4 z-20"
            >
              <div className="flex flex-col items-center">
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-2xl border border-slate-100 mb-2">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest whitespace-nowrap">Donor on the way</p>
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-red-100 animate-bounce">
                  <Truck size={18} />
                </div>
              </div>
            </motion.div>

            {/* Destination Marker */}
            <div className="absolute top-1/4 right-1/4 z-10">
              <div className="flex flex-col items-center">
                <div className="bg-slate-900 px-3 py-1.5 rounded-xl shadow-2xl border border-slate-800 mb-2">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Your Location</p>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">
                  <MapPin size={18} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                    <Zap size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Update</p>
                    <p className="text-sm font-black text-slate-900 mt-1">Life-Carrier unit #902 is 1.2km away.</p>
                  </div>
                </div>
                <button className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-95">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Tracking */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest px-2">Request Timeline</h3>
            <div className="space-y-0 px-2">
              <TimelineItem 
                title="Request Broadcasted" 
                time="10:45 AM" 
                completed={true} 
                active={status === "loading"}
                description="Emergency alert sent to 14 nodes."
              />
              <TimelineItem 
                title="Hospital Reserved Units" 
                time="10:47 AM" 
                completed={status !== "loading"} 
                active={status === "accepted"}
                description="City General confirmed 4 units availability."
              />
              <TimelineItem 
                title="Courier Dispatched" 
                time="10:52 AM" 
                completed={status === "on-way" || status === "confirmed"} 
                active={status === "on-way"}
                description="Life-carrier unit #902 on route."
              />
              <TimelineItem 
                title="Arrival at Destination" 
                time="ETA: 11:05 AM" 
                completed={status === "confirmed"} 
                active={false}
                description="Trauma Center handover."
                last={true}
              />
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Matched Facility</h4>
              <button className="p-2 bg-slate-50 rounded-xl"><MoreVertical size={16} /></button>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
                <Hospital size={28} />
              </div>
              <div>
                <h5 className="font-black text-slate-900">City General Hospital</h5>
                <p className="text-xs font-bold text-slate-400">2.4 km away • Trauma Level 1</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Phone size={14} /> Call Liaison
              </button>
              <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
                <Navigation size={20} />
              </button>
            </div>
          </div>

          <div className="bg-red-600 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Droplets size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-100">Requested Payload</span>
              </div>
              <p className="text-4xl font-black">O- Negative</p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-200">Quantity</p>
                  <p className="text-xl font-black">4 Units</p>
                </div>
                <div className="w-[1px] h-8 bg-white/20" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-200">Priority</p>
                  <p className="text-xl font-black italic">Critical</p>
                </div>
              </div>
            </div>
            <AlertCircle size={140} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ title, time, completed, active, description, last = false }: any) {
  return (
    <div className="flex gap-6 min-h-[80px]">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
          completed ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-red-50 border-red-600 text-red-600 scale-110" : "bg-white border-slate-100 text-slate-300"
        }`}>
          {completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
        </div>
        {!last && <div className={`w-0.5 h-full ${completed ? "bg-emerald-500" : "bg-slate-100"}`} />}
      </div>
      <div className="pb-10 pt-1">
        <div className="flex items-center gap-3">
          <h5 className={`font-bold transition-all ${active ? "text-slate-900 text-lg" : "text-slate-600 text-sm"}`}>{title}</h5>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs font-medium text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}
