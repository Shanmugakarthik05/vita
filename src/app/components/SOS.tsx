import React, { useState, useEffect } from "react";
import { AlertTriangle, Zap, MapPin, Phone, Hospital, User, ShieldCheck, Droplets } from "lucide-react";
import { auth, api } from "../../lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function SOS() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    location: "",
    hospital: "",
    message: "",
    urgency: "critical"
  });

  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleBroadcastSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You must be logged in to broadcast SOS");
      return;
    }

    if (!formData.bloodGroup || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.broadcastSOS({
        userId: currentUser.id,
        userName: currentUser.name,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        hospital: formData.hospital,
        message: formData.message,
        urgency: formData.urgency
      });

      toast.success("SOS Alert Broadcasted! All users will be notified.");
      
      // Reset form
      setFormData({
        bloodGroup: "",
        location: "",
        hospital: "",
        message: "",
        urgency: "critical"
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to broadcast SOS");
      console.error("Broadcast SOS error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-red-600 rounded-[32px] mx-auto flex items-center justify-center shadow-3xl shadow-red-300 relative">
          <AlertTriangle size={44} className="text-white animate-pulse" fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-[0.9]">Emergency <span className="text-red-600 italic">Broadcast</span></h1>
        <p className="text-slate-400 font-medium text-lg max-w-md mx-auto">Trigger an immediate network-wide alert for critical blood needs.</p>
      </div>

      {/* SOS Broadcast Form */}
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/80 border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Broadcast SOS Alert</h2>
        
        <form onSubmit={handleBroadcastSOS} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Blood Group Needed*</label>
              <div className="relative">
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  required
                  className="w-full pl-14 pr-4 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all appearance-none font-black text-slate-800 text-lg shadow-inner"
                >
                  <option value="">Select Type</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <Droplets size={16} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Urgency Level*</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all appearance-none font-black text-slate-800 text-lg shadow-inner"
              >
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Location*</label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Hospital, or Address..."
                required
                className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all font-black text-slate-800 text-lg shadow-inner"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <MapPin size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Hospital/Center (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                placeholder="Hospital name..."
                className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all font-black text-slate-800 text-lg shadow-inner"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Hospital size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Additional Message (Optional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any additional details..."
              rows={3}
              className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-red-100 focus:bg-white focus:ring-8 focus:ring-red-50/50 transition-all font-black text-slate-800 text-base shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl shadow-red-200 transition-all flex items-center justify-center gap-4 active:scale-[0.97]"
          >
            {loading ? "Broadcasting..." : "🚨 Broadcast Emergency SOS"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-xs text-amber-800 font-medium text-center">
            ⚠️ SOS broadcasts are visible to all users on the network. Only use in genuine emergencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Trauma Level 1", icon: Hospital, description: "Direct alert to major medical centers in the region.", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
          { title: "Rapid Response", icon: Zap, description: "Notifies nearest verified donors within a 15km radius.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
          { title: "Courier Hubs", icon: MapPin, description: "Activates emergency logistics and life-carrier dispatch.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        ].map((action, i) => (
          <div key={i} className={`bg-white p-8 rounded-[40px] border transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col items-center text-center group ${action.border}`}>
            <div className={`w-16 h-16 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <action.icon size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{action.title}</h3>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">{action.description}</p>
            <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${action.bg} ${action.color} border ${action.border} hover:bg-slate-900 hover:text-white active:scale-95`}>Initialize</button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Clearance Required</span>
            </div>
            <h2 className="text-3xl font-black">Full Network Lockdown SOS</h2>
            <p className="text-slate-400 font-medium text-base">This will broadcast a high-priority interrupt to all connected nodes, mobile applications, and emergency services dashboards.</p>
          </div>
          <button className="px-12 py-6 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-red-900/50 transition-all flex items-center justify-center gap-3 group/btn active:scale-95 shrink-0">
            <AlertTriangle size={24} fill="currentColor" />
            Trigger Massive SOS
          </button>
        </div>
      </div>
    </div>
  );
}