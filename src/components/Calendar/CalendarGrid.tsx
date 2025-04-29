
import React from 'react';
import CalendarDay from './CalendarDay';
import { DiaryEntry } from '@/types';
import { getMonthDates, getDaysOfWeek, formatDate } from '@/utils/dateUtils';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  entries: DiaryEntry[];
  onSelectDate: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  entries,
  onSelectDate,
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysOfWeek = getDaysOfWeek();
  const daysInMonth = getMonthDates(currentYear, currentMonth);
  
  const getEntriesForDate = (date: Date): DiaryEntry[] => {
    const dateString = formatDate(date);
    return entries.filter(entry => entry.date === dateString);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 text-center bg-secondary py-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 p-2 bg-white">
        {daysInMonth.map((date, index) => (
          <CalendarDay
            key={index}
            date={date}
            currentMonth={currentDate}
            isSelected={
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear()
            }
            entries={getEntriesForDate(date)}
            onClick={() => onSelectDate(date)}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
