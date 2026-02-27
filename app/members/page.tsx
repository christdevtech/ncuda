'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { format } from 'date-fns';
import { Users, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function MembersPage() {
  const { members } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-stone-900">Member Directory</h1>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-full leading-5 bg-white placeholder-stone-500 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Link href={`/members/${member.id}`} key={member.id} className="block group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-4 mb-4">
                {member.profilePicture ? (
                  <img src={member.profilePicture} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-stone-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border-2 border-stone-200 text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{member.name}</h3>
                  <p className="text-sm text-stone-500">Joined {format(new Date(member.joinDate), 'MMM yyyy')}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-stone-600">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-stone-400 w-12">Email</span>
                  <span className="truncate">{member.email}</span>
                </p>
                {member.phone && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-stone-400 w-12">Phone</span>
                    <span>{member.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 text-lg">No members found matching &quot;{searchTerm}&quot;.</p>
        </div>
      )}
    </div>
  );
}
