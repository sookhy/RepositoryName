import React from 'react';
import { PenLine, History, Sparkles } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-safe flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <NavButton 
        isActive={currentTab === Tab.HISTORY} 
        onClick={() => onTabChange(Tab.HISTORY)} 
        icon={<History size={24} />} 
        label="History" 
      />
      
      <div className="-mt-8">
        <button 
          onClick={() => onTabChange(Tab.WRITE)}
          className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
            currentTab === Tab.WRITE 
              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <PenLine size={28} />
        </button>
      </div>

      <NavButton 
        isActive={currentTab === Tab.INSIGHTS} 
        onClick={() => onTabChange(Tab.INSIGHTS)} 
        icon={<Sparkles size={24} />} 
        label="Insights" 
      />
    </div>
  );
};

const NavButton: React.FC<{
  isActive: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string
}> = ({ isActive, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-16 transition-colors ${
      isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);
