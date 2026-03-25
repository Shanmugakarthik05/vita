import React, { useState } from "react";
import { User, Droplets, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { api, auth } from "../../lib/supabase";
import { cn } from "./ui/utils";

export function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("donor");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      // Register/login user with just name
      const { user } = await api.registerUser(name, role);
      
      // Store user data locally for persistent login
      auth.setUser(user);
      
      toast.success(`Welcome, ${name}!`);
      
      // Navigate based on role
      if (role === "donor") {
        navigate("/dashboard");
      } else if (role === "needer") {
        navigate("/results");
      } else {
        navigate("/hospitals");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Demo Info Banner */}
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">
            🎮 Demo Mode Active
          </p>
          <p className="text-xs text-blue-600 font-medium">
            Just enter your name to login. Data syncs across all devices using localStorage.
          </p>
        </div>

        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-red-600 rounded-[24px] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-red-300"
        >
          <Droplets size={32} className="text-white" fill="currentColor" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
            Welcome to <span className="text-red-600 italic">Blood Bridge</span>
          </h1>
          <p className="text-slate-400 font-medium">
            Enter your name to get started
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/80 border border-slate-100"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                I am a
              </label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {[
                  { id: "donor", label: "Donor" },
                  { id: "needer", label: "Needer" },
                  { id: "hospital", label: "Hospital" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRole(tab.id)}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      role === tab.id
                        ? "bg-white text-red-600 shadow-lg"
                        : "text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-6 focus:ring-red-50/50 transition-all font-bold text-slate-800 text-base"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600">
                  <User size={14} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Info Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 w-fit mx-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
            Instant Login
          </p>
        </div>
      </div>
    </div>
  );
}