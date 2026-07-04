import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-background text-white">
      {/* Background Image with Parallax / Fixed feel */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 select-none pointer-events-none"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      />
      
      {/* Dynamic Glowing backdrop orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb -top-40 -right-40 h-[450px] w-[450px] bg-primary/25 blur-[120px] dark:bg-primary/20" />
        <div className="glow-orb -bottom-40 -left-40 h-[400px] w-[400px] bg-secondary/20 blur-[100px]" />
        <div className="glow-orb top-1/2 left-1/3 h-[500px] w-[500px] bg-indigo-500/10 blur-[130px] -translate-y-1/2" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Sparkly Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/90 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-default"
          >
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span>Your complete BTech CSE study companion</span>
          </motion.div>

          {/* Dynamic Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Master Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 font-extrabold">
                BTech CSE
              </span>
              <span className="absolute bottom-2 left-0 right-0 h-[6px] bg-primary/20 -z-0 rounded" />
            </span>
            {' '}Journey
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Access comprehensive, structured study materials. From Operating Systems to 
            Machine Learning, find assignments, notes, PPTs, and lab manuals organized by semester.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/courses">
              <Button size="lg" className="h-14 px-8 gap-3 text-base font-semibold shadow-lg hover:shadow-primary/30 transition-all duration-300 btn-shine bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 rounded-xl">
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-2xl p-6 md:p-8"
          >
            <div className="text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">7+</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Courses</div>
            </div>
            
            <div className="text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">8</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Semesters</div>
            </div>

            <div className="text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">100+</div>
              <div className="text-xs md:text-sm text-slate-400 font-medium">Resources</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
