'use client';

import { useStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Image as ImageIcon, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { events, members, contributions } = useStore();
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return <div className="text-center py-12">Event not found</div>;
  }

  const eventContributions = contributions.filter(c => c.eventId === id);
  const totalCollected = eventContributions.reduce((sum, c) => sum + c.amount, 0);
  const progress = event.targetAmount ? Math.min(100, (totalCollected / event.targetAmount) * 100) : 0;

  // For projects/events requiring contributions, list all members and their status
  // Members are expected to contribute if they joined before or during the event
  const eventDate = new Date(event.date);
  const expectedContributors = members.filter(m => new Date(m.joinDate) <= eventDate || event.isActive);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href="/events" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 md:p-12 border-b border-stone-100">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-800 text-xs font-semibold rounded-full uppercase tracking-wider">
              {event.type}
            </span>
            {event.isActive && (
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                Active
              </span>
            )}
            <span className="inline-block px-3 py-1 bg-stone-50 text-stone-500 text-xs font-semibold rounded-full uppercase tracking-wider">
              {format(new Date(event.date), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">{event.title}</h1>
          <p className="text-lg text-stone-600 max-w-3xl leading-relaxed">{event.description}</p>
        </div>

        {/* Financial Progress (if applicable) */}
        {event.requiresContribution && (
          <div className="p-8 md:p-12 bg-stone-50 border-b border-stone-100">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Financial Progress</h2>
            
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Total Collected</p>
                  <p className="text-4xl font-bold text-emerald-700">${totalCollected.toLocaleString()}</p>
                </div>
                {event.targetAmount && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Target</p>
                    <p className="text-2xl font-bold text-stone-900">${event.targetAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              {event.targetAmount && (
                <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        {event.media && event.media.length > 0 && (
          <div className="p-8 md:p-12 border-b border-stone-100">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-stone-400" /> Media Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.media.map((url, index) => (
                <div key={index} className="aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contributions List */}
        {event.requiresContribution && (
          <div className="p-8 md:p-12">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Member Contributions</h2>
            
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-sm font-bold text-stone-500 uppercase tracking-wider">
                    <th className="p-4">Member</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {expectedContributors.map(member => {
                    const memberContribution = eventContributions.find(c => c.memberId === member.id);
                    const hasContributed = !!memberContribution;
                    
                    return (
                      <tr key={member.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4">
                          <Link href={`/members/${member.id}`} className="font-medium text-stone-900 hover:text-emerald-700">
                            {member.name}
                          </Link>
                        </td>
                        <td className="p-4">
                          {hasContributed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 text-sm font-medium">
                              <CheckCircle2 className="w-4 h-4" /> Contributed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-stone-400 text-sm font-medium">
                              <Circle className="w-4 h-4" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-stone-900">
                          {hasContributed ? `$${memberContribution.amount.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
