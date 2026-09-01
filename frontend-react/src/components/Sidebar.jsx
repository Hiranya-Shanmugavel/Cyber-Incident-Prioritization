import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileWarning, Trophy, Radio, 
  Brain, BarChart3, Users, History, Settings, 
  LogOut, ShieldAlert, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getDashboard } from '../services/api';

const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({ active: 0, critical: 0 });

  useEffect(() => {
    getDashboard().then(res => {
      setStats({
        active: res.data.active_incidents || 0,
        critical: res.data.critical_threats || 0
      });
    }).catch(() => {});
  }, []);

  const menuSections = [
    {
      title: 'MONITORING',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Incidents', path: '/incidents', icon: FileWarning, badge: stats.active },
        { name: 'Priority Queue', path: '/queue', icon: Trophy, badge: stats.critical, badgeType: 'critical' },
        { name: 'Live Monitoring', path: '/live', icon: Radio, isLive: true },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { name: 'AI Decision Explanation', path: '/ai-explanation', icon: Brain },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Analysts', path: '/analysts', icon: Users },
        { name: 'Activity Logs', path: '/activity-logs', icon: History },
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  const asideClass = `bg-cardSecondary border-r border-gray-800 flex flex-col transition-all duration-300 z-40 shrink-0
    ${collapsed ? 'w-20' : 'w-64'} 
    ${isMobileOpen ? 'fixed inset-y-0 left-0' : 'hidden md:flex relative'}`;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      <aside className={asideClass}>
        <div className="h-20 flex items-center px-6 border-b border-gray-800 shrink-0 justify-between">
          <div className="flex items-center gap-3 text-red-500 overflow-hidden">
            <ShieldAlert size={28} className="shrink-0" />
            {!collapsed && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <h1 className="font-display font-bold text-xl leading-none text-white">ThreatPulse</h1>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Security Ops</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed ? (
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2 whitespace-nowrap">
                  {section.title}
                </div>
              ) : (
                <div className="h-4 mb-3 border-b border-gray-800/50 mx-2"></div>
              )}
              
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-2 border-transparent'
                    }`
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  
                  {!collapsed && (
                    <span className="flex-1 whitespace-nowrap">{item.name}</span>
                  )}

                  {!collapsed && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeType === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.isLive && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[9px] font-bold text-red-500 tracking-wider">LIVE</span>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1.5 bg-gray-800 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl flex items-center gap-2">
                      {item.name}
                      {item.badge > 0 && <span className="text-[10px] bg-gray-700 px-1.5 rounded">{item.badge}</span>}
                      {item.isLive && <span className="text-[10px] text-red-400">LIVE</span>}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center p-2 text-gray-500 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors w-full"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className={`flex items-center justify-between ${collapsed ? 'flex-col gap-4' : 'gap-3 mt-2'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">HS</div>
              {!collapsed && (
                <div className="text-sm whitespace-nowrap overflow-hidden">
                  <div className="font-medium text-white truncate w-24">H. Shanmugavel</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">L2 Analyst</div>
                </div>
              )}
            </div>
            <button 
              onClick={() => alert("Logged out!")}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group relative"
              title="Log out"
            >
              <LogOut size={18} />
              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl">
                  Log out
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
