import React, { useEffect, useRef } from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  const searchRef = useRef(null);

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
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
        </button>
      </div>
    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg text-sm ml-4 transition-colors shadow-lg shadow-primary/20" onClick={() => window.dispatchEvent(new Event("openNewIncident"))}>+ New Incident</button></header>
  );
};
export default Header;
