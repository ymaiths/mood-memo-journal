
import { DiaryEntry } from '../types';

const STORAGE_KEY = 'mood-diary-entries';

// Get all entries
export const getAllEntries = (): DiaryEntry[] => {
  const entriesJson = localStorage.getItem(STORAGE_KEY);
  if (!entriesJson) {
    return [];
  }
  return JSON.parse(entriesJson);
};

// Get entry for a specific date
export const getEntryByDate = (date: string): DiaryEntry | undefined => {
  const entries = getAllEntries();
  return entries.find(entry => entry.date === date);
};

// Save or update an entry
export const saveEntry = (entry: DiaryEntry): void => {
  const entries = getAllEntries();
  const existingEntryIndex = entries.findIndex(e => e.date === entry.date);
  
  if (existingEntryIndex >= 0) {
    // Update existing entry
    entries[existingEntryIndex] = entry;
  } else {
    // Add new entry
    entries.push(entry);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Delete an entry
export const deleteEntry = (date: string): void => {
  let entries = getAllEntries();
  entries = entries.filter(entry => entry.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Get entries for a specific month
export const getEntriesForMonth = (year: number, month: number): DiaryEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === year &&
      entryDate.getMonth() === month
    );
  });
};
