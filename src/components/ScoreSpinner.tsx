import { useEffect, useState } from 'react';

interface ScoreSpinnerProps {
  score: number;
  label: string;
  size?: number;
  colorClass?: string;
  animated?: boolean;
}

const ScoreSpinner = ({ score, label, size = 100, colorClass, animated = true }: ScoreSpinnerProps) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (colorClass) return colorClass;
    if (s >= 80) return 'hsl(var(--success))';
    if (s >= 60) return 'hsl(var(--warning))';
    return 'hsl(var(--issue))';
  };

  useEffect(() => {
    if (!animated) return;
    let frame: number;
    let start: number;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score, animated]);

  const color = getScoreColor(displayScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--score-bg))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-display font-bold text-foreground">
            {displayScore}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
};

export default ScoreSpinner;
