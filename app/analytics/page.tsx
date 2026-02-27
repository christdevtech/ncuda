'use client';

import { useStore } from '@/lib/store';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const { members, events, contributions } = useStore();

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  
  // Prepare data for events chart
  const eventsWithContributions = events.filter(e => e.requiresContribution).map(event => {
    const collected = contributions.filter(c => c.eventId === event.id).reduce((sum, c) => sum + c.amount, 0);
    return {
      name: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
      collected,
      target: event.targetAmount || 0,
    };
  });

  // Prepare data for contribution distribution
  const memberContributionTotals = members.map(member => {
    const total = contributions.filter(c => c.memberId === member.id).reduce((sum, c) => sum + c.amount, 0);
    return { name: member.name, value: total };
  }).filter(m => m.value > 0).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 contributors

  const COLORS = ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-stone-900">Analytics Dashboard</h1>
      </div>

      {/* High-level stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Funds Raised</h3>
          </div>
          <p className="text-4xl font-bold text-stone-900">${totalContributions.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Active Contributors</h3>
          </div>
          <p className="text-4xl font-bold text-stone-900">
            {new Set(contributions.map(c => c.memberId)).size}
            <span className="text-lg text-stone-400 font-normal ml-2">/ {members.length}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Funded Projects</h3>
          </div>
          <p className="text-4xl font-bold text-stone-900">
            {events.filter(e => e.requiresContribution).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Project Funding */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Project Funding Status</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventsWithContributions}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value}`, 'Amount']}
                />
                <Bar dataKey="collected" name="Collected" fill="#047857" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Contributors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Top Contributors</h2>
          <div className="h-80 w-full flex items-center justify-center">
            {memberContributionTotals.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memberContributionTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {memberContributionTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, 'Contributed']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-stone-500 italic">No contribution data available.</p>
            )}
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {memberContributionTotals.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-stone-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
