import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { User, Palette, Download, Upload, Trash2, Heart, QrCode, Smartphone, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import LZString from 'lz-string';

const Settings = () => {
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState(null);
  const { user, setUser, clearData, importData, tasks, categories, events } = useStore();

  const showFeedback = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const syncUrl = useMemo(() => {
    const data = { user, tasks, categories, events };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(data));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?sync=${compressed}`;
  }, [user, tasks, categories, events]);

  const themes = [
    { id: 'red-pastel', name: 'Red Earth (Default)', color: '#ff6b6b' },
    { id: 'blue-pastel', name: 'Soft Blue', color: '#4facfe' },
    { id: 'light', name: 'Clean Light', color: '#ffffff' },
    { id: 'dark', name: 'Cozy Dark', color: '#1a1a1a' },
  ];

  const handleExport = () => {
    const data = { user, tasks, categories, events };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `three-things-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        importData(data);
        showFeedback('Data imported successfully!');
      } catch (err) {
        showFeedback('Error: Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-20 relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold"
          >
            <CheckCircle size={20} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 opacity-40 uppercase text-xs font-bold tracking-widest">
          <User size={16} />
          Profile
        </div>
        <div className="bg-[var(--secondary)] p-6 rounded-3xl space-y-4">
           <div>
             <label className="text-sm font-bold opacity-60 block mb-2">Your Name</label>
             <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ name: e.target.value })}
              className="w-full bg-[var(--background)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--primary)] outline-none font-medium"
             />
           </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 opacity-40 uppercase text-xs font-bold tracking-widest">
          <Palette size={16} />
          Appearance
        </div>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setUser({ theme: t.id })}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 ${
                user.theme === t.id ? 'border-[var(--primary)] bg-[var(--background)]' : 'border-transparent bg-[var(--secondary)] hover:bg-[var(--border)]'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border border-black/10"
                style={{ backgroundColor: t.color }}
              />
              <span className="font-bold text-sm">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 opacity-40 uppercase text-xs font-bold tracking-widest">
          <Download size={16} />
          Data & Backup
        </div>
        <div className="bg-[var(--secondary)] p-2 rounded-3xl flex flex-col gap-1">
          <button
            onClick={handleExport}
            className="flex items-center gap-4 p-4 hover:bg-[var(--background)] rounded-2xl transition-all text-left"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Download size={20} /></div>
            <div>
              <p className="font-bold">Export Data</p>
              <p className="text-xs opacity-60">Download a JSON backup of your tasks.</p>
            </div>
          </button>

          <label className="flex items-center gap-4 p-4 hover:bg-[var(--background)] rounded-2xl transition-all text-left cursor-pointer">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Upload size={20} /></div>
            <div>
              <p className="font-bold">Import Data</p>
              <p className="text-xs opacity-60">Restore your tasks from a backup file.</p>
            </div>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete all data? This cannot be undone.')) clearData();
            }}
            className="flex items-center gap-4 p-4 hover:bg-red-50 rounded-2xl transition-all text-left text-red-600"
          >
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Trash2 size={20} /></div>
            <div>
              <p className="font-bold">Clear All Data</p>
              <p className="text-xs opacity-60">Permanently delete everything.</p>
            </div>
          </button>
        </div>
      </section>

      {/* Sync Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 opacity-40 uppercase text-xs font-bold tracking-widest">
          <Smartphone size={16} />
          Mobile Sync
        </div>
        <div className="bg-[var(--secondary)] p-6 rounded-3xl space-y-4">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
                 <QrCode size={32} />
              </div>
              <div className="flex-1">
                 <p className="font-bold text-lg">Sync to Mobile</p>
                 <p className="text-sm opacity-60">Scan a QR code to transfer your data to another device instantly.</p>
              </div>
           </div>
           <button
            onClick={() => setShowQR(true)}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition-all active:scale-95"
           >
             Generate Sync QR Code
           </button>
        </div>
      </section>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white text-black p-8 rounded-[40px] shadow-2xl max-w-sm w-full flex flex-col items-center text-center space-y-6"
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Scan to Sync</h3>
                <p className="text-sm text-gray-500">Open your phone camera and scan this code to open the app with your current data.</p>
              </div>

              <div className="p-4 bg-white rounded-3xl shadow-inner border border-gray-100">
                <QRCodeCanvas
                  value={syncUrl}
                  size={240}
                  level="L" // Low error correction to keep QR simple for high data density
                  includeMargin={true}
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl w-full">
                <p className="text-xs text-purple-800 font-medium">
                  Note: If you have a lot of tasks, the QR code might become dense. Hold your phone steady!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-10 opacity-30 space-y-2">
         <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs">
           Made with <Heart size={14} className="text-red-500 fill-red-500" /> for Focus
         </div>
         <p className="text-[10px]">Three Things to Do v1.0</p>
      </footer>
    </div>
  );
};

export default Settings;
