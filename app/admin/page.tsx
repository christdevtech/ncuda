'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Settings, Plus, Users, Calendar, Bell, DollarSign, UserCog, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'edit-member' | 'events' | 'contributions' | 'announcements'>('members');
  
  const { addMember, updateMember, addEvent, addContribution, addAnnouncement, members, events } = useStore();

  const [memberForm, setMemberForm] = useState({ name: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0] });
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: new Date().toISOString().split('T')[0], type: 'project' as any, isActive: true, requiresContribution: false, targetAmount: '' });
  const [contributionForm, setContributionForm] = useState({ memberId: '', eventId: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0] });

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [editMemberForm, setEditMemberForm] = useState({ name: '', email: '', phone: '', joinDate: '', profilePicture: '' });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    addMember(memberForm);
    setMemberForm({ name: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0] });
    alert('Member added successfully!');
  };

  const handleSelectMemberToEdit = (id: string) => {
    setSelectedMemberId(id);
    const member = members.find(m => m.id === id);
    if (member) {
      setEditMemberForm({
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        joinDate: member.joinDate,
        profilePicture: member.profilePicture || ''
      });
    }
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    updateMember(selectedMemberId, editMemberForm);
    alert('Member updated successfully!');
    setSelectedMemberId('');
    setEditMemberForm({ name: '', email: '', phone: '', joinDate: '', profilePicture: '' });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      ...eventForm,
      targetAmount: eventForm.targetAmount ? Number(eventForm.targetAmount) : undefined,
      media: []
    });
    setEventForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], type: 'project', isActive: true, requiresContribution: false, targetAmount: '' });
    alert('Event added successfully!');
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionForm.memberId || !contributionForm.eventId || !contributionForm.amount) {
      alert('Please fill all required fields');
      return;
    }
    addContribution({
      memberId: contributionForm.memberId,
      eventId: contributionForm.eventId,
      amount: Number(contributionForm.amount),
      date: contributionForm.date
    });
    setContributionForm({ memberId: '', eventId: '', amount: '', date: new Date().toISOString().split('T')[0] });
    alert('Contribution recorded successfully!');
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement(announcementForm);
    setAnnouncementForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
    alert('Announcement published successfully!');
  };

  const tabs = [
    { id: 'members', label: 'Add Member', icon: Users },
    { id: 'edit-member', label: 'Edit Member', icon: UserCog },
    { id: 'events', label: 'Create Event/Project', icon: Calendar },
    { id: 'contributions', label: 'Record Contribution', icon: DollarSign },
    { id: 'announcements', label: 'Post Announcement', icon: Bell },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-stone-800 text-white rounded-full flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-500">Manage NCUDA members, events, and records.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="flex border-b border-stone-200 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-stone-50 text-emerald-700 border-b-2 border-emerald-700" 
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === 'members' && (
            <form onSubmit={handleAddMember} className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Register New Member</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Full Name</label>
                  <input required type="text" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Email Address</label>
                  <input required type="email" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Phone Number</label>
                  <input type="tel" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Join Date</label>
                  <input required type="date" value={memberForm.joinDate} onChange={e => setMemberForm({...memberForm, joinDate: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
              </div>
              
              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add Member
              </button>
            </form>
          )}

          {activeTab === 'edit-member' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Edit Existing Member</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Select Member</label>
                <select 
                  value={selectedMemberId} 
                  onChange={e => handleSelectMemberToEdit(e.target.value)} 
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                >
                  <option value="">-- Select a member to edit --</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              {selectedMemberId && (
                <form onSubmit={handleUpdateMember} className="space-y-6 pt-4 border-t border-stone-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Full Name</label>
                      <input required type="text" value={editMemberForm.name} onChange={e => setEditMemberForm({...editMemberForm, name: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Email Address</label>
                      <input required type="email" value={editMemberForm.email} onChange={e => setEditMemberForm({...editMemberForm, email: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Phone Number</label>
                      <input type="tel" value={editMemberForm.phone} onChange={e => setEditMemberForm({...editMemberForm, phone: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-700">Join Date</label>
                      <input required type="date" value={editMemberForm.joinDate} onChange={e => setEditMemberForm({...editMemberForm, joinDate: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Profile Picture URL</label>
                    <input type="url" placeholder="https://example.com/photo.jpg" value={editMemberForm.profilePicture} onChange={e => setEditMemberForm({...editMemberForm, profilePicture: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    <p className="text-xs text-stone-500">Provide a direct link to an image (e.g., from an image hosting service).</p>
                  </div>
                  
                  <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <form onSubmit={handleAddEvent} className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Create Event or Project</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Title</label>
                <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea required rows={4} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Date</label>
                  <input required type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Type</label>
                  <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                    <option value="project">Project</option>
                    <option value="meeting">Meeting</option>
                    <option value="wedding">Wedding</option>
                    <option value="funeral">Funeral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={eventForm.isActive} onChange={e => setEventForm({...eventForm, isActive: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-stone-700">Is Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={eventForm.requiresContribution} onChange={e => setEventForm({...eventForm, requiresContribution: e.target.checked})} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-stone-700">Requires Contribution</span>
                </label>
              </div>

              {eventForm.requiresContribution && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Target Amount ($)</label>
                  <input type="number" value={eventForm.targetAmount} onChange={e => setEventForm({...eventForm, targetAmount: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. 5000" />
                </div>
              )}
              
              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Create Event
              </button>
            </form>
          )}

          {activeTab === 'contributions' && (
            <form onSubmit={handleAddContribution} className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Record Financial Contribution</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Select Member</label>
                <select required value={contributionForm.memberId} onChange={e => setContributionForm({...contributionForm, memberId: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                  <option value="">-- Select a member --</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Select Event/Project</label>
                <select required value={contributionForm.eventId} onChange={e => setContributionForm({...contributionForm, eventId: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                  <option value="">-- Select an event --</option>
                  {events.filter(e => e.requiresContribution).map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Amount ($)</label>
                  <input required type="number" min="0" step="0.01" value={contributionForm.amount} onChange={e => setContributionForm({...contributionForm, amount: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Date</label>
                  <input required type="date" value={contributionForm.date} onChange={e => setContributionForm({...contributionForm, date: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                </div>
              </div>
              
              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Record Contribution
              </button>
            </form>
          )}

          {activeTab === 'announcements' && (
            <form onSubmit={handleAddAnnouncement} className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Post Announcement</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Title</label>
                <input required type="text" value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Content</label>
                <textarea required rows={6} value={announcementForm.content} onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Date</label>
                <input required type="date" value={announcementForm.date} onChange={e => setAnnouncementForm({...announcementForm, date: e.target.value})} className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all max-w-xs" />
              </div>
              
              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" /> Post Announcement
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
