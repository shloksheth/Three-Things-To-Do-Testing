import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import ListPage from './pages/ListPage';
import Reminders from './pages/Reminders';
import SettingsPage from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
