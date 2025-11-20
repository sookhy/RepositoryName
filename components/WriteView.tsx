import React, { useState } from 'react';
import { Button } from './Button';
import { saveEntry } from '../services/storageService';
import { JournalEntry } from '../types';
import { CheckCircle } from 'lucide-react';

interface WriteViewProps {
  onEntrySaved: (entry: JournalEntry) => void;
}

export const WriteView: React.FC<WriteViewProps> = ({ onEntrySaved }) => {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    
    setIsSaving(true);
    // Simulate a small delay for better UX feel
    setTimeout(() => {
      const newEntry = saveEntry(text);
      onEntrySaved(newEntry);
      setIsSaving(false);
      setShowSuccess(true);
      setText('');
      
      setTimeout(() => setShowSuccess(false), 2000);
    }, 600);
  };

  if (showSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="bg-green-50 text-green-600 p-4 rounded-full mb-4">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Entry Saved!</h2>
        <p className="text-slate-500 text-center">Great job taking time to reflect today.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Good Morning.</h1>
        <p className="text-slate-500 mt-1">What's on your mind right now?</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4 flex flex-col relative overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
        <textarea
          className="flex-1 w-full h-full resize-none outline-none text-slate-700 text-lg leading-relaxed placeholder:text-slate-300"
          placeholder="Start writing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-300 pointer-events-none font-mono">
          {text.length} chars
        </div>
      </div>

      <Button 
        fullWidth 
        onClick={handleSave} 
        disabled={!text.trim()} 
        isLoading={isSaving}
      >
        Save Entry
      </Button>
    </div>
  );
};
