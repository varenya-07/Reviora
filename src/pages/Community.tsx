import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Heart, Send, UserPlus, UserCheck, Search, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  user_id: string;
  full_name: string;
  bio: string | null;
  education_category: string | null;
  institution: string | null;
  research_interests: string[] | null;
}

interface PostData {
  id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  profile?: ProfileData;
}

// Demo profiles for hackathon demo
const demoProfiles: ProfileData[] = [
  {
    user_id: 'demo-1',
    full_name: 'Aisha Patel',
    bio: 'PhD researcher focusing on AI ethics and responsible AI deployment in healthcare systems.',
    education_category: 'phd',
    institution: 'Stanford University',
    research_interests: ['Artificial Intelligence', 'Healthcare', 'Ethics', 'Machine Learning'],
  },
  {
    user_id: 'demo-2',
    full_name: 'Carlos Rivera',
    bio: 'Postgrad student researching NLP applications in educational assessment tools.',
    education_category: 'postgrad',
    institution: 'MIT',
    research_interests: ['Natural Language Processing', 'Education Technology', 'Machine Learning'],
  },
  {
    user_id: 'demo-3',
    full_name: 'Mei Chen',
    bio: 'Undergraduate passionate about climate science and data visualization techniques.',
    education_category: 'undergrad',
    institution: 'UC Berkeley',
    research_interests: ['Climate Science', 'Data Visualization', 'Environmental Policy'],
  },
  {
    user_id: 'demo-4',
    full_name: 'James Okonkwo',
    bio: 'PhD candidate exploring AI-driven assessment tools for university education systems.',
    education_category: 'phd',
    institution: 'Oxford University',
    research_interests: ['Artificial Intelligence', 'Education Technology', 'Assessment', 'Ethics'],
  },
];

const demoPosts: PostData[] = [
  {
    id: 'demo-post-1',
    user_id: 'demo-1',
    content: '🔬 Just published my paper on ethical AI frameworks in clinical decision-making! The peer review process was tough but rewarding. Anyone else working in AI healthcare ethics?',
    likes_count: 12,
    created_at: '2026-02-25T10:00:00Z',
    profile: demoProfiles[0],
  },
  {
    id: 'demo-post-2',
    user_id: 'demo-2',
    content: 'Looking for collaborators on an NLP project that uses transformer models to evaluate thesis structure automatically. If you are into ML + EdTech, let us connect! 🤖📚',
    likes_count: 8,
    created_at: '2026-02-24T14:30:00Z',
    profile: demoProfiles[1],
  },
  {
    id: 'demo-post-3',
    user_id: 'demo-4',
    content: 'Interesting finding: AI-powered feedback tools improve thesis quality by 23% on average compared to manual peer review alone. Ethics of automation in academia is fascinating.',
    likes_count: 15,
    created_at: '2026-02-23T09:00:00Z',
    profile: demoProfiles[3],
  },
];

