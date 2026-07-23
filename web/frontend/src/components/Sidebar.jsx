import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, UserPlus, Users, Upload, Workflow, 
  MapPin, Image, Cpu, LineChart, FileSpreadsheet, 
  FileText, Bell, Settings, LogOut, Activity, X,
  Database, Landmark, Info, HelpCircle, ShieldCheck, Heart, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate('/welcome');
  };

  const handleSwitchWorkstation = (rolePath) => {
    navigate(rolePath);
  };

  // Determine current active workstation role based on URL
  const getActiveRole = () => {
    if (location.pathname.includes('clinic-manager')) return { title: 'Clinic Manager', path: '/clinic-manager-dashboard' };
    return { title: 'Orthodontist', path: '/dashboard' };
  };

  const currentRole = getActiveRole();

  const menuSections = [
    {
      title: 'Clinical Station',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'New Patient', path: '/new-patient', icon: UserPlus },
        { name: 'Patient Records', path: '/patient-records', icon: Users },
        { name: 'Manual Predictor', path: '/ai-prediction', icon: Cpu },
        { name: 'Upload Scan', path: '/upload-scan', icon: Upload },
        { name: 'Reports Archive', path: '/reports', icon: FileText }
      ]
    },
    {
      title: 'Administrative',
      items: [
        { name: 'Manager Workspace', path: '/clinic-manager-dashboard', icon: Landmark }
      ]
    },
    {
      title: 'Clinical Telemetry',
      items: [
        { name: 'Charts View', path: '/charts-dashboard', icon: LineChart },
        { name: 'System Analytics', path: '/analytics-dashboard', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'Platform Info & Help',
      items: [
        { name: 'About BAMP', path: '/about', icon: Info },
        { name: 'FAQ Support', path: '/faq', icon: HelpCircle },
        { name: 'Help Center', path: '/help-center', icon: ShieldCheck },
        { name: 'Feedback Questionnaire', path: '/feedback', icon: Heart },
        { name: 'System Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 z-45 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Block */}
        <div className="h-16 px-6 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-medical-500/10 rounded-xl">
              <Activity className="h-6 w-6 text-medical-500 animate-pulse" />
            </div>
            <span className="text-lg font-black tracking-wider text-medical-600 dark:text-medical-400 font-sans">BAMP AI</span>
          </div>
          <button onClick={toggleSidebar} className="p-1 text-slate-400 hover:text-slate-650 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Doctor Header Profile with Switcher dropdown */}
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-medical-500 text-white font-bold rounded-xl flex items-center justify-center text-sm">
              DR
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-bold truncate text-slate-850 dark:text-slate-200">
                {user?.name || 'Dr. Venkatapraveenamallela'}
              </h4>
              
              {/* Role Select Quick switch shortcut */}
              <select
                value={currentRole.path}
                onChange={(e) => handleSwitchWorkstation(e.target.value)}
                className="mt-1 bg-transparent text-[10px] font-bold text-medical-500 hover:text-medical-400 border-none p-0 focus:outline-none cursor-pointer w-full"
              >
                <option value="/dashboard" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">Role: Orthodontist</option>
                <option value="/clinic-manager-dashboard" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">Role: Clinic Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin text-xs">
          
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4">{section.title}</h5>
              
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={({ isActive }) => `flex items-center space-x-3 px-4 py-2.5 rounded-xl font-bold transition-all duration-150 ${isActive ? 'bg-medical-50 text-medical-600 dark:bg-medical-950/40 dark:text-medical-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-slate-250'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

        </nav>

        {/* Logout bottom area */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Station</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
