import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex items-center justify-center py-16 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
        {/* Glowing backdrop highlights */}
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10 w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            <Card className="border-border/50 bg-card/65 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
              {/* Colored top decoration */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />
              
              <CardHeader className="text-center pt-8 pb-4">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform hover:scale-110 duration-300">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="font-display text-2xl font-bold tracking-tight">Admin Login</CardTitle>
                <CardDescription className="text-sm">
                  Sign in to access academic resource catalogs
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="rounded-xl py-3 border-destructive/35 bg-destructive/5 text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-border/60 focus-visible:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl border-border/60 focus-visible:ring-primary"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 font-semibold rounded-xl bg-primary hover:bg-primary/95 transition-all mt-6 shadow-md hover:shadow-primary/10" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
                
                <div className="mt-8 border-t border-border/40 pt-6 text-center">
                  <p className="text-xs text-muted-foreground leading-relaxed flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                    <span>Admin access is restricted to authorized personnel.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
