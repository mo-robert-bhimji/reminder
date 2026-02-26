import { useEffect, useState } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { getAllReminders } from './db/queries';
import ReminderForm from './components/reminders/ReminderForm.tsx';
import ReminderCard from './components/reminders/ReminderCard.tsx';
import ReminderDetail from './components/reminders/ReminderDetail.tsx';
import Dashboard from './components/reports/Dashboard.tsx';

function App() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'reminders' | 'dashboard'>('reminders');

  const loadReminders = async () => {
    const data = await getAllReminders();
    const sorted = data.sort((a, b) => {
      return new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime() - 
             new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime();
    });
    setReminders(sorted);
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleCardClick = (id: number) => {
    setSelectedReminderId(id);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">
            {currentTab === 'reminders' ? 'Reminders' : 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-400">
            {currentTab === 'reminders' ? `${reminders.length} active reminders` : 'Your activity overview'}
          </p>
        </div>

<div className="flex border-t border-gray-800">
  <button
    onClick={() => setCurrentTab('reminders')}
    className={`flex-1 py-3 text-sm font-medium ${
      currentTab === 'reminders' 
        ? 'text-blue-400 border-b-2 border-blue-500' 
        : 'text-gray-400'
    }`}
  >
    Reminders
  </button>
  <button
    onClick={() => setCurrentTab('dashboard')}
    className={`flex-1 py-3 text-sm font-medium ${
      currentTab === 'dashboard' 
        ? 'text-blue-400 border-b-2 border-blue-500' 
        : 'text-gray-400'
    }`}
  >
    Dashboard
  </button>
</div>
      </header>

      {currentTab === 'reminders' ? (
        <main className="max-w-md mx-auto px-4 py-6 space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No reminders yet</p>
              <p className="text-sm text-gray-500">Tap + to create one</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <ReminderCard 
                key={reminder.id} 
                reminder={reminder} 
                onClick={() => handleCardClick(reminder.id)}
              />
            ))
          )}
        </main>
      ) : (
        <main className="max-w-md mx-auto">
          <Dashboard />
        </main>
      )}

      {currentTab === 'reminders' && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition active:scale-95"
          style={{ backgroundColor: '#2563eb' }}
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      <ReminderForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSaved={loadReminders}
      />

      <ReminderDetail
        reminderId={selectedReminderId}
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedReminderId(null); }}
        onUpdated={loadReminders}
      />
    </div>
  )
}

export default App