import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Clock, Award, LogOut, Plus, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';
import ScoreSpinner from '@/components/ScoreSpinner';
import { mockHistory } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('reviora_user');
    if (!stored) { navigate('/'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('reviora_user');
    navigate('/');
  };

  if (!user) return null;

  const avgScore = Math.round(mockHistory.reduce((a, h) => a + h.overallScore, 0) / mockHistory.length);

  const stats = [
    { icon: FileText, label: 'Papers Analyzed', value: mockHistory.length, color: 'text-primary' },
    { icon: TrendingUp, label: 'Average Score', value: `${avgScore}/100`, color: 'text-success' },
    { icon: Clock, label: 'Last Analysis', value: '2 days ago', color: 'text-suggestion' },
    { icon: Award, label: 'Best Score', value: `${Math.max(...mockHistory.map(h => h.overallScore))}/100`, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to review your next thesis? Here's your overview.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/analysis')}
          className="w-full sm:w-auto mb-8 px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-display font-semibold text-lg flex items-center gap-3 hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus size={22} />
          Analyze New Paper
        </motion.button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 shadow-card"
            >
              <stat.icon size={22} className={`${stat.color} mb-3`} />
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
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