const Community = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'discover'>('feed');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchPosts();
    fetchProfiles();
    fetchConnections();
    fetchLikes();
  }, [user]);

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsData) {
      // Fetch profiles for all post authors
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);
      
      const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      setPosts([...postsData.map(p => ({ ...p, profile: profileMap.get(p.user_id) })), ...demoPosts]);
    } else {
      setPosts(demoPosts);
    }
  };

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('user_id', user?.id || '');
    setProfiles([...(data || []), ...demoProfiles]);
  };

  const fetchConnections = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);
    setConnections(data || []);
  };

  const fetchLikes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);
    setLikedPosts(new Set(data?.map(l => l.post_id) || []));
  };

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setPosting(true);
    const { error } = await supabase
      .from('posts')
      .insert({ user_id: user.id, content: newPost.trim() });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setNewPost('');
      fetchPosts();
    }
    setPosting(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    if (likedPosts.has(postId)) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      await supabase.from('posts').update({ likes_count: Math.max(0, (posts.find(p => p.id === postId)?.likes_count || 1) - 1) }).eq('id', postId);
      setLikedPosts(prev => { const n = new Set(prev); n.delete(postId); return n; });
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      await supabase.from('posts').update({ likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) + 1 }).eq('id', postId);
      setLikedPosts(prev => new Set([...prev, postId]));
    }
    fetchPosts();
  };

  const handleConnect = async (receiverId: string) => {
    if (!user) return;
    const existing = connections.find(
      c => (c.requester_id === user.id && c.receiver_id === receiverId) ||
           (c.requester_id === receiverId && c.receiver_id === user.id)
    );
    if (existing) {
      toast({ title: 'Already connected or pending', description: 'You already have a connection with this person.' });
      return;
    }
    const { error } = await supabase
      .from('connections')
      .insert({ requester_id: user.id, receiver_id: receiverId });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request sent! 🎉', description: 'Connection request has been sent.' });
      fetchConnections();
    }
  };

  const handleAcceptConnection = async (connectionId: string) => {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);
    if (!error) {
      toast({ title: 'Connected! 🤝' });
      fetchConnections();
    }
  };

  const getConnectionStatus = (userId: string) => {
    const conn = connections.find(
      c => (c.requester_id === user?.id && c.receiver_id === userId) ||
           (c.requester_id === userId && c.receiver_id === user?.id)
    );
    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.requester_id === user?.id) return 'sent';
    return 'received';
  };

  const pendingRequests = connections.filter(c => c.receiver_id === user?.id && c.status === 'pending');

  const filteredProfiles = profiles.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.institution?.toLowerCase().includes(q) ||
      p.research_interests?.some(i => i.toLowerCase().includes(q))
    );
  });

  // Suggested profiles based on matching interests
  const myProfile = profiles.find(p => p.user_id === user?.id);
  const suggestedProfiles = filteredProfiles
    .filter(p => p.user_id !== user?.id)
    .sort((a, b) => {
      const myInterests = myProfile?.research_interests || [];
      const aMatch = a.research_interests?.filter(i => myInterests.includes(i)).length || 0;
      const bMatch = b.research_interests?.filter(i => myInterests.includes(i)).length || 0;
      return bMatch - aMatch;
    });

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <Users size={24} /> Community
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Connect with fellow research enthusiasts</p>
            </div>
          </div>

          {/* Pending requests */}
          {pendingRequests.length > 0 && (
            <div className="bg-[hsl(280,40%,95%)] rounded-xl border border-[hsl(280,30%,85%)] p-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">📬 Pending Connection Requests</h3>
              <div className="space-y-2">
                {pendingRequests.map((req) => {
                  const profile = profiles.find(p => p.user_id === req.requester_id);
                  return (
                    <div key={req.id} className="flex items-center justify-between bg-card rounded-lg p-3">
                      <span className="text-sm font-medium text-foreground">{profile?.full_name || 'Unknown'}</span>
                      <button
                        onClick={() => handleAcceptConnection(req.id)}
                        className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                      >
                        Accept
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'feed' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              <MessageSquare size={14} /> Feed
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'discover' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              <Users size={14} /> Discover People
            </button>
          </div>

          {activeTab === 'feed' && (
            <div className="space-y-4">
              {/* Create post */}
              <div className="bg-card rounded-xl border border-border p-4 shadow-card">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your research insights, ask questions, or post updates..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handlePost}
                    disabled={!newPost.trim() || posting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>

              {/* Posts */}
              {posts.map((post) => (
                <div key={post.id} className="bg-card rounded-xl border border-border p-4 shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[hsl(280,60%,65%)] to-[hsl(320,50%,65%)] text-white flex items-center justify-center text-xs font-bold">
                      {post.profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{post.profile?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.profile?.institution && `${post.profile.institution} · `}
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-3">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                        likedPosts.has(post.id) ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                      }`}
                    >
                      <Heart size={14} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                      {post.likes_count}
                    </button>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare size={40} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, institution, or research interests..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Profiles */}
              {suggestedProfiles.map((p) => {
                const status = getConnectionStatus(p.user_id);
                return (
                  <div key={p.user_id} className="bg-card rounded-xl border border-border p-4 shadow-card flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(280,60%,65%)] to-[hsl(320,50%,65%)] text-white flex items-center justify-center font-bold shrink-0">
                      {p.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{p.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{p.institution || 'No institution'} · {p.education_category}</p>
                      {p.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.bio}</p>}
                      {p.research_interests && p.research_interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.research_interests.map(i => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-[hsl(280,40%,92%)] text-[hsl(280,50%,40%)] text-xs">
                              {i}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {status === 'none' && (
                        <button
                          onClick={() => handleConnect(p.user_id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                        >
                          <UserPlus size={12} /> Connect
                        </button>
                      )}
                      {status === 'sent' && (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
                          Pending
                        </span>
                      )}
                      {status === 'connected' && (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium">
                          <UserCheck size={12} /> Connected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {suggestedProfiles.length === 0 && (
                <div className="text-center py-12">
                  <Users size={40} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No profiles found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Community;
