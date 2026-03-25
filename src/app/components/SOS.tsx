import React from "react";
import { AlertTriangle, Zap, MapPin, Phone, Hospital, User, ShieldCheck } from "lucide-react";

export function SOS() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-red-600 rounded-[32px] mx-auto flex items-center justify-center shadow-3xl shadow-red-300 relative">
          <AlertTriangle size={44} className="text-white animate-pulse" fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-[0.9]">Emergency <span className="text-red-600 italic">Broadcast</span></h1>
        <p className="text-slate-400 font-medium text-lg max-w-md mx-auto">Trigger an immediate network-wide alert for critical shortages.</p>
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
