interface MultiplierSparklineProps {
  data: number[];
}

export default function MultiplierSparkline({ data }: MultiplierSparklineProps) {
  if (data.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  const width = 800;
  const height = 120;
  const padding = 10;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ minHeight: '120px' }}
      >
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <polyline
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill="url(#sparklineGradient)"
          stroke="none"
        />
        
        <polyline
          points={points}
          fill="none"
          stroke="oklch(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {data.map((value, index) => {
          const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((value - min) / range) * (height - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="oklch(var(--primary))"
              className="opacity-60 hover:opacity-100 transition-opacity"
            />
          );
        })}
      </svg>
    </div>
  );
}
