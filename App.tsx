import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { WriteView } from './components/WriteView';
import { HistoryView } from './components/HistoryView';
import { InsightsView } from './components/InsightsView';
import { Tab, JournalEntry } from './types';
import { getEntries, deleteEntry } from './services/storageService';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.WRITE);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  const handleEntrySaved = (newEntry: JournalEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    // Stay on Write view to show success message, user can navigate manually
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updated = deleteEntry(id);
      setEntries(updated);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.WRITE:
        return <WriteView onEntrySaved={handleEntrySaved} />;
      case Tab.HISTORY:
        return <HistoryView entries={entries} onDelete={handleDeleteEntry} />;
      case Tab.INSIGHTS:
        return <InsightsView entries={entries} />;
      default:
        return <WriteView onEntrySaved={handleEntrySaved} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 font-sans">
      {/* Header / Top Bar */}
      <div className="flex-none px-6 py-4 flex justify-center items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100/50">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          ReflectAI
        </h1>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
