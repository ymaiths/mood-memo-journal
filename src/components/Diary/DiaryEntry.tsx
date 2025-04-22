
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import MoodSelector from './MoodSelector';
import { DiaryEntry, MoodType } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { saveEntry, getEntryByDate } from '@/utils/storageUtils';

interface DiaryEntryFormProps {
  selectedDate: Date;
  onSave: () => void;
  onClose: () => void;
}

const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({ 
  selectedDate, 
  onSave,
  onClose
}) => {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const dateString = formatDate(selectedDate);
  
  useEffect(() => {
    // Load existing entry if it exists
    const existingEntry = getEntryByDate(dateString);
    if (existingEntry) {
      setMood(existingEntry.mood);
      setText(existingEntry.text);
      setIsEditing(true);
    } else {
      setMood(null);
      setText('');
      setIsEditing(false);
    }
  }, [dateString]);

  const handleSave = () => {
    if (!mood) {
      toast({
        title: "กรุณาเลือกอารมณ์",
        description: "โปรดเลือกอารมณ์ของคุณก่อนบันทึก",
        variant: "destructive",
      });
      return;
    }

    const entry: DiaryEntry = {
      date: dateString,
      mood,
      text,
      updatedAt: new Date().toISOString(),
    };

    saveEntry(entry);
    toast({
      title: "บันทึกสำเร็จ",
      description: "บันทึกอารมณ์และไดอารี่เรียบร้อยแล้ว",
    });
    onSave();
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium text-mood-dark">
          {formattedDate}
        </h2>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-mood-gray hover:text-mood-dark"
        >
          ปิด
        </Button>
      </div>

      <MoodSelector selectedMood={mood} onChange={(m) => setMood(m)} />

      <div className="mb-6">
        <h3 className="font-medium text-lg mb-3">บันทึกประจำวัน</h3>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="เขียนความรู้สึกหรือเหตุการณ์ในวันนี้..."
          className="min-h-[150px] focus:border-mood-primary"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-mood-primary hover:bg-mood-primary/90"
        >
          {isEditing ? 'อัปเดต' : 'บันทึก'}
        </Button>
      </div>
    </div>
  );
};

export default DiaryEntryForm;
