import React from "react";
import { Droplets, Filter, MoreVertical, LayoutGrid, Search, AlertCircle, TrendingUp } from "lucide-react";

export function Inventory() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Blood Inventory</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor regional supply levels and inventory health.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 transition-all shadow-sm"><Filter size={20} /></button>
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 transition-all shadow-sm"><LayoutGrid size={20} /></button>
          <div className="relative">
            <input type="text" placeholder="Search facility..." className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-red-50 focus:border-red-100 transition-all font-bold text-sm w-full md:w-64" />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type, i) => (
          <div key={type} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-red-50 hover:border-red-100 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-110 transition-transform font-black">
                {type}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Supply</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{80 + (i * 12)} <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Units</span></p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Critical Threshold</span>
                <span className="text-red-500">40 Units</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className={`h-full ${i === 3 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${60 + (i * 5)}%` }} />
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${i === 3 ? "text-red-500" : "text-emerald-500"}`}>
                {i === 3 ? "⚠ Low Availability" : "Optimal Levels"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
