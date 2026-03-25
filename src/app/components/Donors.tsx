import React, { useEffect, useState } from "react";
import { Users, Search, MoreVertical, ShieldCheck, Heart, Star } from "lucide-react";
import { api } from "../../lib/supabase";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  bloodGroup: string;
  location: string;
  totalDonations: number;
  rating: number;
  isAlcoholic: boolean;
  isSmoker: boolean;
  hasChronicIllness: boolean;
  lastLogin: string;
}

export function Donors() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { users: allUsers } = await api.getAllUsers();
      setUsers(allUsers);
    } catch (error: any) {
      console.error("Load users error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}
          />
        ))}
        <span className="ml-1 text-xs font-black text-slate-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Donor Network</h1>
          <p className="text-slate-500 font-medium text-sm">All registered users across the Blood Bridge network.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-red-50 focus:border-red-100 transition-all font-bold text-sm w-full md:w-64" 
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-slate-400 font-medium">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 text-center">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-xl font-black text-slate-900 mb-2">No users found</p>
          <p className="text-slate-400 text-sm mt-2 mb-6">
            {searchQuery 
              ? "Try a different search term" 
              : "Users will appear here once they login"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-200 transition-all active:scale-95"
            >
              Login to Register
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {["Name", "Role", "Blood Type", "Location", "Donations", "Rating", "Health Status"].map(header => (
                  <th key={header} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">{user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      user.role === 'donor' ? 'bg-emerald-50 text-emerald-700' :
                      user.role === 'needer' ? 'bg-blue-50 text-blue-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {user.bloodGroup ? (
                      <span className="w-12 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">
                        {user.bloodGroup}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 font-medium">Not set</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-600">
                      {user.location || "Not specified"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Heart size={14} className="text-red-500" fill="currentColor" />
                      <span className="text-sm font-black text-slate-900">{user.totalDonations}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {renderStars(user.rating)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      {user.isAlcoholic && (
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">Alcoholic</span>
                      )}
                      {user.isSmoker && (
                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Smoker</span>
                      )}
                      {user.hasChronicIllness && (
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">Chronic Illness</span>
                      )}
                      {!user.isAlcoholic && !user.isSmoker && !user.hasChronicIllness && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Healthy</span>
                        </div>
                      )}
                    </div>
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