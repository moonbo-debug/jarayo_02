
export type ViewState = 'dashboard' | 'schedule' | 'history' | 'settings';

export type LogType = 'diaper' | 'feeding' | 'sleep' | 'health' | 'activity' | 'shift' | 'temp' | 'play';
export type LogSubType = 
  | 'pee' | 'poo' 
  | 'formula' | 'breast' | 'food' 
  | 'sleep_start' | 'sleep_end' 
  | 'fever_mild' | 'fever_high' | 'bath' | 'medicine' | 'tummy_time';

export interface Log {
  id: string;
  type: LogType;
  subType?: LogSubType;
  timestamp: Date;
  user: string; // 'Mom' or 'Dad'
  note?: string;
  value?: string; // e.g. '37.5', '120ml', 'High/Low'
}

export type EnergyLevel = 'low' | 'medium' | 'high';
export type Mood = 'angry' | 'tired' | 'calm' | 'happy';

// New: Focus on Baby (Expanded)
export type BabyMood = 'happy' | 'fussy' | 'sleeping' | 'sick' | 'hungry' | 'energetic' | 'calm' | 'poop';

export interface Mission {
  id: string;
  text: string;
  time: string; // "HH:mm"
  isCompleted: boolean;
  memo?: string;
  assignerName: string;
}

export interface ShiftReport {
  // Baby Condition (Primary) - Changed to Array
  babyMoods: BabyMood[];
  
  // Missions/Tasks for next person
  missions: Mission[];
  
  // Caregiver Condition (Secondary/Optional)
  caregiverEnergy?: EnergyLevel;
  caregiverMood?: Mood;

  wishlist: string; // Optional extra message
  autoBriefing: string;
  timestamp: Date;
  isEarlyExit?: boolean;
  authorName?: string; // 작성자 이름 추가
}

export interface User {
  id: string;
  name: string;
  role: 'Mom' | 'Dad';
  avatar: string;
  isDuty: boolean;
  batteryLevel: number; // 0-100
}

export interface ScheduleItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  startTime: string; // "08:00"
  endTime: string; // "13:00"
  type: 'care' | 'chores' | 'play' | 'empty';
  description: string;
  isWarning?: boolean; // For overlapping
}
