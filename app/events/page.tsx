'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const { events } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  const filteredEvents = events.filter(e => {
    if (filter === 'active') return e.isActive;
    if (filter === 'past') return !e.isActive;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-stone-900">Events & Projects</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-stone-200 shadow-sm">
          <Filter className="w-4 h-4 text-stone-400 ml-3" />
          <button 
            onClick={() => setFilter('all')}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", filter === 'all' ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:text-stone-900")}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", filter === 'active' ? "bg-emerald-100 text-emerald-800" : "text-stone-500 hover:text-stone-900")}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('past')}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", filter === 'past' ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:text-stone-900")}
          >
            Past
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className="block group h-full">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all h-full flex flex-col">
              {event.media && event.media.length > 0 ? (
                <div className="h-48 w-full overflow-hidden">
                  <img src={event.media[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-48 w-full bg-stone-100 flex items-center justify-center text-stone-300">
                  <CalendarIcon className="w-12 h-12" />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className={cn(
                    "inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider",
                    event.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
                  )}>
                    {event.type}
                  </span>
                  {event.isActive && (
                    <span className="flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> Active
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">{event.title}</h3>
                <p className="text-sm text-stone-500 mb-4 flex-1 line-clamp-3">{event.description}</p>
                
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-sm">
                  <span className="text-stone-500 font-medium">{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  {event.requiresContribution && (
                    <span className="font-bold text-emerald-700">Contributions Required</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 text-lg">No events found for this filter.</p>
        </div>
      )}
    </div>
  );
}
