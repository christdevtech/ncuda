import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  profilePicture?: string;
};

export type EventType = 'wedding' | 'funeral' | 'project' | 'meeting' | 'other';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  isActive: boolean;
  requiresContribution: boolean;
  targetAmount?: number;
  media: string[]; // URLs to images/videos
};

export type Contribution = {
  id: string;
  eventId: string;
  memberId: string;
  amount: number;
  date: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type AppState = {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  announcements: Announcement[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  addContribution: (contribution: Omit<Contribution, 'id'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
};

// Initial mock data to show the app working
const initialMembers: Member[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', joinDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', joinDate: '2023-03-22' },
  { id: '3', name: 'Peter Jones', email: 'peter@example.com', phone: '555-123-4567', joinDate: '2023-06-10' },
];

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Community Hall Renovation',
    description: 'Ongoing project to renovate the main community hall.',
    date: '2024-01-01',
    type: 'project',
    isActive: true,
    requiresContribution: true,
    targetAmount: 5000,
    media: ['https://picsum.photos/seed/hall1/800/600', 'https://picsum.photos/seed/hall2/800/600'],
  },
  {
    id: '2',
    title: 'Annual General Meeting 2023',
    description: 'End of year gathering and report.',
    date: '2023-12-15',
    type: 'meeting',
    isActive: false,
    requiresContribution: false,
    media: ['https://picsum.photos/seed/agm/800/600'],
  },
];

const initialContributions: Contribution[] = [
  { id: '1', eventId: '1', memberId: '1', amount: 150, date: '2024-01-10' },
  { id: '2', eventId: '1', memberId: '2', amount: 200, date: '2024-01-12' },
];

const initialAnnouncements: Announcement[] = [
  { id: '1', title: 'Welcome to the new NCUDA Portal', content: 'We are excited to launch our new digital home for all members.', date: '2024-02-01' },
  { id: '2', title: 'Upcoming Project Deadline', content: 'Please remember to submit your contributions for the Community Hall Renovation by the end of the month.', date: '2024-02-15' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      members: initialMembers,
      events: initialEvents,
      contributions: initialContributions,
      announcements: initialAnnouncements,
      addMember: (member) => set((state) => ({ members: [...state.members, { ...member, id: Math.random().toString(36).substr(2, 9) }] })),
      updateMember: (id, member) => set((state) => ({ members: state.members.map((m) => (m.id === id ? { ...m, ...member } : m)) })),
      addEvent: (event) => set((state) => ({ events: [...state.events, { ...event, id: Math.random().toString(36).substr(2, 9) }] })),
      updateEvent: (id, event) => set((state) => ({ events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)) })),
      addContribution: (contribution) => set((state) => ({ contributions: [...state.contributions, { ...contribution, id: Math.random().toString(36).substr(2, 9) }] })),
      addAnnouncement: (announcement) => set((state) => ({ announcements: [...state.announcements, { ...announcement, id: Math.random().toString(36).substr(2, 9) }] })),
    }),
    {
      name: 'ncuda-storage',
    }
  )
);
