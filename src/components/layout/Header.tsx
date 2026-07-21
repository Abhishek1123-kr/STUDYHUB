import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
        ? 'bg-background/85 backdrop-blur-md border-border/80 shadow-md shadow-primary/5'
        : 'bg-background/50 backdrop-blur-sm border-border/20'
      }`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-center p-1 rounded-xl bg-primary/5 dark:bg-primary/10">
            <img
              src="/favicon.ico"
              alt="StudyHub Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            StudyHub
          </span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname.startsWith('/courses') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            Courses
          </Link>

          <Link
            to="/about"
            className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname.startsWith('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            About
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-semibold transition-colors hover:text-primary flex items-center gap-1 ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Action Buttons: Theme Toggle & Admin Auth */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground max-w-[120px] truncate">{user.email}</span>
              <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all" onClick={async () => {
                if (confirm('Are you sure you want to sign out?')) {
                  try {
                    await signOut();
                    navigate('/', { replace: true });
                    console.log('🧭 Navigated to home after sign out');
                  } catch (err) {
                    alert('Sign out failed: ' + (err as Error).message);
                  }
                }
              }}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-xl border-border/60 font-medium">
                Admin Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 text-foreground rounded-xl border border-border/40 hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg">
          <nav className="container flex flex-col py-4 gap-2.5">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-semibold p-2.5 rounded-xl transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-semibold p-2.5 rounded-xl transition-colors ${location.pathname.startsWith('/courses') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                }`}
            >
              Courses
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-semibold p-2.5 rounded-xl transition-colors ${location.pathname.startsWith('/about') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                }`}
            >
              About
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-semibold p-2.5 rounded-xl transition-colors flex items-center gap-2 ${location.pathname.startsWith('/admin') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                  }`}
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <div className="border-t border-border/40 pt-3 mt-1.5">
              {user ? (
                <Button variant="outline" size="sm" className="w-full rounded-xl hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors" onClick={async () => {
                  setIsMenuOpen(false);
                  if (confirm('Are you sure you want to sign out?')) {
                    try {
                      await signOut();
                      navigate('/', { replace: true });
                      console.log('🧭 Navigated to home after sign out (mobile)');
                    } catch (err) {
                      alert('Sign out failed: ' + (err as Error).message);
                    }
                  }
                }}>
                  Sign Out
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
