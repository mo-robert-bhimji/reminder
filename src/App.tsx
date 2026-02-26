import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { db } from './db/schema';
import ReminderCard from './components/reminders/ReminderCard';
import ReminderForm from './components/reminders/ReminderForm';
import Dashboard from './components/reports/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reminders' | 'dashboard'>('reminders');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    loadReminders();
  }, [activeTab]);

  const loadReminders = async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const allReminders = await db.reminders.where('isActive').equals(1).toArray();
    const upcoming = allReminders.filter(r => {
      const reminderDate = new Date(`${r.scheduledDate} ${r.scheduledTime}`);
      return reminderDate >= now;
    });
    
    const allLogs = await db.activityLogs.toArray();
    const completed = allLogs.filter(l => {
      const logDate = new Date(l.timestamp).toISOString().split('T')[0];
      return logDate === today && l.action === 'completed';
    });
    
    const sorted = upcoming.sort((a: any, b: any) => {
      const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime();
      const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime();
      return dateA - dateB;
    });
    
    setReminders(sorted);
    setCompletedToday(completed.length);
  };

  const handleReminderSaved = () => {
    loadReminders();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">{activeTab === 'reminders' ? 'Reminders' : 'Dashboard'}</h1>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'reminders' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'reminders' ? (
          <div className="space-y-4">
            {/* Today's Progress */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Completed Today</p>
                  <p className="text-2xl font-bold text-white">{completedToday}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Upcoming</p>
                  <p className="text-2xl font-bold text-white">{reminders.length}</p>
                </div>
              </div>
            </div>

            {/* Reminders List */}
            {reminders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No upcoming reminders</p>
                <p className="text-sm mt-1">Tap + to create your first reminder!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Dashboard onSampleGenerated={loadReminders} />
        )}
      </main>

      {/* Floating Add Button - Bottom Center */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
        style={{ backgroundColor: '#2563eb' }}
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* New Reminder Form Modal */}
      <ReminderForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleReminderSaved}
      />
    </div>
  );
}