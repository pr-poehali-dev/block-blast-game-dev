import { useState } from 'react';
import Home from './Home';
import Game from './Game';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import Achievements from './Achievements';

export default function Index() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'game':
        return <Game onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      case 'leaderboard':
        return <Leaderboard onNavigate={setCurrentPage} />;
      case 'achievements':
        return <Achievements onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}
