import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, List, Activity, Settings, Users, History } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: List },
    { name: 'Priority Queue', path: '/queue', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-cardSecondary border-r border-gray-800 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3 text-red-500">
          <ShieldAlert size={28} />
          <div>
            <h1 className="font-display font-bold text-xl leading-none text-white">ThreatPulse</h1>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Security Ops</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
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
    </aside>
  );
};
export default Sidebar;
