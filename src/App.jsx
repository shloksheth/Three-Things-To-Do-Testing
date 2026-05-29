import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import ListPage from './pages/ListPage';
import Reminders from './pages/Reminders';
import SettingsPage from './pages/Settings';
import { useNotifications } from './hooks/useNotifications';
import { useStore } from './store/useStore';
import LZString from 'lz-string';

function App() {
  useNotifications();
  const importData = useStore(state => state.importData);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncData = params.get('sync');
    if (syncData) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(syncData);
        if (decompressed) {
          const data = JSON.parse(decompressed);
          if (confirm('Import data from QR code? This will replace your current tasks.')) {
            importData(data);
            // Clear URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.error('Failed to sync data:', err);
      }
    }
  }, [importData]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'calendar': return <Calendar />;
      case 'list': return <ListPage />;
      case 'reminders': return <Reminders />;
      case 'settings': return <SettingsPage />;
      default: return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
