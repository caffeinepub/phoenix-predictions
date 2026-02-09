import { Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import PrimaryNav from '@/components/navigation/PrimaryNav';
import BottomTabNav from '@/components/navigation/BottomTabNav';
import LoginButton from '@/components/auth/LoginButton';
import ProfileSetupDialog from '@/components/auth/ProfileSetupDialog';
import RequireAuth from '@/components/auth/RequireAuth';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  
  usePostLoginRedirect();

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileSetupDialog />
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/aviator-logo.dim_512x512.png" 
                alt="Aviator Analytics" 
                className="h-10 w-10"
              />
              <span className="font-heading text-xl font-bold text-primary aviator-text-glow">
                Aviator Analytics
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <PrimaryNav />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <LoginButton />
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/assets/generated/aviator-logo.dim_512x512.png" 
                        alt="Aviator Analytics" 
                        className="h-8 w-8"
                      />
                      <span className="font-heading text-lg font-bold text-primary">Aviator</span>
                    </div>
                  </div>
                  <nav className="flex-1 p-4">
                    <PrimaryNav mobile onNavigate={() => setMobileMenuOpen(false)} />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 pb-24 md:pb-8">
        <RequireAuth>
          <Outlet />
        </RequireAuth>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomTabNav />

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
