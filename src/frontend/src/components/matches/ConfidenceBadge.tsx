import { Badge } from '@/components/ui/badge';
import { ConfidenceLevel } from '@/backend';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export default function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  const config = {
    [ConfidenceLevel.veryHigh]: {
      label: 'Very High',
      className: 'bg-confidence-very-high text-primary-foreground border-confidence-very-high',
    },
    [ConfidenceLevel.high]: {
      label: 'High',
      className: 'bg-confidence-high text-primary-foreground border-confidence-high',
    },
    [ConfidenceLevel.moderate]: {
      label: 'Moderate',
      className: 'bg-confidence-moderate text-primary-foreground border-confidence-moderate',
    },
    [ConfidenceLevel.low]: {
      label: 'Low',
      className: 'bg-confidence-low text-primary-foreground border-confidence-low',
    },
  };

  const { label, className: badgeClassName } = config[level];

  return (
    <Badge variant="outline" className={cn('font-medium', badgeClassName, className)}>
      {label}
    </Badge>
  );
}
