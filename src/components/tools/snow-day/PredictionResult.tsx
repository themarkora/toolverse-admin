interface PredictionResultProps {
  prediction: string | null;
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  if (!prediction) return null;

  return (
    <div className="animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-4">
        <p className="text-white text-center">{prediction}</p>
      </div>
    </div>
  );
}