import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { user, tasks, events, toggleTaskCompletion } = useStore();
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');

  const todaysTasks = tasks.filter(t => t.date === dateStr);
  const todaysEvents = events.filter(e => e.date === dateStr);

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-8">
      {/* Greeting Section */}
      <section className="space-y-3">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl opacity-60 font-medium"
        >
          {format(today, 'EEEE, MMMM do')}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold tracking-tight"
        >
          Hello, {user.name}
        </motion.h1>
      </section>

      {/* Main Focus: 3 Things */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Today's Focus
            <span className={`text-sm px-3 py-1 rounded-full ${todaysTasks.length > 3 ? 'bg-orange-100 text-orange-600' : 'bg-[var(--secondary)]'}`}>
              {todaysTasks.length} {todaysTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {todaysTasks.length > 0 ? (
            todaysTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`group flex items-center gap-5 p-6 rounded-3xl border border-[var(--border)] transition-all duration-300 ${
                  task.completed ? 'bg-[var(--secondary)] opacity-60' : 'bg-[var(--background)] hover:shadow-xl hover:border-[var(--primary)]'
                }`}
              >
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="transition-transform duration-200 active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-[var(--primary)]" size={28} />
                  ) : (
                    <Circle className="opacity-30 group-hover:opacity-100 group-hover:text-[var(--primary)]" size={28} />
                  )}
                </button>
                <span className={`text-xl font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-[var(--border)] rounded-3xl opacity-40">
              <p className="text-xl font-medium">No tasks for today yet.</p>
              <p className="text-sm mt-2">Head to the Calendar or Lists to add some!</p>
            </div>
          )}
        </div>
      </section>

      {/* Reminders/Events Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Coming Up
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todaysEvents.length > 0 ? (
            todaysEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-3xl bg-[var(--secondary)] border border-[var(--border)]"
              >
                <div className="p-3 rounded-2xl bg-[var(--background)] text-[var(--primary)] shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-sm opacity-60 font-medium">{event.time || 'All day'}</p>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full p-8 rounded-3xl bg-[var(--secondary)] text-center opacity-50">
                <p className="text-base font-medium">No events scheduled for today.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
