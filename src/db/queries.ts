import { db } from './schema';

export const addReminder = async (reminder: any) => {
  return await db.reminders.add(reminder);
};

export const getAllReminders = async () => {
  return await db.reminders.toArray();
};

export const getReminderById = async (id: number) => {
  return await db.reminders.get(id);
};

export const updateReminder = async (id: number, updates: any) => {
  return await db.reminders.update(id, updates);
};

export const deleteReminder = async (id: number) => {
  return await db.reminders.delete(id);
};

export const logActivity = async (log: any) => {
  return await db.activityLogs.add(log);
};

export const getActivityLogs = async (reminderId: number) => {
  return await db.activityLogs.where('reminderId').equals(reminderId).toArray();
};