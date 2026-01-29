import { Download, FolderOpen, Search, Shield, Zap, BookMarked } from 'lucide-react';

const features = [
  {
    icon: FolderOpen,
    title: 'Organized by Course',
    description: 'All materials neatly organized by course, semester, and subject for easy navigation.',
  },
  {
    icon: Download,
    title: 'Easy Downloads',
    description: 'Download assignments, notes, PPTs, and lab manuals with a single click.',
  },
  {
    icon: Search,
    title: 'Quick Access',
    description: 'Find what you need quickly with our intuitive navigation system.',
  },
  {
    icon: Shield,
    title: 'Secure Admin',
    description: 'Protected admin panel for authorized content management.',
  },
  {
    icon: Zap,
    title: 'Always Updated',
    description: 'Stay current with the latest study materials uploaded by administrators.',
  },
  {
    icon: BookMarked,
    title: 'Complete Coverage',
    description: 'From syllabus to lab manuals, access every type of study resource.',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            StudyHub provides all the tools and resources you need to excel in your BTech journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
