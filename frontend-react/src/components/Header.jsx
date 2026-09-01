import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  const searchRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-20 bg-card border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-2xl font-display font-bold">Security Command Center</h2>
        <p className="text-sm text-gray-400">Real-time threat monitoring & incident prioritization</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search incidents... (Cmd+K)"
            className="bg-background border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card animate-pulse"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-cardSecondary border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-white">Notifications</h3>
                <span className="text-xs text-primary cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">CRITICAL</span>
                    <span className="text-[10px] text-gray-500">2m ago</span>
                  </div>
                  <p className="text-sm text-gray-300">Ransomware activity detected on Auth Server.</p>
                </div>
                <div className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">SYSTEM</span>
                    <span className="text-[10px] text-gray-500">1h ago</span>
                  </div>
                  <p className="text-sm text-gray-300">AI Scoring Engine successfully retuned.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg text-sm ml-4 transition-colors shadow-lg shadow-primary/20" onClick={() => window.dispatchEvent(new Event("openNewIncident"))}>+ New Incident</button></header>
  );
};
export default Header;
