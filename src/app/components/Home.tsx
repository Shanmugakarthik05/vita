import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Navigation, 
  Droplets, 
  AlertCircle, 
  ArrowRight,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { cn } from "./ui/utils";
import { auth } from "../../lib/supabase";

export function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState("needer"); // donor, needer, hospital
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Check for auto-login on mount
  useEffect(() => {
    const user = auth.getUser();
    if (user) {
      // User is already logged in, redirect to appropriate page
      if (user.role === "donor") {
        navigate("/dashboard");
      } else if (user.role === "needer") {
        navigate("/results");
      } else {
        navigate("/hospitals");
      }
    }
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to login instead of direct navigation
    navigate("/login");
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
      {/* Prediction Alert Banner - Simplified because global banner exists */}
      <div className="w-full max-w-4xl mb-12 hidden md:block">
        <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">
          The <span className="text-red-600 italic font-black">Blood Bridge</span> Network
        </p>
      </div>

      {/* Main Search Hero */}
      <div className="w-full max-w-2xl text-center space-y-12">
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="w-20 h-20 bg-red-600 rounded-[28px] mx-auto flex items-center justify-center shadow-3xl shadow-red-300 relative"
          >
            <Droplets size={40} className="text-white" fill="currentColor" />
          </motion.div>
          
          <div className="space-y-3">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]"
            >
              Life Sync <span className="text-red-600 italic">Network.</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-medium text-lg max-w-md mx-auto"
            >
              Select your role to join the most reliable blood network.
            </motion.p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-3xl w-full max-w-sm mx-auto shadow-inner border border-slate-200">
          {[
            { id: "donor", label: "Donor" },
            { id: "needer", label: "Needer" },
            { id: "hospital", label: "Hospital" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRole(tab.id)}
              className={cn(
                "flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                role === tab.id 
                  ? "bg-white text-red-600 shadow-xl border border-slate-200" 
                  : "text-slate-400 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Form - Card Based UI */}
        <motion.form 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/80 border border-slate-100 space-y-8 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe..."
                  required
                  className="w-full pl-6 pr-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all font-black text-slate-800 text-lg shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
              <div className="relative group">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full pl-6 pr-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all font-black text-slate-800 text-lg shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Blood Group</label>
              <div className="relative group">
                <select 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                  className="w-full pl-14 pr-4 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all appearance-none font-black text-slate-800 text-lg shadow-inner"
                >
                  <option value="">Choose Type</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-600 transition-transform group-focus-within:scale-110">
                  <Droplets size={16} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Location</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Zip..."
                  required
                  className="w-full pl-14 pr-14 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all font-black text-slate-800 text-lg shadow-inner"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 transition-transform group-focus-within:scale-110">
                  <MapPin size={16} />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl shadow-red-200 transition-all flex items-center justify-center gap-4 active:scale-[0.97] group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">{role === "needer" ? "Search Availability" : "Continue to Dashboard"}</span>
            <ArrowRight size={26} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.form>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Network Live</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1,200+ Hospitals Linked</p>
          </div>
        </div>
      </div>
    </div>
  );
}