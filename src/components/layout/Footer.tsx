import { Github, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 mt-auto">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 transition-all hover:scale-[1.01]">
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
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Your centralized portal for BTech CSE study materials. Access assignments, notes, PPTs,
              lab manuals, and more for all your courses in one place.
            </p>
            <p className="text-xs text-muted-foreground/60 italic">
              For educational and non-commercial use only.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase text-foreground/80">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  About StudyHub
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  Admin Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase text-foreground/80">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary/70" />
                <span>support@studyhub.edu</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Github className="h-4 w-4 text-primary/70" />
                <a href="https://github.com/rachitparashar7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                  rachitparashar7
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground/75">
            © {new Date().getFullYear()} StudyHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground/75 flex items-center gap-1.5 font-medium">
            Made with <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" /> for CSE students
          </p>
        </div>
      </div>
    </footer>
  );
}
