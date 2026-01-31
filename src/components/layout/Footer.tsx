import { GraduationCap, Github, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
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
            <p className="text-muted-foreground text-sm max-w-md">
              Your centralized portal for BTech CSE study materials. Access assignments, notes, PPTs, 
              lab manuals, and more for all your courses in one place.<br />
              For educational and non-commercial use only.

            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@studyhub.edu
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-4 w-4" />
                <a href="https://github.com/rachitparashar7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  rachitparashar7
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudyHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
}
