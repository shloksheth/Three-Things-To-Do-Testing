import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = () => {
  const { tasks, events, addTask, addEvent, toggleTaskCompletion } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'daily'
  const [filter, setFilter] = useState('all'); // 'all', 'tasks', 'events'
  const [showCaution, setShowCaution] = useState(false);

  const filteredTasks = useMemo(() => {
    if (filter === 'all' || filter === 'tasks') return tasks;
    return [];
  }, [tasks, filter]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all' || filter === 'events') return events;
    return [];
  }, [events, filter]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const nextDay = () => setSelectedDay(addDays(selectedDay, 1));
  const prevDay = () => setSelectedDay(addDays(selectedDay, -1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {viewMode === 'calendar' ? format(currentMonth, 'MMMM yyyy') : format(selectedDay, 'MMMM do')}
          </h2>
          <button
            onClick={() => setShowCaution(!showCaution)}
            className={`p-2 rounded-full transition-colors ${showCaution ? 'bg-orange-100 text-orange-600' : 'bg-[var(--secondary)] opacity-50'}`}
          >
            <AlertTriangle size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-[var(--secondary)] p-1 rounded-xl">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-[var(--background)] shadow-sm' : 'opacity-50'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'daily' ? 'bg-[var(--background)] shadow-sm' : 'opacity-50'}`}
          >
            Daily
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(d => (
          <div key={d} className="text-center text-xs font-bold opacity-40 uppercase tracking-widest">{d}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = filteredTasks.filter(t => t.date === dateStr);
          const dayEvents = filteredEvents.filter(e => e.date === dateStr);

          const isSelected = isSameDay(day, selectedDay);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          const dayCount = dayTasks.length;
          const needsCaution = showCaution && (dayCount > 3 || (dayCount < 3 && dayCount > 0));
          const cautionColor = dayCount > 3 ? 'border-orange-400' : 'border-blue-300';

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDay(day);
                setViewMode('daily');
              }}
              className={`aspect-square p-2 rounded-xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                isSelected ? 'border-[var(--primary)] bg-[var(--background)]' :
                isToday ? 'border-[var(--accent)] bg-[var(--secondary)]' :
                needsCaution ? cautionColor : 'border-transparent hover:bg-[var(--secondary)]'
              } ${!isCurrentMonth ? 'opacity-20' : ''}`}
            >
              <span className={`text-sm font-bold ${isSelected ? 'text-[var(--primary)]' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="flex flex-wrap gap-1">
                {dayTasks.slice(0, 3).map(t => (
                  <div key={t.id} className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                ))}
                {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const DailyView = () => {
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    const dayTasks = filteredTasks.filter(t => t.date === dateStr);
    const dayEvents = filteredEvents.filter(e => e.date === dateStr);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e) => {
      e.preventDefault();
      if (!newTaskTitle.trim()) return;
      addTask({ title: newTaskTitle, date: dateStr });
      setNewTaskTitle('');
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={prevDay} className="p-2 hover:bg-[var(--secondary)] rounded-full transition-colors">
              <ChevronLeft />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold">{format(selectedDay, 'EEEE')}</h3>
              <p className="opacity-60 text-sm">{format(selectedDay, 'MMMM do, yyyy')}</p>
            </div>
            <button onClick={nextDay} className="p-2 hover:bg-[var(--secondary)] rounded-full transition-colors">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
             <h4 className="text-sm font-bold uppercase tracking-wider opacity-40">Tasks</h4>
             <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a task for this day..."
                  className="flex-1 bg-[var(--secondary)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                />
                <button type="submit" className="p-3 bg-[var(--primary)] text-white rounded-xl hover:shadow-lg transition-all active:scale-95">
                  <Plus size={24} />
                </button>
             </form>

             <div className="space-y-2">
               {dayTasks.map(task => (
                 <div key={task.id} className="flex items-center gap-3 p-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
                    <button onClick={() => toggleTaskCompletion(task.id)}>
                      {task.completed ? <CheckCircle2 className="text-[var(--primary)]" /> : <Circle className="opacity-20" />}
                    </button>
                    <span className={task.completed ? 'line-through opacity-50' : ''}>{task.title}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-sm font-bold uppercase tracking-wider opacity-40">Events</h4>
             <div className="space-y-2">
                {dayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800">
                    <CalendarIcon size={18} />
                    <span className="font-medium">{event.title}</span>
                    {event.time && <span className="ml-auto text-xs opacity-60">{event.time}</span>}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderHeader()}

      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-[var(--secondary)] p-1 rounded-xl">
           {['all', 'tasks', 'events'].map(f => (
             <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-[var(--background)] shadow-sm' : 'opacity-50'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'calendar' ? (
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex justify-between items-center mb-4">
               <button onClick={prevMonth} className="p-2 hover:bg-[var(--secondary)] rounded-xl transition-colors">
                <ChevronLeft />
              </button>
              <button onClick={() => setCurrentMonth(new Date())} className="text-sm font-medium opacity-60 hover:opacity-100">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-[var(--secondary)] rounded-xl transition-colors">
                <ChevronRight />
              </button>
            </div>
            {renderDays()}
            {renderCells()}
          </motion.div>
        ) : (
          <DailyView key="daily-view" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
