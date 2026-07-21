import { Download, FolderOpen, Search, Shield, Zap, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FolderOpen,
    title: 'Organized by Course',
    description: 'All materials neatly organized by course, semester, and subject for easy navigation.',
    color: 'from-blue-500/10 to-indigo-500/10',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  {
    icon: Download,
    title: 'Easy Downloads',
    description: 'Download assignments, notes, PPTs, and lab manuals with a single click.',
    color: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    icon: Search,
    title: 'Quick Access',
    description: 'Find what you need quickly with our intuitive navigation system.',
    color: 'from-amber-500/10 to-orange-500/10',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    icon: Shield,
    title: 'Secure Admin',
    description: 'Protected admin panel for authorized content management.',
    color: 'from-rose-500/10 to-red-500/10',
    iconColor: 'text-rose-500 dark:text-rose-400',
  },
  {
    icon: Zap,
    title: 'Always Updated',
    description: 'Stay current with the latest study materials uploaded by administrators.',
    color: 'from-violet-500/10 to-purple-500/10',
    iconColor: 'text-violet-500 dark:text-purple-400',
  },
  {
    icon: BookMarked,
    title: 'Complete Coverage',
    description: 'From syllabus to lab manuals, access every type of study resource.',
    color: 'from-cyan-500/10 to-sky-500/10',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
  },
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Background soft light highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Succeed
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            StudyHub provides all the tools and resources you need to excel in your BTech journey.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20"
            >
              {/* Highlighted Rounded Icon Wrapper */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} ${feature.iconColor} mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2.5 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
