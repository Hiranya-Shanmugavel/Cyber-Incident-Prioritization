import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, List, Activity, ShieldCheck, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: List },
    { name: 'Priority Queue', path: '/queue', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: ShieldAlert },
    { name: 'Settings', path: '/settings', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-cardSecondary border-r border-gray-800 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3 text-red-500">
          <ShieldAlert size={28} />
          <div>
            <h1 className="font-display font-bold text-xl leading-none text-white">ThreatPulse</h1>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Security Ops</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Monitoring</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">HS</div>
          <div className="text-sm">
            <div className="font-medium text-white truncate w-24">H. Shanmugavel</div>
            <div className="text-xs text-gray-500">L2 Analyst</div>
          </div>
        </div>
        <button 
          onClick={() => alert("Logged out!")}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
