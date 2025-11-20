import React from 'react';
import { JournalEntry } from '../types';
import { Trash2, Calendar } from 'lucide-react';

interface HistoryViewProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-400">
          <Calendar size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No entries yet</h3>
        <p className="text-slate-500">Your personal history starts when you write your first entry.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 pb-24 max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 sticky top-0 bg-slate-50 py-2 z-10">Your Journal</h2>
      
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                {entry.dateString}
              </span>
              <button 
                onClick={() => onDelete(entry.id)}
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                aria-label="Delete entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {entry.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
