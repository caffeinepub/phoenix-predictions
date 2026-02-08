import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import PrimaryNav from '../navigation/PrimaryNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-primary/30 bg-card/98 backdrop-blur-md shadow-lg">
        <div className="container flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-card border-r-2 border-primary/30">
                <PrimaryNav mobile onNavigate={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/phoenix-logo.dim_512x512.png" 
                alt="Phoenix" 
                className="h-12 w-12 object-contain"
              />
              <div className="hidden sm:block">
                <img 
                  src="/assets/generated/phoenix-wordmark.dim_1400x300.png" 
                  alt="Phoenix Predictions" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h1 className="sm:hidden font-heading text-xl font-bold text-primary tracking-tight">
                Phoenix
              </h1>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <PrimaryNav />
          </nav>

          {/* Auth */}
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <ProfileSetupDialog />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-primary/30 bg-card/80 backdrop-blur-sm">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/generated/phoenix-logo.dim_512x512.png" 
                alt="Phoenix" 
                className="h-8 w-8 object-contain opacity-80"
              />
              <span className="text-sm font-medium text-muted-foreground">Phoenix Predictions</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
