import React from "react";
import { Settings, ShieldCheck, Database, Bell, LayoutDashboard, Globe, AlertCircle, Trash2, Edit3, MoreVertical, Plus } from "lucide-react";

export function Admin() {
  const users = [
    { id: 1, name: "Admin Thorne", role: "Superuser", lastActive: "2 mins ago", status: "Online" },
    { id: 2, name: "Hospital Liaison", role: "Manager", lastActive: "4 hours ago", status: "Offline" },
    { id: 3, name: "Inventory Controller", role: "Manager", lastActive: "1 day ago", status: "Offline" },
    { id: 4, name: "Network Security", role: "Superuser", lastActive: "6 mins ago", status: "Online" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Network Control Panel</h1>
          <p className="text-slate-500 font-medium text-sm">Configure global system settings and user permissions.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Audit Logs</button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">New User</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {[
            { label: "System Core", icon: Settings, count: 12, active: true },
            { label: "User Access", icon: ShieldCheck, count: 8 },
            { label: "Data Sync", icon: Database, count: 42 },
            { label: "Alert Config", icon: Bell, count: 5 },
            { label: "Global Scope", icon: Globe, count: 2 },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${
              item.active ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
            }`}>
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${item.active ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"}`}>{item.count}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 overflow-hidden relative group">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest px-2">Network Superusers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
              {users.map((u, i) => (
                <div key={u.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{u.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{u.role} • {u.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${u.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-[40px] p-8 flex items-center justify-between gap-8 relative overflow-hidden">
             <div className="relative z-10 flex-1">
               <div className="flex items-center gap-3 mb-4">
                 <AlertCircle size={20} className="text-red-600" />
                 <h3 className="text-lg font-black text-red-900 uppercase tracking-widest">Master Shutdown Mode</h3>
               </div>
               <p className="text-sm text-red-700 font-medium max-w-lg mb-6 leading-relaxed">Emergency override to suspend all network activities and lock hospital interfaces during a global cybersecurity protocol or system maintenance.</p>
               <button className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 active:scale-95 transition-all">Enable System Lock</button>
             </div>
             <AlertCircle size={160} className="absolute -bottom-10 -right-10 text-red-100 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
