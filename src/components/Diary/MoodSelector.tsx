
import React from 'react';
import { MoodType, MoodOption } from '@/types';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onChange: (mood: MoodType) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange }) => {
  const moodOptions: MoodOption[] = [
    {
      value: MoodType.VERY_HAPPY,
      label: "สุขมาก",
      icon: "😄",
      color: "bg-mood-veryhappy",
      borderColor: "border-mood-veryhappy"
    },
    {
      value: MoodType.HAPPY,
      label: "สุข",
      icon: "🙂",
      color: "bg-mood-happy",
      borderColor: "border-mood-happy"
    },
    {
      value: MoodType.NEUTRAL,
      label: "เฉย ๆ",
      icon: "😐",
      color: "bg-mood-neutral",
      borderColor: "border-mood-neutral"
    },
    {
      value: MoodType.SAD,
      label: "ไม่ค่อยโอเค",
      icon: "🙁",
      color: "bg-mood-sad",
      borderColor: "border-mood-sad"
    },
    {
      value: MoodType.VERY_SAD,
      label: "เศร้า",
      icon: "😢",
      color: "bg-mood-verysad",
      borderColor: "border-mood-verysad"
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3">อารมณ์วันนี้</h3>
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={`
              flex flex-col items-center p-3 rounded-lg transition-all
              ${selectedMood === mood.value 
                ? `border-2 ${mood.borderColor} shadow-md transform scale-105` 
                : 'border border-gray-200 hover:border-mood-primary'}
            `}
          >
            <span className="text-3xl mb-1">{mood.icon}</span>
            <span className="text-sm">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
