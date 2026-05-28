import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Bell, Plus, Trash2, Clock, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Reminders = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newTime, setNewTime] = useState('');
  const [newNotify, setNewNotify] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addEvent({ title: newTitle, date: newDate, time: newTime, notify: newNotify });
    setNewTitle('');
    setNewTime('');
    setShowAdd(false);
  };

  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="p-3 bg-[var(--primary)] text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="bg-[var(--secondary)] p-6 rounded-3xl space-y-4 border border-[var(--border)]">
              <input
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's the reminder?"
                className="w-full bg-[var(--background)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none font-bold"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-[var(--background)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none text-sm"
                />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="bg-[var(--background)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none text-sm"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setNewNotify(!newNotify)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${newNotify ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)]'}`}
                >
                  {newNotify && <Check size={14} className="text-white" />}
                </div>
                <span className="text-sm font-medium opacity-70 group-hover:opacity-100">Notify me</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 font-bold opacity-50 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl font-bold shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => (
            <motion.div
              layout
              key={event.id}
              className="flex items-center gap-4 p-5 bg-[var(--background)] border border-[var(--border)] rounded-2xl group"
            >
              <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--primary)]">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{event.title}</h3>
                <div className="flex items-center gap-3 mt-1 opacity-50 text-xs">
                  <span className="flex items-center gap-1"><CalendarIcon size={12}/> {format(parseISO(event.date), 'MMMM do')}</span>
                  {event.time && <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 opacity-30 space-y-4">
            <Bell size={64} className="mx-auto" />
            <p className="text-xl font-medium">No reminders set</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
