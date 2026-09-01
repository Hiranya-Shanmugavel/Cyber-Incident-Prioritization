import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

const dataTrend = [
  { day: '01 Sep', incidents: 4 },
  { day: '02 Sep', incidents: 7 },
  { day: '03 Sep', incidents: 2 },
  { day: '04 Sep', incidents: 10 },
  { day: '05 Sep', incidents: 5 },
  { day: '06 Sep', incidents: 8 },
  { day: '07 Sep', incidents: 14 },
];

const dataAssets = [
  { name: 'Prod DB', count: 24 },
  { name: 'Auth API', count: 18 },
  { name: 'Email Gateway', count: 12 },
  { name: 'VPN Gateway', count: 8 },
  { name: 'Admin Portal', count: 5 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-white">SOC Analytics</h2>
        <p className="text-sm text-gray-400">Historical threat trends and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-gray-400 mb-2"><Activity size={18}/> Mean Time to Detect</div>
          <div className="text-3xl font-display font-bold text-white">4.2m</div>
          <div className="text-sm text-green-500 mt-1">↓ 12% from last week</div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-gray-400 mb-2"><Clock size={18}/> Mean Time to Respond</div>
          <div className="text-3xl font-display font-bold text-white">18.5m</div>
          <div className="text-sm text-green-500 mt-1">↓ 5% from last week</div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3 text-gray-400 mb-2"><ShieldAlert size={18}/> Resolution Rate</div>
          <div className="text-3xl font-display font-bold text-white">96.4%</div>
          <div className="text-sm text-green-500 mt-1">↑ 2% from last week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-card p-6 rounded-xl border border-gray-800 h-[400px] flex flex-col">
          <h3 className="font-display font-bold text-lg text-white mb-6">Incident Volume (7 Days)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4d8dff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4d8dff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false}/>
                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }}/>
                <Area type="monotone" dataKey="incidents" stroke="#4d8dff" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets Chart */}
        <div className="bg-card p-6 rounded-xl border border-gray-800 h-[400px] flex flex-col">
          <h3 className="font-display font-bold text-lg text-white mb-6">Top Targeted Assets</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataAssets} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={100}/>
                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }}/>
                <Bar dataKey="count" fill="#ff4d61" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
