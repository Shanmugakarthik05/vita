import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Droplets, 
  AlertTriangle, 
  Hospital, 
  Settings, 
  Search, 
  Bell, 
  Heart,
  Home,
  Menu,
  X,
  UserCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/sos", label: "Emergency SOS", icon: AlertTriangle, variant: "urgent" },
  { path: "/donors", label: "Donors", icon: Users },
  { path: "/inventory", label: "Inventory", icon: Droplets },
  { path: "/hospitals", label: "Hospitals", icon: Hospital },
  { path: "/admin", label: "Admin Panel", icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Determine if we're in the "Consumer Flow" (Home, Results, Status)
  const isConsumerFlow = ["/", "/results", "/status"].includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col font-sans text-slate-900 selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      {/* Global Shortage Alert Banner */}
      <div className="w-full bg-orange-50 border-b border-orange-100 py-2 px-6 flex items-center justify-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 animate-pulse">
          <AlertTriangle size={14} className="text-orange-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-900">
            ⚠ Blood shortage expected in 2 days
          </span>
        </div>
        <button className="text-[10px] font-black text-orange-600 underline uppercase tracking-widest hover:text-orange-700">View Details</button>
      </div>

      {/* Dynamic Header */}
      <header className={cn(
        "h-20 border-b transition-all duration-300 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-white/80",
        isConsumerFlow ? "border-transparent" : "border-slate-100"
      )}>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-200 group-hover:scale-110 transition-transform">
              <Heart size={22} fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">VITA</h1>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Life Sync Network</p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav for Admin views or quick links */}
        {!isConsumerFlow && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {navItems.slice(1, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  location.pathname === item.path 
                    ? "bg-white text-red-600 shadow-sm border border-slate-100" 
                    : "text-slate-400 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
            <UserCircle size={16} /> Login
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 transition-all shadow-sm"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile/Full Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 bg-white border-b border-slate-100 z-40 p-8 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navigation</p>
                <div className="grid grid-cols-1 gap-2">
                  {navItems.map(item => (
                    <Link 
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                        location.pathname === item.path ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="font-bold">{item.label}</span>
                      {item.variant === "urgent" && <span className="ml-auto w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Actions</p>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl font-bold text-sm">
                    Register as Donor <ArrowRight size={16} />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm">
                    Find Nearest Bank <Search size={16} />
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 bg-red-50 rounded-[32px] p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-red-900 mb-2">Donate and Save Lives</h3>
                  <p className="text-sm text-red-700 font-medium mb-6">Join 85,000+ heroes today.</p>
                  <button className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-200">
                    Get Started
                  </button>
                </div>
                <Heart size={120} className="absolute -bottom-10 -right-10 text-red-100/50 rotate-12" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          <Outlet />
        </div>
      </main>

      {/* Modern Mini Footer */}
      <footer className="px-12 py-8 bg-white border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
            <Heart size={16} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">© 2026 VITA Blood System</p>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest">Privacy</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest">Protocol</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest">API</a>
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">All Nodes Operational</span>
        </div>
      </footer>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
