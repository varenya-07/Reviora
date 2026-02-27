import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Save, GraduationCap, Building, BookOpen, Tag, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const educationCategories = [
  { value: 'undergrad', label: 'Undergraduate Student' },
  { value: 'postgrad', label: 'Postgraduate Student' },
  { value: 'phd', label: 'PhD Researcher' },
  { value: 'professional', label: 'Working Professional' },
  { value: 'faculty', label: 'Faculty / Professor' },
];

const Profile = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    education_category: 'student',
    education_level: '',
    institution: '',
    research_interests: [] as string[],
  });
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'posts'>('info');

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          bio: data.bio || '',
          education_category: data.education_category || 'student',
          education_level: data.education_level || '',
          institution: data.institution || '',
          research_interests: data.research_interests || [],
        });
      }
    };
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setMyPosts(data || []);
    };
    fetchProfile();
    fetchPosts();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        education_category: profile.education_category,
        education_level: profile.education_level,
        institution: profile.institution,
        research_interests: profile.research_interests,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
    }
    setSaving(false);
  };

  const addInterest = () => {
    if (interestInput.trim() && !profile.research_interests.includes(interestInput.trim())) {
      setProfile({ ...profile, research_interests: [...profile.research_interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, research_interests: profile.research_interests.filter(i => i !== interest) });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(270,40%,97%)] to-[hsl(300,30%,95%)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(280,60%,65%)] to-[hsl(320,50%,65%)] text-white flex items-center justify-center font-display font-bold text-2xl">
                {profile.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  {profile.full_name || 'Your Profile'}
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'info' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'posts' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              My Posts ({myPosts.length})
            </button>
          </div>

          {activeTab === 'info' && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <GraduationCap size={14} /> Full Name
                </label>
                <input
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <BookOpen size={14} /> Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us about your research interests..."
                />
              </div>

              {/* Education Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <GraduationCap size={14} /> Education Category
                </label>
                <select
                  value={profile.education_category}
                  onChange={(e) => setProfile({ ...profile, education_category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {educationCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Education Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <GraduationCap size={14} /> Field of Study
                </label>
                <input
                  value={profile.education_level}
                  onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
                  placeholder="e.g., Computer Science, Psychology"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Institution */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Building size={14} /> Institution
                </label>
                <input
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  placeholder="e.g., MIT, Stanford University"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Research Interests */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Tag size={14} /> Research Interests
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="Add interest and press Enter"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={addInterest} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.research_interests.map((interest) => (
                    <span key={interest} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(280,40%,92%)] text-[hsl(280,50%,40%)] text-xs font-medium">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(280,60%,65%)] to-[hsl(320,50%,65%)] text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-3">
              {myPosts.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <FileText size={40} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">You haven't posted anything yet.</p>
                  <button
                    onClick={() => navigate('/community')}
                    className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                  >
                    Go to Community
                  </button>
                </div>
              ) : (
                myPosts.map((post) => (
                  <div key={post.id} className="bg-card rounded-xl border border-border p-4 shadow-card">
                    <p className="text-sm text-foreground">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>❤️ {post.likes_count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
