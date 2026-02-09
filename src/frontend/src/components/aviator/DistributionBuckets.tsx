interface DistributionBucketsProps {
  distribution: {
    under_1x: number;
    x_1_to_2: number;
    x_2_to_5: number;
    x_5_to_10: number;
    x_10_plus: number;
  };
}

export default function DistributionBuckets({ distribution }: DistributionBucketsProps) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  
  const buckets = [
    { label: 'Under 1.0x', value: distribution.under_1x, color: 'bg-red-500' },
    { label: '1.0x - 2.0x', value: distribution.x_1_to_2, color: 'bg-orange-500' },
    { label: '2.0x - 5.0x', value: distribution.x_2_to_5, color: 'bg-yellow-500' },
    { label: '5.0x - 10.0x', value: distribution.x_5_to_10, color: 'bg-green-500' },
    { label: '10.0x+', value: distribution.x_10_plus, color: 'bg-primary' },
  ];

  return (
    <div className="space-y-3">
      {buckets.map((bucket) => {
        const percentage = total > 0 ? ((bucket.value / total) * 100).toFixed(1) : '0.0';
        return (
          <div key={bucket.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{bucket.label}</span>
              <span className="font-medium">
                {bucket.value} ({percentage}%)
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${bucket.color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
