import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, Search, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopBar = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications');
        if (res.data.success) {
          const unread = res.data.data.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to check notifications:", err.message);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
      
      {/* Menu / Search area */}
      <div className="flex items-center space-x-4 flex-1">
        <button onClick={toggleSidebar} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        {/* Clinical Search Bar */}
        <div className="hidden md:flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-805/80 px-3.5 py-2 rounded-xl w-72 transition-all focus-within:ring-2 focus-within:ring-medical-500/20 focus-within:border-medical-500">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, scan or record..."
            className="bg-transparent border-none text-xs focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center space-x-3.5">
        
        {/* Toggle Theme */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-150"
          title="Toggle Theme Mode"
        >
          {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
        </button>

        {/* Notifications Shortcut */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-150 relative"
          title="Evaluation Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-850" />

        {/* Doctor Identity Profile Tag */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="h-8.5 w-8.5 bg-medical-100 dark:bg-medical-950 rounded-xl flex items-center justify-center border border-medical-200 dark:border-medical-900">
            <User className="h-4.5 w-4.5 text-medical-600 dark:text-medical-400" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-350">
            {user?.name || 'Dr. Venkatapraveenamallela'}
          </span>
        </div>

      </div>

    </header>
  );
};

export default TopBar;
