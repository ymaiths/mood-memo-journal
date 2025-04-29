
export enum MoodType {
  VERY_HAPPY = "veryhappy",
  HAPPY = "happy",
  NEUTRAL = "neutral",
  SAD = "sad",
  VERY_SAD = "verysad",
}

export interface DiaryEntry {
  id: string; // Unique identifier for each entry
  date: string; // ISO string for the date (YYYY-MM-DD)
  time: string; // Time in HH:MM format
  mood: MoodType;
  text: string;
  updatedAt: string; // ISO timestamp
}

export interface MoodOption {
  value: MoodType;
  label: string;
  icon: string;
  color: string;
  borderColor: string;
}
