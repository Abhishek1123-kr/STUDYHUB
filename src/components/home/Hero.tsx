import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, FileText, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Your complete study resource hub</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Master Your{' '}
            <span className="relative">
              <span className="relative z-10">BTech CSE</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-accent/30 -z-0 rounded" />
            </span>
            {' '}Journey
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Access comprehensive study materials for all your courses. From Operating Systems to 
            Machine Learning, find assignments, notes, PPTs, and lab manuals all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/courses">
              <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-6 w-6 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">7+</div>
              <div className="text-sm text-white/60">Courses</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FileText className="h-6 w-6 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-white/60">Semesters</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-6 w-6 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-white/60">Resources</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
