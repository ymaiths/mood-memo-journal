
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DiaryEntry } from '@/types';

export const useRealtimeDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
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
                  entry.date === (payload.new as DiaryEntry).date 
                    ? payload.new as DiaryEntry 
                    : entry
                )
              );
              break;
            case 'DELETE':
              // Remove deleted entry
              setEntries(currentEntries => 
                currentEntries.filter(entry => 
                  entry.date !== (payload.old as DiaryEntry).date
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

