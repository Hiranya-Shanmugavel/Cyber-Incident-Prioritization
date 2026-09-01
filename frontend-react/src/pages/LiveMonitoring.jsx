import React from 'react';

const LiveMonitoring = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        Live Monitoring
      </h2>
      <p className="text-sm text-gray-400">Real-time incoming alerts and processing activity.</p>
    </div>
    <div className="bg-card border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center h-64 text-gray-500">
      <div className="animate-pulse mb-4">Listening for incoming threats...</div>
      <div className="text-sm border border-gray-700 px-4 py-2 rounded-full">Stream active</div>
    </div>
  </div>
);
export default LiveMonitoring;
