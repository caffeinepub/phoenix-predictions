import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export default function KpiCard({ label, value, icon: Icon, trend, trendValue }: KpiCardProps) {
  return (
    <Card className="aviator-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="text-3xl font-bold text-primary mb-1">{value}</p>
        {trend && trendValue && (
          <div className="flex items-center gap-1 text-sm">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
