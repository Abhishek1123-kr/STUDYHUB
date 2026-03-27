import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/database';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const About = () => {
  // Contact form state
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container space-y-20">

          {/* ================= ABOUT SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              About StudyHub
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              StudyHub is a centralized academic platform designed to help BTech
              CSE students access study materials in a structured, branch-wise,
              semester-wise, and chapter-wise manner.
            </p>
          </motion.div>

          {/* Project Overview */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This project was developed to solve the problem of scattered
                academic resources. StudyHub organizes courses by branch,
                semesters, subjects, and chapters, providing a smooth and
                intuitive learning experience.
                <br/>
                Disclaimer:<br/>
                StudyHub is a student-developed academic project created for educational purposes only.
                All study materials shared on this platform are collected from publicly available sources
                or provided by students for learning reference. The ownership of all materials belongs
                to their respective authors and institutions. If any content violates copyright,
                please contact us for immediate removal.

              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">
                Key Features
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Branch-wise & semester-wise navigation</li>
                <li>Chapter-wise study materials</li>
                <li>Admin-controlled uploads</li>
                <li>Secure and scalable backend</li>
                <li>Modern responsive UI</li>
              </ul>
            </motion.div>
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold mb-6">
              Technology Stack
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'React',
                'TypeScript',
                'Vite',
                'Supabase',
                'Tailwind CSS',
                'Framer Motion',
                'Vercel',
              ].map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </motion.div>

          {/* ================= ADMIN PANEL ACCESS ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 shadow-2xl border border-border/50 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 mx-auto mb-4 text-primary opacity-80" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                Admin Panel
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Authorized administrators can manage courses, subjects, semesters, and upload study materials.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="text-lg px-8 font-semibold shadow-lg hover:shadow-xl">
                  🔐 Admin Login
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 font-semibold border-2">
                Contact Admin
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Secure access only • Role-based permissions
            </p>
          </motion.div>

          {/* ================= GET IN TOUCH SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl shadow-xl max-w-xl mx-auto p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-2">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Have questions, suggestions, or feedback? Feel free to reach out.
            </p>

            {submitted ? (
              <p className="text-center text-green-600 font-semibold">
                Thank you! Your message has been sent 🙌
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Textarea
                  rows={4}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-muted-foreground"
          >
            Developed by <strong>😎Rachit Parashar</strong> <br />
            BTech CSE | Full Stack Web Development Project
          </motion.div>

        </div>
      </div>
    </Layout>
  );
};

export default About;
