import React, { useState } from "react";
import { 
  Hospital as HospitalIcon, 
  MapPin, 
  Droplets, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Hospitals() {
  const [activeTab, setActiveTab] = useState("inventory"); // inventory, requests, logs
  const [requests, setRequests] = useState([
    { id: 1, bloodGroup: "O-", volume: "4 Units", status: "Critical", caller: "Trauma Center #1" },
    { id: 2, bloodGroup: "A+", volume: "2 Units", status: "Medium", caller: "Post-Op Surgery" },
    { id: 3, bloodGroup: "AB-", volume: "1 Unit", status: "Routine", caller: "Outpatient Clinic" },
  ]);

  const inventory = [
    { type: "O-", level: 12, max: 40, status: "Low", color: "red" },
    { type: "O+", level: 85, max: 100, status: "High", color: "emerald" },
    { type: "A+", level: 42, max: 80, status: "Medium", color: "orange" },
    { type: "B-", level: 5, max: 20, status: "Low", color: "red" },
  ];

  const handleAccept = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hospital Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-200 shrink-0">
            <HospitalIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none mb-1">City General Hospital</h1>
            <p className="text-slate-400 font-medium text-sm flex items-center gap-1">
              <MapPin size={14} className="text-slate-400" /> Trauma Level 1 • Downtown Hub
            </p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-3xl w-full max-w-sm border border-slate-200 shadow-inner">
          {[
            { id: "inventory", label: "Inventory" },
            { id: "requests", label: "Requests", count: requests.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "bg-white text-red-600 shadow-xl border border-slate-200" : "text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-slate-300 text-white'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "inventory" && (
          <motion.div 
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Inventory Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {inventory.map((item, i) => (
                <div key={item.type} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-110 transition-transform font-black">
                      {item.type}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Available</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">{item.level} <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Units</span></p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Threshold Level</span>
                      <span className={item.status === "Low" ? "text-red-500" : "text-emerald-500"}>
                        {Math.round((item.level / item.max) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.level / item.max) * 100}%` }}
                        className={`h-full ${item.status === "Low" ? "bg-red-500" : item.status === "Medium" ? "bg-orange-500" : "bg-emerald-500"}`}
                      />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${item.status === "Low" ? "text-red-500 animate-pulse" : item.status === "Medium" ? "text-orange-500" : "text-emerald-500"}`}>
                      {item.status} Availability
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col items-start gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                        <TrendingUp size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Forecast Insight</span>
                    </div>
                    <h3 className="text-3xl font-black max-w-sm">Supply predicted to drop by <span className="text-red-500 italic">25%</span> by Friday.</h3>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed">System recommends requesting 20 units of O- from the central regional hub before 4 PM today.</p>
                  </div>
                  <button className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-900/50 transition-all flex items-center gap-2 group/btn active:scale-95">
                    Order from Hub <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Life-Carriers</h3>
                  <button className="text-xs font-bold text-red-600">View Network Map</button>
                </div>
                <div className="space-y-4">
                  {[
                    { id: "LC-902", status: "In Transit", time: "ETA 12 mins", color: "blue" },
                    { id: "LC-854", status: "Refilling", time: "Ready in 40 mins", color: "slate" },
                    { id: "LC-772", status: "On Mission", time: "ETA 4 mins", color: "red" },
                  ].map((lc, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-red-600 transition-all">
                          <Zap size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{lc.id}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lc.status}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{lc.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "requests" && (
          <motion.div 
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Bell size={18} className="text-red-600" /> Pending Transfers
                </h3>
                <p className="text-xs font-bold text-slate-400">{requests.length} Incoming requests waiting response</p>
              </div>
              <div className="divide-y divide-slate-50">
                {requests.length > 0 ? requests.map((req) => (
                  <div key={req.id} className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center justify-center font-black text-red-600 text-sm">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{req.caller}</h4>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                          <Droplets size={12} fill="currentColor" /> {req.volume} • <CheckCircle2 size={12} className="text-emerald-500" /> Authorized
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Priority Status</p>
                        <p className={`text-sm font-black mt-1 uppercase tracking-wider ${req.status === 'Critical' ? 'text-red-500' : 'text-orange-500'}`}>
                          {req.status}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleAccept(req.id)}
                          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                        >
                          Accept & Dispatch
                        </button>
                        <button className="px-6 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-red-600 transition-all active:scale-95">
                          Hold
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center">
                    <p className="text-slate-400 font-medium italic">No pending requests to display.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
