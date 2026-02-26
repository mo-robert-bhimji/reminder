import { useState, useEffect } from 'react';
import { X, Check, XCircle, Edit2, Trash2, Clock } from 'lucide-react';
import { updateReminder, deleteReminder, logActivity, getReminderById } from '../../db/queries';
import { categories } from '../../utils/categories';

interface ReminderDetailProps {
  reminderId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ReminderDetail({ reminderId, isOpen, onClose, onUpdated }: ReminderDetailProps) {
  const [reminder, setReminder] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (reminderId && isOpen) {
      loadReminder();
    }
  }, [reminderId, isOpen]);

  const loadReminder = async () => {
    if (!reminderId) return;
    const data = await getReminderById(reminderId);
    setReminder(data);
    setEditData(data);
  };

  if (!isOpen || !reminder) return null;

  const handleComplete = async () => {
    await logActivity({
      reminderId: reminder.id,
      action: 'completed',
      timestamp: Date.now(),
      scheduledTime: new Date(`${reminder.scheduledDate} ${reminder.scheduledTime}`).getTime()
    });
    alert('Reminder completed! ✅');
    onUpdated();
    onClose();
  };

  const handleDismiss = async () => {
    await logActivity({
      reminderId: reminder.id,
      action: 'dismissed',
      timestamp: Date.now(),
      scheduledTime: new Date(`${reminder.scheduledDate} ${reminder.scheduledTime}`).getTime()
    });
    alert('Reminder dismissed');
    onUpdated();
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this reminder?')) return;
    await deleteReminder(reminder.id);
    onUpdated();
    onClose();
  };

  const handleSaveEdit = async () => {
    await updateReminder(reminder.id, editData);
    setIsEditing(false);
    await loadReminder();
    onUpdated();
    alert('Reminder updated!');
  };

  const category = categories[reminder.category as keyof typeof categories] || categories.personal;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Reminder Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={editData.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={editData.scheduledDate || ''}
                  onChange={(e) => setEditData({ ...editData, scheduledDate: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                <input
                  type="time"
                  value={editData.scheduledTime || ''}
                  onChange={(e) => setEditData({ ...editData, scheduledTime: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleSaveEdit}
                className="py-3 rounded-lg font-medium"
                style={{ backgroundColor: '#2563eb', color: 'white' }}
              >
                Save
              </button>
              <button
                onClick={() => { setIsEditing(false); loadReminder(); }}
                className="py-3 rounded-lg font-medium"
                style={{ backgroundColor: '#374151', color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-2xl font-bold text-white">{reminder.title}</h3>
              </div>
              <p className="text-gray-400 mt-1">{reminder.description || 'No description'}</p>
            </div>

            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.label}
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5" />
              <span>{reminder.scheduledDate} at {reminder.scheduledTime}</span>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleComplete}
                  className="py-2 px-1 rounded-lg font-medium text-sm flex flex-col items-center gap-1"
                  style={{ backgroundColor: '#16a34a', color: 'white' }}
                >
                  <Check className="w-5 h-5" />
                  <span className="text-xs">Complete</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-2 px-1 rounded-lg font-medium text-sm flex flex-col items-center gap-1"
                  style={{ backgroundColor: '#dc2626', color: 'white' }}
                >
                  <XCircle className="w-5 h-5" />
                  <span className="text-xs">Dismiss</span>
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="py-2 px-1 rounded-lg font-medium text-sm flex flex-col items-center gap-1"
                  style={{ backgroundColor: '#2563eb', color: 'white' }}
                >
                  <Edit2 className="w-5 h-5" />
                  <span className="text-xs">Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="py-2 px-1 rounded-lg font-medium text-sm flex flex-col items-center gap-1"
                  style={{ backgroundColor: '#7c3aed', color: 'white' }}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-xs">Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}