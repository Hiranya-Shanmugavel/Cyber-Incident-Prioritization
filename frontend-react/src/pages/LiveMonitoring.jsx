import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Wifi, WifiOff, Skull, Bug, Globe, Lock, Server, Zap } from 'lucide-react';

// Simulated threat event templates
const THREAT_TEMPLATES = [
  { type: "Brute Force Attempt", severity: "HIGH", icon: Lock, source_ip: "185.220.101.%d", geo: "RU", protocol: "SSH", port: 22, desc: "Repeated failed authentication on SSH" },
  { type: "Malware C2 Beacon", severity: "CRITICAL", icon: Skull, source_ip: "91.215.85.%d", geo: "CN", protocol: "HTTPS", port: 443, desc: "Outbound callback to known C2 infrastructure" },
  { type: "Port Scan Detected", severity: "MEDIUM", icon: Globe, source_ip: "45.33.32.%d", geo: "US", protocol: "TCP", port: 0, desc: "Sequential port enumeration from external host" },
  { type: "Phishing Link Click", severity: "HIGH", icon: Bug, source_ip: "104.21.%d.%d", geo: "DE", protocol: "HTTPS", port: 443, desc: "User visited credential harvesting page" },
  { type: "Lateral Movement", severity: "CRITICAL", icon: Server, source_ip: "10.0.%d.%d", geo: "Internal", protocol: "SMB", port: 445, desc: "Anomalous SMB traffic between workstations" },
  { type: "DNS Tunneling", severity: "HIGH", icon: Zap, source_ip: "172.16.%d.%d", geo: "Internal", protocol: "DNS", port: 53, desc: "Unusually large DNS TXT queries to unknown domain" },
  { type: "Privilege Escalation", severity: "CRITICAL", icon: Shield, source_ip: "10.10.%d.%d", geo: "Internal", protocol: "RPC", port: 135, desc: "Unexpected admin token elevation on endpoint" },
  { type: "Data Exfiltration", severity: "CRITICAL", icon: AlertTriangle, source_ip: "192.168.%d.%d", geo: "Internal", protocol: "HTTPS", port: 443, desc: "Large outbound transfer to cloud storage API" },
  { type: "Credential Stuffing", severity: "MEDIUM", icon: Lock, source_ip: "203.0.113.%d", geo: "BR", protocol: "HTTPS", port: 443, desc: "High-volume login attempts with leaked credentials" },
  { type: "Suspicious PowerShell", severity: "HIGH", icon: Bug, source_ip: "10.0.1.%d", geo: "Internal", protocol: "WinRM", port: 5985, desc: "Encoded PowerShell execution detected on host" },
];

const SEVERITY_STYLES = {
  CRITICAL: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-500", badge: "bg-red-500 text-white" },
  HIGH: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500", badge: "bg-orange-500 text-white" },
  MEDIUM: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-500", badge: "bg-yellow-500 text-black" },
  LOW: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-500", badge: "bg-green-500 text-white" },
};

function generateThreatEvent() {
  const template = THREAT_TEMPLATES[Math.floor(Math.random() * THREAT_TEMPLATES.length)];
  const r = () => Math.floor(Math.random() * 254) + 1;
  const ip = template.source_ip.replace(/%d/g, () => r());
  return {
    id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString(),
    type: template.type,
    severity: template.severity,
    icon: template.icon,
    source_ip: ip,
    geo: template.geo,
    protocol: template.protocol,
    port: template.port === 0 ? Math.floor(Math.random() * 65535) : template.port,
    desc: template.desc,
  };
}

const LiveMonitoring = () => {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(true);
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0 });
  const feedRef = useRef(null);

  useEffect(() => {
    if (paused) return;

    // Generate initial burst of 3 events
    const initial = Array.from({ length: 3 }, generateThreatEvent);
    setEvents(initial);
    setStats(prev => ({
      total: prev.total + 3,
      critical: prev.critical + initial.filter(e => e.severity === "CRITICAL").length,
      high: prev.high + initial.filter(e => e.severity === "HIGH").length,
      medium: prev.medium + initial.filter(e => e.severity === "MEDIUM").length,
    }));

    // Stream new events every 2-5 seconds
    const interval = setInterval(() => {
      const event = generateThreatEvent();
      setEvents(prev => [event, ...prev].slice(0, 50)); // Keep max 50 events
      setStats(prev => ({
        total: prev.total + 1,
        critical: prev.critical + (event.severity === "CRITICAL" ? 1 : 0),
        high: prev.high + (event.severity === "HIGH" ? 1 : 0),
        medium: prev.medium + (event.severity === "MEDIUM" ? 1 : 0),
      }));
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [paused]);

  // Auto-scroll to top on new event
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [events.length]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaused(!paused)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
              paused
                ? "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
                : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
            }`}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <div className="flex items-center gap-2 text-xs">
            {connected ? (
              <><Wifi size={14} className="text-green-500" /><span className="text-green-500 font-bold">Stream Active</span></>
            ) : (
              <><WifiOff size={14} className="text-red-500" /><span className="text-red-500 font-bold">Disconnected</span></>
            )}
          </div>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-white">{stats.total}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Events</div>
        </div>
        <div className="bg-card border border-red-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-red-500">{stats.critical}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Critical</div>
        </div>
        <div className="bg-card border border-orange-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-orange-500">{stats.high}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">High</div>
        </div>
        <div className="bg-card border border-yellow-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-yellow-500">{stats.medium}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Medium</div>
        </div>
      </div>

      {/* Live Event Feed */}
      <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-cardSecondary flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Threat Event Feed</h3>
          <span className="text-[10px] text-gray-500 font-mono">{events.length} events buffered</span>
        </div>
        <div ref={feedRef} className="max-h-[500px] overflow-y-auto divide-y divide-gray-800/50">
          {events.map((event, i) => {
            const style = SEVERITY_STYLES[event.severity] || SEVERITY_STYLES.MEDIUM;
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className={`p-4 flex items-center gap-4 hover:bg-gray-800/30 transition-all ${
                  i === 0 ? "animate-pulse bg-gray-800/20" : ""
                }`}
              >
                <div className={`p-2 rounded-lg border ${style.bg} ${style.border} shrink-0`}>
                  <Icon size={16} className={style.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{event.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{event.desc}</div>
                </div>
                <div className="text-right shrink-0 hidden md:block">
                  <div className="font-mono text-xs text-gray-400">{event.source_ip}</div>
                  <div className="text-[10px] text-gray-600">{event.protocol}:{event.port} • {event.geo}</div>
                </div>
                <div className="text-[10px] text-gray-600 font-mono shrink-0 w-20 text-right">{event.timestamp}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LiveMonitoring;
