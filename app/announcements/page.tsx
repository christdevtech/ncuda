'use client';

import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const { announcements } = useStore();
  
  const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-stone-900">Announcements</h1>
      </div>

      <div className="space-y-6">
        {sortedAnnouncements.length > 0 ? (
          sortedAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
              <div className="text-sm font-medium text-emerald-700 mb-3">
                {format(new Date(announcement.date), 'EEEE, MMMM d, yyyy')}
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">{announcement.title}</h2>
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{announcement.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-lg">No announcements available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
