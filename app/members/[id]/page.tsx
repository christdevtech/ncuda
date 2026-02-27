'use client';

import { useStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { User, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MemberProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { members, contributions, events } = useStore();
  
  const member = members.find(m => m.id === id);
  
  if (!member) {
    return <div className="text-center py-12">Member not found</div>;
  }

  const memberContributions = contributions.filter(c => c.memberId === id);
  const totalContributed = memberContributions.reduce((sum, c) => sum + c.amount, 0);

  // Get events this member has contributed to
  const contributedEvents = events.filter(e => memberContributions.some(c => c.eventId === e.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/members" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="h-32 bg-emerald-900 w-full relative">
          <div className="absolute -bottom-16 left-8">
            {member.profilePicture ? (
              <img src={member.profilePicture} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-white bg-white" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-stone-100 flex items-center justify-center border-4 border-white text-stone-400">
                <User className="w-16 h-16" />
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">{member.name}</h1>
          <p className="text-stone-500 flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4" /> Member since {format(new Date(member.joinDate), 'MMMM yyyy')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Contact Information</h3>
              <div className="flex items-center gap-3 text-stone-700">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500">
                  <Mail className="w-5 h-5" />
                </div>
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3 text-stone-700">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Financial Overview</h3>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-emerald-800 text-sm font-medium mb-1">Total Lifetime Contributions</p>
                <p className="text-3xl font-bold text-emerald-900">${totalContributed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Contribution History</h2>
        
        {memberContributions.length > 0 ? (
          <div className="space-y-6">
            {memberContributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(contribution => {
              const event = events.find(e => e.id === contribution.eventId);
              return (
                <div key={contribution.id} className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:bg-stone-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-stone-900">{event?.title || 'Unknown Event'}</h4>
                    <p className="text-sm text-stone-500">{format(new Date(contribution.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">+${contribution.amount.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-stone-500 italic">No contributions recorded yet.</p>
        )}
      </div>
    </div>
  );
}
