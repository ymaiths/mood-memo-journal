
import React from 'react';
import { DiaryEntry, MoodType } from '@/types';
import { isSameMonth } from '@/utils/dateUtils';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  entry?: DiaryEntry;
  onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
  isSelected,
  entry,
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
  
  const dotColor = entry?.mood ? getMoodColor(entry.mood) : '';
  
  return (
    <button
      onClick={onClick}
      className={`
        calendar-day rounded-md flex items-center justify-center
        ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground opacity-40'}
        ${isSelected ? 'bg-mood-primary/10 ring-2 ring-mood-primary' : 'hover:bg-secondary'}
        ${entry ? 'calendar-day-has-entry' : ''}
      `}
    >
      <div 
        className={`
          flex items-center justify-center w-9 h-9 rounded-full
          ${entry ? `${getMoodColor(entry.mood)} bg-opacity-20 border ${getMoodBorderColor(entry.mood)}` : ''}
        `}
      >
        {day}
      </div>
      {entry && (
        <div 
          className={`calendar-day-has-entry::after ${dotColor}`}
        ></div>
      )}
    </button>
  );
};

export default CalendarDay;
