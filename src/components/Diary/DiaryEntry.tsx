
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import MoodSelector from './MoodSelector';
import { DiaryEntry, MoodType } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { saveEntry, getEntriesByDate, deleteEntry } from '@/utils/storageUtils';
import { Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [mood, setMood] = useState<MoodType>(MoodType.NEUTRAL);
  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const dateString = formatDate(selectedDate);
  
  useEffect(() => {
    // Load existing entries for this date
    const existingEntries = getEntriesByDate(dateString);
    setEntries(existingEntries);
    
    // Reset form
    setSelectedEntryId(null);
    setMood(MoodType.NEUTRAL);
    setText('');
    
    // Set default time to current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setTime(`${hours}:${minutes}`);
    
    setIsEditing(false);
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
    
    if (!time) {
      toast({
        title: "กรุณาระบุเวลา",
        description: "โปรดระบุเวลาสำหรับบันทึกนี้",
        variant: "destructive",
      });
      return;
    }

    const entry: DiaryEntry = {
      id: selectedEntryId || '',
      date: dateString,
      time: time,
      mood,
      text,
      updatedAt: new Date().toISOString(),
    };

    saveEntry(entry);
    toast({
      title: "บันทึกสำเร็จ",
      description: "บันทึกอารมณ์และไดอารี่เรียบร้อยแล้ว",
    });
    
    // Reset form
    setSelectedEntryId(null);
    setMood(MoodType.NEUTRAL);
    setText('');
    setIsEditing(false);
    
    // Refresh entries
    const updatedEntries = getEntriesByDate(dateString);
    setEntries(updatedEntries);
    
    onSave();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ต้องการลบบันทึกนี้ใช่หรือไม่?')) {
      deleteEntry(id);
      
      // Refresh entries
      const updatedEntries = getEntriesByDate(dateString);
      setEntries(updatedEntries);
      
      // Reset form if the deleted entry was being edited
      if (selectedEntryId === id) {
        setSelectedEntryId(null);
        setMood(MoodType.NEUTRAL);
        setText('');
        setIsEditing(false);
      }
      
      toast({
        title: "ลบบันทึกสำเร็จ",
      });
      
      onSave();
    }
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setSelectedEntryId(entry.id);
    setMood(entry.mood);
    setText(entry.text);
    setTime(entry.time);
    setIsEditing(true);
  };

  const handleNewEntry = () => {
    setSelectedEntryId(null);
    setMood(MoodType.NEUTRAL);
    setText('');
    
    // Set default time to current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setTime(`${hours}:${minutes}`);
    
    setIsEditing(false);
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

      {entries.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-3">บันทึกในวันนี้</h3>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMoodColor(entry.mood)}`}>
                      {getMoodEmoji(entry.mood)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{entry.time}</span>
                    </div>
                    <div className="text-sm truncate max-w-xs">
                      {entry.text.length > 50 ? `${entry.text.substring(0, 50)}...` : entry.text}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditEntry(entry)}
                  >
                    แก้ไข
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(entry.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    ลบ
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={handleNewEntry}
            >
              + เพิ่มบันทึกใหม่
            </Button>
          </div>
          <Separator className="my-6" />
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-medium text-lg mb-2">
          {isEditing ? 'แก้ไขบันทึก' : 'เพิ่มบันทึกใหม่'}
        </h3>
        <div className="flex items-center mb-4">
          <label htmlFor="time" className="mr-2 text-sm font-medium">เวลา:</label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-24"
          />
        </div>
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

// Helper functions
const getMoodColor = (mood: MoodType): string => {
  const colors: Record<MoodType, string> = {
    [MoodType.VERY_HAPPY]: 'bg-mood-veryhappy',
    [MoodType.HAPPY]: 'bg-mood-happy',
    [MoodType.NEUTRAL]: 'bg-mood-neutral',
    [MoodType.SAD]: 'bg-mood-sad',
    [MoodType.VERY_SAD]: 'bg-mood-verysad',
  };
  return colors[mood];
};

const getMoodEmoji = (mood: MoodType): string => {
  const emojis: Record<MoodType, string> = {
    [MoodType.VERY_HAPPY]: '😄',
    [MoodType.HAPPY]: '🙂',
    [MoodType.NEUTRAL]: '😐',
    [MoodType.SAD]: '🙁',
    [MoodType.VERY_SAD]: '😢',
  };
  return emojis[mood];
};

export default DiaryEntryForm;
