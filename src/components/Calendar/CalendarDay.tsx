
import React from 'react';
import { DiaryEntry, MoodType } from '@/types';
import { isSameMonth } from '@/utils/dateUtils';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  entries: DiaryEntry[];
  onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
  isSelected,
  entries,
  onClick,
}) => {
  const day = date.getDate();
  const isCurrentMonth = isSameMonth(date, currentMonth);
  
  const getMoodColor = (mood?: MoodType) => {
    if (!mood) return '';
    
    const colors: Record<MoodType, string> = {
      [MoodType.VERY_HAPPY]: 'bg-mood-veryhappy',
      [MoodType.HAPPY]: 'bg-mood-happy',
      [MoodType.NEUTRAL]: 'bg-mood-neutral',
      [MoodType.SAD]: 'bg-mood-sad',
      [MoodType.VERY_SAD]: 'bg-mood-verysad',
    };
    
    return colors[mood];
  };
  
  const getMoodBorderColor = (mood?: MoodType) => {
    if (!mood) return '';
    
    const colors: Record<MoodType, string> = {
      [MoodType.VERY_HAPPY]: 'border-mood-veryhappy',
      [MoodType.HAPPY]: 'border-mood-happy',
      [MoodType.NEUTRAL]: 'border-mood-neutral',
      [MoodType.SAD]: 'border-mood-sad',
      [MoodType.VERY_SAD]: 'border-mood-verysad',
    };
    
    return colors[mood];
  };
  
  // Show indicator if there are entries
  const hasEntries = entries && entries.length > 0;
  
  // Get the most recent entry's mood for the dot color
  const latestEntry = hasEntries ? entries[entries.length - 1] : null;
  const dotColor = latestEntry ? getMoodColor(latestEntry.mood) : '';
  
  return (
    <button
      onClick={onClick}
      className={`
        calendar-day rounded-md flex items-center justify-center
        ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground opacity-40'}
        ${isSelected ? 'bg-mood-primary/10 ring-2 ring-mood-primary' : 'hover:bg-secondary'}
        ${hasEntries ? 'calendar-day-has-entry' : ''}
      `}
    >
      <div 
        className={`
          flex flex-col items-center justify-center w-full h-9 relative
          ${hasEntries ? `${getMoodColor(latestEntry?.mood)} bg-opacity-20 border ${getMoodBorderColor(latestEntry?.mood)}` : ''}
        `}
      >
        <span>{day}</span>
        {hasEntries && (
          <div className="absolute -bottom-1">
            <div className="flex space-x-1 mt-1">
              {entries.length <= 3 ? (
                entries.map((entry, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${getMoodColor(entry.mood)}`}
                  />
                ))
              ) : (
                <>
                  <div className={`w-1.5 h-1.5 rounded-full ${getMoodColor(entries[0].mood)}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${getMoodColor(entries[1].mood)}`} />
                  <div className="text-xs leading-none">+{entries.length - 2}</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CalendarDay;
