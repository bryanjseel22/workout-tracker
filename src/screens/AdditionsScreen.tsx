interface AdditionsScreenProps {
  completedCount: number;
  onAddMore: () => void;
  onFinish: () => void;
}

export default function AdditionsScreen({ completedCount, onAddMore, onFinish }: AdditionsScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <div className="text-5xl mb-4">💪</div>
      <h1 className="text-2xl font-bold mb-2">Nice work!</h1>
      <p className="text-zinc-400 mb-10 text-center">
        {completedCount} exercise{completedCount !== 1 ? 's' : ''} done. Add more or wrap up?
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onAddMore}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-xl"
        >
          Add More Exercises
        </button>
        <button
          onClick={onFinish}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl"
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
}
