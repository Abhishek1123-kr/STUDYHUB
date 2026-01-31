import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center justify-between">
    <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
      <div className="flex items-center justify-center">
        <img
          src="/favicon.ico"
          alt="StudyHub Logo"
          className="h-11 w-11 object-contain"
        />
      </div>
      <span className="font-display text-2xl font-bold text-foreground">
        StudyHub
      </span>
    </Link>
    

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith('/courses') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Courses
          </Link>

          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith('/about') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            About
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container flex flex-col py-4 gap-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium p-2 rounded-md transition-colors ${
                isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium p-2 rounded-md transition-colors ${
                location.pathname.startsWith('/courses') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              Courses
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium p-2 rounded-md transition-colors flex items-center gap-2 ${
                  location.pathname.startsWith('/admin') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <div className="border-t border-border pt-3 mt-2">
              {user ? (
                <Button variant="outline" size="sm" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                  Sign Out
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
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
