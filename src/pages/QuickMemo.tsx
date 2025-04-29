
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MoodSelector from '@/components/Diary/MoodSelector'; // Fixed: import as default export
import { saveEntry } from '@/utils/storageUtils';
import { toast } from 'sonner';
import { MoodType } from '@/types';

const QuickMemo = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>(MoodType.NEUTRAL); // Use MoodType enum instead of number
  
  const handleMoodChange = (newMood: MoodType) => {
    setMood(newMood);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleSave = () => {
    if (!content.trim()) {
      toast.error('กรุณาใส่เนื้อหาบันทึก');
      return;
    }
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    const entry = {
      date: dateString,
      mood: mood,
      text: content,
      updatedAt: today.toISOString(),
    };
    
    saveEntry(entry);
    toast.success('บันทึกสำเร็จ');
    setContent('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-center mb-6">บันทึกเร็ว</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">อารมณ์ของคุณวันนี้</h2>
            <MoodSelector selectedMood={mood} onChange={handleMoodChange} />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              เนื้อหาบันทึก
            </label>
            <Textarea
              id="content"
              placeholder="เขียนสิ่งที่คุณอยากบันทึก..."
              className="min-h-[200px] w-full"
              value={content}
              onChange={handleContentChange}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMemo;
