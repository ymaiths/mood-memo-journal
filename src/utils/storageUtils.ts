
import { DiaryEntry } from '../types';

const STORAGE_KEY = 'mood-diary-entries';

// Generate a unique ID for entries
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all entries
export const getAllEntries = (): DiaryEntry[] => {
  const entriesJson = localStorage.getItem(STORAGE_KEY);
  if (!entriesJson) {
    return [];
  }
  return JSON.parse(entriesJson);
};

// Get entries for a specific date
export const getEntriesByDate = (date: string): DiaryEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => entry.date === date);
};

// Get a specific entry by ID
export const getEntryById = (id: string): DiaryEntry | undefined => {
  const entries = getAllEntries();
  return entries.find(entry => entry.id === id);
};

// Save a new entry or update an existing one
export const saveEntry = (entry: DiaryEntry): void => {
  const entries = getAllEntries();
  
  if (!entry.id) {
    // New entry - assign an ID
    entry.id = generateId();
    entries.push(entry);
  } else {
    // Update existing entry
    const existingEntryIndex = entries.findIndex(e => e.id === entry.id);
    if (existingEntryIndex >= 0) {
      entries[existingEntryIndex] = entry;
    } else {
      entries.push(entry);
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Delete an entry
export const deleteEntry = (id: string): void => {
  let entries = getAllEntries();
  entries = entries.filter(entry => entry.id !== id);
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

// For backward compatibility - get the first entry for a specific date
export const getEntryByDate = (date: string): DiaryEntry | undefined => {
  const entries = getEntriesByDate(date);
  return entries.length > 0 ? entries[0] : undefined;
};
