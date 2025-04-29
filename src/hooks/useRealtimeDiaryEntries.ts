
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DiaryEntry } from '@/types';
import { getAllEntries, saveEntry, deleteEntry } from '@/utils/storageUtils';

export const useRealtimeDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    // Initial load from local storage
    const storedEntries = getAllEntries();
    setEntries(storedEntries);
    
    // Create a channel for real-time updates
    const channel = supabase
      .channel('diary_entries')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'diary_entries' 
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Here you would handle different types of changes (insert, update, delete)
          switch(payload.eventType) {
            case 'INSERT':
              // Add new entry to local state
              setEntries(currentEntries => [...currentEntries, payload.new as DiaryEntry]);
              break;
            case 'UPDATE':
              // Update existing entry
              setEntries(currentEntries => 
                currentEntries.map(entry => 
                  entry.id === (payload.new as DiaryEntry).id 
                    ? payload.new as DiaryEntry 
                    : entry
                )
              );
              break;
            case 'DELETE':
              // Remove deleted entry
              setEntries(currentEntries => 
                currentEntries.filter(entry => 
                  entry.id !== (payload.old as DiaryEntry).id
                )
              );
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return entries;
};
