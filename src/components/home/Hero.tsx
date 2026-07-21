import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, FileText, Sparkles, Code, Cpu, GraduationCap, Database, Terminal, Binary } from 'lucide-react';
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

  const floatingIcons = [
    { Icon: Code, className: "text-blue-500/10 left-[8%] top-[25%] h-14 w-14", delay: 0, duration: 6, yRange: [-12, 12], rotateRange: [-10, 10] },
    { Icon: Cpu, className: "text-purple-500/10 right-[8%] top-[22%] h-16 w-16", delay: 1, duration: 7, yRange: [15, -15], rotateRange: [10, -10] },
    { Icon: GraduationCap, className: "text-indigo-500/10 left-[12%] bottom-[28%] h-16 w-16", delay: 0.5, duration: 8, yRange: [-15, 15], rotateRange: [-8, 8] },
    { Icon: Terminal, className: "text-teal-500/10 right-[12%] bottom-[30%] h-12 w-12", delay: 1.5, duration: 6.5, yRange: [12, -12], rotateRange: [12, -12] },
    { Icon: Database, className: "text-cyan-500/8 left-[28%] top-[14%] h-10 w-10", delay: 2, duration: 5.5, yRange: [-8, 8], rotateRange: [-5, 5] },
    { Icon: Binary, className: "text-blue-500/8 right-[26%] top-[48%] h-12 w-12", delay: 0.8, duration: 6, yRange: [10, -10], rotateRange: [8, -8] },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 pb-16 bg-background text-foreground border-b border-border/40 subtle-grid">
      {/* Spotlight highlight centered at the top */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(47,129,247,0.12),transparent_50%)] pointer-events-none" />

      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {floatingIcons.map((item, index) => {
          const { Icon, className, delay, duration, yRange, rotateRange } = item;
          return (
            <motion.div
              key={index}
              className={`absolute hidden md:block ${className}`}
              animate={{
                y: yRange,
                rotate: rotateRange,
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay,
              }}
            >
              <Icon className="w-full h-full stroke-[1.2]" />
            </motion.div>
          );
        })}
      </div>

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
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-foreground/90 mb-5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-border/80 hover:bg-secondary transition-all duration-300 cursor-default"
          >
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span>Your complete BTech CSE study companion</span>
          </motion.div>

          {/* Dynamic Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]"
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
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed font-light"
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
              <Button size="lg" className="h-14 px-8 gap-3 text-base font-semibold shadow-lg hover:shadow-primary/30 transition-all duration-300 btn-shine bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 rounded-xl text-white">
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto border border-border/80 bg-secondary/35 rounded-2xl p-5 md:p-6"
          >
            <div className="text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">7+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Courses</div>
            </div>

            <div className="text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">8</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Semesters</div>
            </div>

            <div className="text-center group cursor-default">
              <div className="flex justify-center mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-foreground">100+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Resources</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
