export interface Reminder {
  id?: number;
  title: string;
  description: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  repeatType: 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  repeatConfig?: {
    interval?: number;
    selectedDays?: number[]; // 0-6 (Sun-Sat)
  };
  advanceReminderMin: number;
  isActive: boolean;
  createdAt: number;
}

export interface ActivityLog {
  id?: number;
  reminderId: number;
  action: 'completed' | 'dismissed' | 'snoozed';
  timestamp: number;
  scheduledTime: number;
}