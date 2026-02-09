import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Zap, BarChart3, Radio, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface PrimaryNavProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function PrimaryNav({ mobile = false, onNavigate }: PrimaryNavProps) {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { isAdmin } = useCurrentUser();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/simulator', label: 'Simulator', icon: Zap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/live', label: 'Live', icon: Radio },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  if (mobile) {
    return (
      <nav className="flex flex-col gap-1 p-4">
        <div className="mb-4 pb-4 border-b border-primary/30">
          <h2 className="font-heading text-lg font-bold text-primary">Navigation</h2>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-md'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground border-l-4 border-transparent'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary/20 text-primary border-2 border-primary/50 shadow-aviator-glow'
                : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground border-2 border-transparent'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
