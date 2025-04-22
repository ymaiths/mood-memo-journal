
import React, { useState, useEffect } from 'react';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import CalendarGrid from '@/components/Calendar/CalendarGrid';
import DiaryEntryForm from '@/components/Diary/DiaryEntry';
import { DiaryEntry } from '@/types';
import { getEntriesForMonth } from '@/utils/storageUtils';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showDiaryEntry, setShowDiaryEntry] = useState(false);
  
  // Get current month and year
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Load entries for the current month
  useEffect(() => {
    const monthEntries = getEntriesForMonth(currentYear, currentMonth);
    setEntries(monthEntries);
  }, [currentYear, currentMonth]);
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleMonthChange = (month: number) => {
    setCurrentDate(new Date(currentYear, month, 1));
  };
  
  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentMonth, 1));
  };
  
  // Handle date selection
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowDiaryEntry(true);
  };
  
  // Handle diary entry save
  const handleDiaryEntrySave = () => {
    // Refresh entries after save
    const monthEntries = getEntriesForMonth(currentYear, currentMonth);
    setEntries(monthEntries);
  };
  
  // Handle close diary entry
  const handleCloseDiaryEntry = () => {
    setShowDiaryEntry(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-mood-dark mb-2">บันทึกอารมณ์และไดอารี่</h1>
          <p className="text-mood-gray">บันทึกความรู้สึกและเรื่องราวในแต่ละวัน</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
          
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            entries={entries}
            onSelectDate={handleSelectDate}
          />
        </div>
        
        {showDiaryEntry && (
          <div className={`diary-entry-container ${showDiaryEntry ? 'open' : ''}`}>
            <DiaryEntryForm 
              selectedDate={selectedDate}
              onSave={handleDiaryEntrySave}
              onClose={handleCloseDiaryEntry}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
