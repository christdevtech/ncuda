'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Users, Activity } from 'lucide-react';

export default function HomePage() {
  const { announcements, events, members } = useStore();

  const recentAnnouncements = announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const activeEvents = events.filter(e => e.isActive).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-emerald-700 rounded-full opacity-50 blur-2xl"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Nchu Cultural and Development Association
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl mb-8 max-w-2xl">
            Welcome to the NCUDA member portal. Stay updated on our latest activities, track project contributions, and connect with fellow members.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/events" className="bg-white text-emerald-900 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center">
              View Active Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/members" className="bg-emerald-800 text-white border border-emerald-700 px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center">
              Member Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-sm font-medium">Total Members</p>
            <p className="text-2xl font-bold text-stone-900">{members.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-sm font-medium">Active Projects</p>
            <p className="text-2xl font-bold text-stone-900">{events.filter(e => e.isActive).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-sm font-medium">Total Events</p>
            <p className="text-2xl font-bold text-stone-900">{events.length}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Announcements */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl font-bold text-stone-900">Latest Announcements</h2>
            <Link href="/announcements" className="text-emerald-700 hover:text-emerald-800 font-medium text-sm flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                  <div className="text-sm text-stone-500 mb-2">{format(new Date(announcement.date), 'MMMM d, yyyy')}</div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{announcement.title}</h3>
                  <p className="text-stone-600 line-clamp-2">{announcement.content}</p>
                </div>
              ))
            ) : (
              <p className="text-stone-500 italic">No recent announcements.</p>
            )}
          </div>
        </section>

        {/* Active Events/Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl font-bold text-stone-900">Active Projects</h2>
            <Link href="/events" className="text-emerald-700 hover:text-emerald-800 font-medium text-sm flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {activeEvents.length > 0 ? (
              activeEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="block bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {event.type}
                    </span>
                    <span className="text-sm text-stone-500">{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">{event.title}</h3>
                  <p className="text-stone-600 line-clamp-2 mb-4">{event.description}</p>
                  {event.requiresContribution && event.targetAmount && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-500">Target</span>
                        <span className="font-medium">${event.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-stone-500 italic">No active projects at the moment.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
