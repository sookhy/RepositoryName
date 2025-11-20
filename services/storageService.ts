import { JournalEntry } from '../types';

const STORAGE_KEY = 'reflect_ai_entries';

export const getEntries = (): JournalEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load entries", e);
    return [];
  }
};

export const saveEntry = (content: string): JournalEntry => {
  const entries = getEntries();
  const now = new Date();
  
  const newEntry: JournalEntry = {
    id: crypto.randomUUID(),
    content,
    timestamp: now.getTime(),
    dateString: now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  };

  const updatedEntries = [newEntry, ...entries];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  return newEntry;
};

export const deleteEntry = (id: string): JournalEntry[] => {
  const entries = getEntries();
  const updated = entries.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
