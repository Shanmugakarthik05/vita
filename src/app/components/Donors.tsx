import React from "react";
import { Users, Search, MoreVertical, ShieldCheck, Heart } from "lucide-react";

export function Donors() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Donor Network</h1>
          <p className="text-slate-500 font-medium text-sm">Manage and track your global donor base.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="Search donors..." className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-red-50 focus:border-red-100 transition-all font-bold text-sm w-full md:w-64" />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 active:scale-95 transition-all">Add Donor</button>
        </div>
      </div>
      
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              {["Name", "Type", "Location", "Last Donation", "Status", ""].map(header => (
                <th key={header} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-slate-100">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">Donor #{i + 100}</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Verified Hero</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6"><span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">O-</span></td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">Downtown City Center</td>
                <td className="px-8 py-6 text-sm font-medium text-slate-400">2 months ago</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Available</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right"><button className="p-2 hover:bg-white rounded-xl text-slate-300"><MoreVertical size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
