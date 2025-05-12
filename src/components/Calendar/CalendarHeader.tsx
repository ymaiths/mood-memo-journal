
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getThaiMonth } from '@/utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
}) => {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate years (current year - 5 to current year + 5)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="flex items-center mb-4 sm:mb-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrevMonth}
          className="calendar-header-btn"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-xl font-medium mx-4">
          {getThaiMonth(currentMonth)} {currentYear}
        </h2>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNextMonth}
          className="calendar-header-btn"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Select 
          value={currentMonth.toString()} 
          onValueChange={(value) => onMonthChange(parseInt(value))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="เดือน" />
          </SelectTrigger>
          <SelectContent position="item-aligned" align="start" side="top">
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {getThaiMonth(i)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={currentYear.toString()} 
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="ปี" />
          </SelectTrigger>
          <SelectContent position="item-aligned" align="start" side="top">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CalendarHeader;
