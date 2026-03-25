import React, { useState, useEffect } from "react";
import { Users, Search, MoreVertical, ShieldCheck, Heart, Phone, Loader2, AlertCircle } from "lucide-react";
import { api } from "../../lib/supabase";
import { toast } from "sonner";

export function Needers() {
  const [needers, setNeeders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNeeders();
  }, []);

  const loadNeeders = async () => {
    try {
      setLoading(true);
      const { users } = await api.getUsersByRole("needer");
      setNeeders(users);
    } catch (error: any) {
      toast.error("Failed to load needers");
      console.error("Load needers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNeeders = needers.filter(needer => 
    needer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    needer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Needers Network</h1>
          <p className="text-slate-500 font-medium text-sm">Track all registered patients seeking blood ({needers.length} registered).</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search needers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-red-50 focus:border-red-100 transition-all font-bold text-sm w-full md:w-64" 
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center">
          <Loader2 size={48} className="text-red-600 animate-spin mb-4" />
          <p className="text-slate-400 font-bold">Loading needers...</p>
        </div>
      ) : filteredNeeders.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-400 font-bold text-lg mb-2">No needers found</p>
          <p className="text-slate-400 text-sm">Patients seeking blood will appear here once they register</p>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {["Name", "Phone", "Registered", "Status", ""].map(header => (
                  <th key={header} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredNeeders.map((needer, i) => (
                <tr key={needer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center ring-1 ring-orange-200">
                        <AlertCircle size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{needer.name}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Patient</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">{needer.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-400">
                    {new Date(needer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Seeking</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={16} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
