import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Zap, BarChart3, Radio, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomTabNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const tabs = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/simulator', label: 'Simulator', icon: Zap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/live', label: 'Live', icon: Radio },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t-2 border-primary/30 bg-card/98 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_8px_rgba(163,255,0,0.6)]')} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
