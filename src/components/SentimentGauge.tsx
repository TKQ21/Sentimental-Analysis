interface Props {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export function SentimentGauge({ positive, neutral, negative, total }: Props) {
  const score = total > 0 ? ((positive - negative) / total) * 100 : 0;
  const normalizedScore = Math.max(-100, Math.min(100, score));
  const displayScore = ((normalizedScore + 100) / 2).toFixed(0);
  const angle = ((normalizedScore + 100) / 200) * 180 - 90;

  const label = normalizedScore > 25 ? "Positive" : normalizedScore < -25 ? "Negative" : "Mixed";
  const labelColor = normalizedScore > 25
    ? "text-sentiment-positive"
    : normalizedScore < -25
      ? "text-sentiment-negative"
      : "text-sentiment-neutral";

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Overall Sentiment Score</h3>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 120" className="w-48 h-28">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--surface-3))"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Negative zone */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 30"
            fill="none"
            stroke="hsl(var(--sentiment-negative) / 0.4)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Neutral zone */}
          <path
            d="M 72 24 A 80 80 0 0 1 128 24"
            fill="none"
            stroke="hsl(var(--sentiment-neutral) / 0.4)"
            strokeWidth="14"
          />
          {/* Positive zone */}
          <path
            d="M 140 30 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--sentiment-positive) / 0.4)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            y2={100 - 60 * Math.sin((angle * Math.PI) / 180)}
            stroke="hsl(var(--foreground))"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" />
        </svg>
        <p className="text-3xl font-display font-bold mt-2">{displayScore}</p>
        <p className={`text-sm font-semibold ${labelColor}`}>{label}</p>
        <p className="text-xs text-muted-foreground mt-1">Score out of 100</p>
      </div>
    </div>
  );
}
