import React, { useState } from "react";
import { 
  MapPin, 
  Hospital, 
  Navigation, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical,
  Star,
  AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./ui/utils";

const hospitals = [
  { id: 1, name: "City General Hospital", distance: "2.4 km", stock: "High", type: "O-", badges: ["24/7", "Trauma L1"], isEmergency: true },
  { id: 2, name: "North Clinic Emergency", distance: "4.8 km", stock: "Medium", type: "O-", bestMatch: true },
  { id: 3, name: "St. Mary's Medical Center", distance: "5.1 km", stock: "Low", type: "O-", badges: ["Private"] },
  { id: 4, name: "Regional Blood Bank", distance: "7.2 km", stock: "High", type: "O-", badges: ["Central"] },
];

const donors = [
  { id: 101, name: "Marcus Thorne", distance: "1.2 km", status: "Active", points: 450, avatar: "https://images.unsplash.com/photo-1579171817110-e4aa2d543305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwcGVyc29uJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0NDMxNTk1fDA&ixlib=rb-4.1.0&q=80&w=1080", trustScore: 4.8, isVerified: true },
  { id: 102, name: "Elena Rodriguez", distance: "3.5 km", status: "Active", points: 820, avatar: "https://images.unsplash.com/photo-1659353887804-fc7f9313021a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG1lZGljYWwlMjBwcm9mZXNzaW9uYWwlMjBkb2N0b3J8ZW58MXx8fHwxNzc0NDMxNTk2fDA&ixlib=rb-4.1.0&q=80&w=1080", trustScore: 4.9, isVerified: true },
  { id: 103, name: "Julie Walters", distance: "4.1 km", status: "Inactive", points: 1200, avatar: "https://images.unsplash.com/photo-1659353887804-fc7f9313021a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG1lZGljYWwlMjBwcm9mZXNzaW9uYWwlMjBkb2N0b3J8ZW58MXx8fHwxNzc0NDMxNTk2fDA&ixlib=rb-4.1.0&q=80&w=1080", trustScore: 4.5, isVerified: false },
];

export function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bloodType = searchParams.get("group") || "O-";
  const location = searchParams.get("loc") || "Downtown";
  const [requestStatus, setRequestStatus] = useState<Record<number, string>>({});

  const handleRequest = (id: number) => {
    setRequestStatus(prev => ({ ...prev, [id]: "sending" }));
    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, [id]: "accepted" }));
      navigate("/status");
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Search Result Summary Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/")}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 border border-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">{bloodType}</span>
              <h2 className="text-2xl font-black text-slate-900 leading-none">Availability Results</h2>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-1 text-sm">
              <MapPin size={14} /> Showing units near <span className="text-red-600 font-bold">{location}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden ring-1 ring-slate-100 shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase ring-1 ring-slate-100 shadow-sm">
              +14
            </div>
          </div>
          <div className="ml-2">
            <p className="text-xs font-black text-slate-900">14 Active Donors</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online Now</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Results (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Section 1: Nearby Hospitals */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Hospital size={18} className="text-red-600" /> Nearby Hospitals
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white rounded-xl shadow-sm border border-slate-100"><Filter size={18} /></button>
                <button className="p-2 text-red-600 bg-red-50 rounded-xl shadow-sm border border-red-100"><LayoutGrid size={18} /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((h, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={h.id}
                  className={`group relative bg-white p-6 rounded-[32px] border transition-all duration-300 ${
                    h.bestMatch ? "border-red-200 shadow-xl shadow-red-50 ring-1 ring-red-100" : "border-slate-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  {h.bestMatch && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-200 flex items-center gap-1.5 ring-4 ring-white">
                      <Zap size={10} fill="currentColor" /> Best Match
                    </div>
                  )}
                  {h.isEmergency && (
                    <div className="absolute -top-3 right-6 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 ring-4 ring-white animate-pulse">
                      <AlertCircle size={10} className="text-red-500" /> High Priority 🔴
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                      <Hospital size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Distance</p>
                      <p className="text-lg font-black text-slate-900 mt-1">{h.distance}</p>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2 pr-8">{h.name}</h4>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {h.badges?.map(badge => (
                      <span key={badge} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex flex-col items-center justify-center border border-red-100">
                        <span className="text-[10px] font-black text-red-600 leading-none">{h.type}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</p>
                        <p className={`text-xs font-black uppercase tracking-wider ${
                          h.stock === "High" ? "text-emerald-500" : h.stock === "Medium" ? "text-orange-500" : "text-red-500"
                        }`}>
                          {h.stock} Availability
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRequest(h.id)}
                      disabled={requestStatus[h.id] === "sending"}
                      className={cn(
                        "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                        requestStatus[h.id] === "accepted" ? "bg-emerald-500 text-white" : "bg-red-600 text-white hover:bg-red-700"
                      )}
                    >
                      {requestStatus[h.id] === "sending" ? "Sending..." : requestStatus[h.id] === "accepted" ? "Accepted ✅" : "Request Blood"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 2: Nearby Donors */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <User size={18} className="text-red-600" /> Individual Donors
              </h3>
              <button className="text-sm font-bold text-red-600 hover:underline">View Map View</button>
            </div>

            <div className="space-y-4">
              {donors.map((d, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={d.id}
                  className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-red-100 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-1 ring-slate-200">
                        <img src={d.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        d.status === "Active" ? "bg-emerald-500" : "bg-slate-300"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{d.name}</h4>
                        {d.isVerified && (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <ShieldCheck size={10} /> Verified by Hospital ✅
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {d.distance}
                        </span>
                        <span className="text-slate-200">•</span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{d.status}</span>
                        <span className="text-slate-200">•</span>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                          <span className="text-[10px] font-black text-amber-600">{d.trustScore} ⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                      <p className="text-sm font-black text-slate-900">{d.points}</p>
                    </div>
                    <button 
                      onClick={() => handleRequest(d.id)}
                      disabled={requestStatus[d.id] === "sending"}
                      className={cn(
                        "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                        requestStatus[d.id] === "accepted" ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-600 hover:bg-red-600 hover:text-white"
                      )}
                    >
                      {requestStatus[d.id] === "sending" ? "Sending..." : requestStatus[d.id] === "accepted" ? "Accepted ✅" : "Request"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Map Preview (Col 3) */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black mb-2">Need Help Now?</h3>
              <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                Send an immediate broadcast to all matching donors and hospitals in a 10km radius.
              </p>
              <button 
                onClick={() => navigate("/status?emergency=true")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-900/50 transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
              >
                <Zap fill="currentColor" size={20} />
                Send SOS Request
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-4 h-[400px] overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1722082839841-45473f5a15cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwc2F0ZWxsaXRlJTIwdmlldyUyMG1vZGVybnxlbnwxfHx8fDE3NzQ0MzE1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080" 
              className="w-full h-full object-cover rounded-[32px] opacity-60 grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
              alt="Map View"
            />
            <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />
            
            {/* Fake Markers */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
              <div className="w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white ring-4 ring-red-100 animate-bounce">
                <Hospital size={16} />
              </div>
            </div>
            <div className="absolute bottom-1/3 left-1/4">
              <div className="w-8 h-8 bg-slate-900 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white">
                <User size={14} />
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Area</p>
                  <p className="text-sm font-bold text-slate-900">{location}</p>
                </div>
                <Navigation size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
