import { Home, TrendingUp, LayoutList, Dumbbell } from 'lucide-react';
import type { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onStartWorkout: () => void;
}

const NAV_ITEMS = [
  { screen: 'home' as Screen, icon: Home, label: 'Home' },
  { screen: 'prs' as Screen, icon: TrendingUp, label: 'PRs' },
  { screen: 'templates' as Screen, icon: LayoutList, label: 'Templates' },
];

export default function BottomNav({ currentScreen, onNavigate, onStartWorkout }: BottomNavProps) {
  const isWorkoutScreen = ['opening', 'builder', 'execute', 'additions', 'summary', 'template-builder'].includes(currentScreen);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex safe-bottom">
      {NAV_ITEMS.map(({ screen, icon: Icon, label }) => (
        <button
          key={screen}
          onClick={() => onNavigate(screen)}
          className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
            currentScreen === screen && !isWorkoutScreen
              ? 'text-indigo-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label={label}
        >
          <Icon size={22} />
          <span className="text-xs">{label}</span>
        </button>
      ))}
      <button
        onClick={onStartWorkout}
        className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
          isWorkoutScreen ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Start workout"
      >
        <Dumbbell size={22} />
        <span className="text-xs">Workout</span>
      </button>
    </div>
  );
}
