import React, { useState } from 'react';
import { DiaryEntry, MoodType } from '@/types';
import { isSameMonth } from '@/utils/dateUtils';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

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
  const [isOpen, setIsOpen] = useState(false);
  
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
  
  const handleDayClick = (e: React.MouseEvent) => {
    onClick();
    e.stopPropagation(); // Prevent collapsible from toggling when clicking the day
  };
  
  return (
    <div className={`calendar-day relative ${isOpen ? 'z-10' : ''}`}>
      <button
        onClick={handleDayClick}
        className={`
          rounded-md flex items-center justify-center w-full
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
      
      {hasEntries && (
        <Collapsible 
          className={`absolute left-0 w-72 mt-1 shadow-lg rounded-md border bg-white z-20`}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <CollapsibleTrigger className="absolute -top-4 right-0 bg-gray-100 p-1 rounded-full text-xs z-20">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-2">
              <h4 className="font-medium text-sm mb-2">บันทึกในวันนี้</h4>
              {entries.map((entry, index) => (
                <div key={index} className="mb-2">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-sm ${getMoodColor(entry.mood)} bg-opacity-20`}>
                    <span className="text-xs font-medium">{entry.time}</span>
                    <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`}></div>
                  </div>
                  {entry.text && (
                    <div className="text-sm mt-1 px-2 max-h-48 overflow-y-auto">
                      {entry.text}
                    </div>
                  )}
                  {index < entries.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default CalendarDay;
