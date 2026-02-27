import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Clock, Award, Plus, ChevronRight } from 'lucide-react';
import ScoreSpinner from '@/components/ScoreSpinner';
import Navbar from '@/components/Navbar';
import { mockHistory } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('full_name').eq('user_id', user.id).single()
      .then(({ data }) => setProfileName(data?.full_name || user.email?.split('@')[0] || 'User'));
  }, [user]);

  if (loading || !user) return null;

  const avgScore = Math.round(mockHistory.reduce((a, h) => a + h.overallScore, 0) / mockHistory.length);

  const stats = [
    { icon: FileText, label: 'Papers Analyzed', value: mockHistory.length, color: 'text-primary' },
    { icon: TrendingUp, label: 'Average Score', value: `${avgScore}/100`, color: 'text-success' },
    { icon: Clock, label: 'Last Analysis', value: '2 days ago', color: 'text-suggestion' },
    { icon: Award, label: 'Best Score', value: `${Math.max(...mockHistory.map(h => h.overallScore))}/100`, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Welcome back, {profileName.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Ready to review your next thesis? Here's your overview.</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => navigate('/analysis')}
          className="w-full sm:w-auto mb-8 px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-display font-semibold text-lg flex items-center gap-3 hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus size={22} /> Analyze New Paper
        </motion.button>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 shadow-card"
            >
              <stat.icon size={22} className={`${stat.color} mb-3`} />
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {mockHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/analysis', { state: { loadDemo: true } })}
                className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-card transition-shadow cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.fileName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <ScoreSpinner score={item.overallScore} label="" size={48} animated={false} />
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
