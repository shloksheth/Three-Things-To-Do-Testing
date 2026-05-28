import React from 'react';
import { useStore } from '../../store/useStore';
import { Home, Calendar, List, Bell, Settings } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import { motion } from 'framer-motion';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  useTheme();
  useNotifications();
  const user = useStore(state => state.user);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'list', icon: List, label: 'Lists' },
    { id: 'reminders', icon: Bell, label: 'Reminders' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Sidebar - Web */}
      <aside className="hidden md:flex flex-col w-72 border-r border-[var(--border)] p-8 gap-10 bg-[var(--secondary)]">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
          <h1 className="font-bold text-2xl tracking-tight">Three Things</h1>
        </div>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                currentPage === item.id
                  ? 'bg-[var(--primary)] text-white shadow-xl scale-[1.02]'
                  : 'hover:bg-[var(--border)] opacity-60 hover:opacity-100 hover:translate-x-1'
              }`}
            >
              <item.icon size={22} />
              <span className="font-bold text-lg">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 w-full ${
              currentPage === 'settings'
                ? 'bg-[var(--primary)] text-white shadow-xl'
                : 'hover:bg-[var(--border)] opacity-60 hover:opacity-100'
            }`}
          >
            <Settings size={22} />
            <span className="font-bold text-lg">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-[100vh]">
        {/* Header - Mobile */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--background)] z-10 shadow-sm">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold shadow-md">3</div>
            <h1 className="font-bold text-xl tracking-tight">Three Things</h1>
          </div>
          <button
            onClick={() => setCurrentPage('settings')}
            className="p-2 hover:bg-[var(--secondary)] rounded-full transition-colors"
          >
            <Settings size={24} className="opacity-60" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32 md:pb-12">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </div>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-[var(--background)] border border-[var(--border)] rounded-3xl flex items-center justify-around px-2 shadow-2xl z-20 backdrop-blur-md bg-opacity-90">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const isHome = item.id === 'home';

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive ? 'text-[var(--primary)]' : 'opacity-40'
                } ${isHome ? 'transform scale-125 -translate-y-6 bg-[var(--primary)] text-white w-14 h-14 rounded-2xl shadow-xl' : 'w-12 h-12'}`}
              >
                <item.icon size={isHome ? 28 : 24} />
                {!isHome && <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>}
                {isActive && !isHome && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--primary)]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
