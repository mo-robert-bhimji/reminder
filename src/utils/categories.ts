export const categories = {
  health: {
    label: 'Health',
    color: '#10b981',
    bgColor: 'bg-emerald-500',
    icon: '🏥'
  },
  work: {
    label: 'Work',
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    icon: '💼'
  },
  personal: {
    label: 'Personal',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500',
    icon: '👤'
  },
  family: {
    label: 'Family',
    color: '#ec4899',
    bgColor: 'bg-pink-500',
    icon: '👨‍👩‍👧‍👦'
  },
  finance: {
    label: 'Finance',
    color: '#f59e0b',
    bgColor: 'bg-amber-500',
    icon: '💰'
  },
  home: {
    label: 'Home',
    color: '#f97316',
    bgColor: 'bg-orange-500',
    icon: '🏠'
  },
  education: {
    label: 'Education',
    color: '#6366f1',
    bgColor: 'bg-indigo-500',
    icon: '📚'
  },
  social: {
    label: 'Social',
    color: '#06b6d4',
    bgColor: 'bg-cyan-500',
    icon: '👥'
  }
} as const;

export type CategoryKey = keyof typeof categories;

export type Category = typeof categories[CategoryKey];