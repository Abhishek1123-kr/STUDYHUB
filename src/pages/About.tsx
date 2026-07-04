import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/database';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Mail, Github, Heart, MessageSquare, Terminal } from 'lucide-react';

const About = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);

    await supabase.from('contact_messages').insert({
      name,
      email,
      message,
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setLoading(false);

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Layout>
      <div className="min-h-screen py-16 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
        {/* Glowing backdrop highlights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 max-w-5xl mx-auto px-4 md:px-6 space-y-24">

          {/* ================= HERO SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Centralized Learning Resource</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                StudyHub
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              StudyHub is a premium academic catalog designed to help BTech CSE students access notes, assignments, 
              syllabus, and lab manuals organized cleanly by semester and subject.
            </p>
          </motion.div>

          {/* Overview Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card/45 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Developed to eliminate the friction of searching through messy email threads and chat groups for exam notes, StudyHub acts as a single-source library. All materials are categorized systematically into courses, semesters, subjects, and chapters.
                </p>
              </div>
              
              <div className="bg-muted/30 border border-border/40 rounded-xl p-4.5 text-xs text-muted-foreground/80 leading-relaxed">
                <span className="font-bold block text-foreground mb-1 text-xs">Academic Disclaimer</span>
                StudyHub is a student-led educational directory. Resources are uploaded for reference purposes. Authorship remains with the respective copyright owners. Reach out below to request material updates or take-downs.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card/45 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold font-display mb-4">Key Advantages</h2>
                <ul className="space-y-4">
                  {[
                    { title: 'Semantic Structuring', desc: 'Materials filtered by subject chapters' },
                    { title: 'Secure Admin Space', desc: 'Protected login portal for resource managers' },
                    { title: 'Active Status Cues', desc: 'Indicates live syllabus semesters from locked modules' },
                    { title: 'Adaptive Typography', desc: 'Optimized readability with full dark mode compatibility' }
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                      <div>
                        <strong className="text-sm font-semibold text-foreground block">{feat.title}</strong>
                        <span className="text-xs text-muted-foreground">{feat.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Core Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-2.5 py-0.5 text-xs rounded-md border border-border/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= ADMIN ADVERTISING BLOCK ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary/5 via-indigo-500/5 to-secondary/5 rounded-3xl p-8 md:p-12 border border-primary/10 shadow-lg text-center max-w-4xl mx-auto space-y-6"
          >
            <Shield className="h-14 w-14 mx-auto text-primary animate-pulse" />
            <h2 className="text-3xl font-extrabold font-display tracking-tight">
              Administrative Control Panel
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              Administrators hold the key to study catalogues. Authorised users can manage courses, create syllabus indexes, and upload new materials.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link to="/login">
                <Button size="lg" className="px-8 font-semibold rounded-xl btn-shine bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 shadow-md">
                  🔐 Portal Login
                </Button>
              </Link>
              <a href="#contact-section">
                <Button variant="outline" size="lg" className="px-8 font-semibold border-border/60 rounded-xl">
                  Contact Admin
                </Button>
              </a>
            </div>
            
            <p className="text-xs text-muted-foreground/75">
              Strict role-based permissions enforced • Security logs audited
            </p>
          </motion.div>

          {/* ================= CONTACT & GET IN TOUCH ================= */}
          <div id="contact-section" className="grid md:grid-cols-5 gap-12 items-start max-w-4xl mx-auto">
            {/* Contact Details / Developer Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Contact Info
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Have questions, recommendations, or new study notes to contribute? Send a message directly.
                </p>
              </div>

              {/* Developer Profile card */}
              <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg font-display">
                    RP
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Rachit Parashar</h3>
                    <p className="text-xs text-muted-foreground">Full Stack Developer</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary/75" />
                    <span>rachit.dev@example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5 text-primary/75" />
                    <a href="https://github.com/rachitparashar7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      github.com/rachitparashar7
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3 bg-card/65 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm"
            >
              <h2 className="text-xl font-bold font-display mb-6">Send Message</h2>

              {submitted ? (
                <div className="text-center py-8 space-y-2">
                  <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-full mx-auto">✓</div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    Thank you! Message delivered successfully.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-xl border-border/60 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-border/60 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <Textarea
                      rows={4}
                      placeholder="Write your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="rounded-xl border-border/60 focus-visible:ring-primary resize-none"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full rounded-xl bg-primary hover:bg-primary/90 font-semibold">
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-muted-foreground/75 flex items-center justify-center gap-1.5 pt-4 border-t border-border/30">
            <span>Developed with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for final year project submission</span>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default About;
