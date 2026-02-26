import Dexie from 'dexie';

export interface Reminder {
  id?: number;
  title: string;
  description: string;
  category: 'health' | 'work' | 'personal' | 'family' | 'finance' | 'home' | 'education' | 'social';
  scheduledDate: string;
  scheduledTime: string;
  repeatType: 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  repeatConfig?: {
    interval?: number;
    selectedDays?: number[];
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

class ReminderDatabase extends Dexie {
  reminders!: Dexie.Table<Reminder, number>;
  activityLogs!: Dexie.Table<ActivityLog, number>;

  constructor() {
    super('ReminderAppDB');
    this.version(2).stores({
      reminders: '++id, isActive, scheduledDate, scheduledTime, category',
      activityLogs: '++id, reminderId, timestamp, action'
    });
  }
}

export const db = new ReminderDatabase();