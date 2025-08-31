import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Trophy, BookOpen, DollarSign, TrendingUp, Star, Calendar, Award, Target, Clock, ArrowRight, Heart, Share2, ChevronRight, Plus, Send, Bell, Search } from 'lucide-react';
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment, arrayUnion } from "firebase/firestore";
import { auth } from "../firebase.js";
import { format } from "timeago.js";
import {  fetchPosts } from '../FetchPosts.js';
import { onAuthStateChanged } from "firebase/auth";



const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('forums');
  const [joinedGroups, setJoinedGroups] = useState(new Set([1, 2]));
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]));
  const [joinedChallenges, setJoinedChallenges] = useState(new Set([1]));
  const [notifications, setNotifications] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [userStats, setUserStats] = useState({
    points: 2340,
    rank: 156,
    postsCreated: 12,
    helpfulAnswers: 8,
    challengesCompleted: 3
  });

  function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return user;
}

  const user = useCurrentUser();

   

  const [forumTopics, setForumTopics] = useState([])

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setForumTopics(data);
    };
    loadPosts();
  }, []);

 

  const [studyGroups, setStudyGroups] = useState([
    {
      id: 1,
      name: "Stock Market Beginners",
      members: 2847,
      description: "Learn the basics of stock investing with peers",
      nextMeeting: "Tomorrow at 7 PM EST",
      category: "Investing",
      level: "Beginner",
      icon: "📈"
    },
    {
      id: 2,
      name: "Debt Demolition Squad",
      members: 1923,
      description: "Support group for paying off student loans and credit cards",
      nextMeeting: "Sunday at 3 PM EST",
      category: "Debt",
      level: "All Levels",
      icon: "💪"
    },
    {
      id: 3,
      name: "Crypto Curiosity Club",
      members: 3156,
      description: "Exploring cryptocurrency and blockchain technology",
      nextMeeting: "Friday at 8 PM EST",
      category: "Crypto",
      level: "Intermediate",
      icon: "₿"
    },
    {
      id: 4,
      name: "Budget Masters",
      members: 4521,
      description: "Master budgeting techniques and share success stories",
      nextMeeting: "Wednesday at 6 PM EST",
      category: "Budgeting",
      level: "Beginner",
      icon: "📊"
    }
  ]);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "30-Day No Spend Challenge",
      participants: 1234,
      daysLeft: 12,
      reward: "$50 Gift Card",
      difficulty: "Medium",
      description: "Only essential purchases for 30 days",
      progress: 60,
      isJoined: true
    },
    {
      id: 2,
      title: "Emergency Fund Builder",
      participants: 892,
      daysLeft: 45,
      reward: "Premium Course Access",
      difficulty: "Hard",
      description: "Save $1000 in 90 days",
      progress: 35,
      isJoined: false
    },
    {
      id: 3,
      title: "Investment Knowledge Quiz",
      participants: 567,
      daysLeft: 7,
      reward: "Exclusive Webinar Invite",
      difficulty: "Easy",
      description: "Complete daily finance quizzes",
      progress: 85,
      isJoined: false
    }
  ]);

  const topContributors = [
    { name: "FinanceWiz_Maya", points: 12450, badge: "Gold Expert", avatar: "👑" },
    { name: "BudgetBoss_Mike", points: 8930, badge: "Silver Guide", avatar: "🎖️" },
    { name: "InvestmentIvy", points: 7650, badge: "Bronze Mentor", avatar: "🏆" },
    { name: "DebtDestroyer_Dan", points: 6420, badge: "Rising Star", avatar: "⭐" },
    { name: "SavingsQueen_Sam", points: 5890, badge: "Community Helper", avatar: "💎" },
    { name: "You", points: userStats.points, badge: "Active Member", avatar: "🌟" }
  ].sort((a, b) => b.points - a.points);

  const categories = ["General", "Investing", "Budgeting", "Debt Management", "Income", "Crypto", "Emergency Planning"];

  const showNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

  const handleJoinGroup = (groupId) => {
    const newJoined = new Set(joinedGroups);
    const group = studyGroups.find(g => g.id === groupId);
    
    if (newJoined.has(groupId)) {
      newJoined.delete(groupId);
      showNotification(`Left ${group?.name}`);
      setStudyGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, members: g.members - 1 } : g
      ));
    } else {
      newJoined.add(groupId);
      showNotification(`Joined ${group?.name}! +50 points`);
      setUserStats(prev => ({ ...prev, points: prev.points + 50 }));
      setStudyGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, members: g.members + 1 } : g
      ));
    }
    setJoinedGroups(newJoined);
  };

  const handleLikePost = (postId) => {
    const newLiked = new Set(likedPosts);
    
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
      setForumTopics(prev => prev.map(topic => 
        topic.id === postId ? { ...topic, likes: topic.likes - 1 } : topic
      ));
    } else {
      newLiked.add(postId);
      setForumTopics(prev => prev.map(topic => 
        topic.id === postId ? { ...topic, likes: topic.likes + 1 } : topic
      ));
      setUserStats(prev => ({ ...prev, points: prev.points + 5 }));
    }
    setLikedPosts(newLiked);
  };

  const handleJoinChallenge = (challengeId) => {
    const newJoined = new Set(joinedChallenges);
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (newJoined.has(challengeId)) {
      newJoined.delete(challengeId);
      showNotification(`Left challenge: ${challenge?.title}`);
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { 
          ...c, 
          participants: c.participants - 1,
          isJoined: false 
        } : c
      ));
    } else {
      newJoined.add(challengeId);
      showNotification(`Joined ${challenge?.title}! Good luck! +25 points`);
      setUserStats(prev => ({ 
        ...prev, 
        points: prev.points + 25,
        challengesCompleted: prev.challengesCompleted + (challenge?.progress === 100 ? 1 : 0)
      }));
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { 
          ...c, 
          participants: c.participants + 1,
          isJoined: true 
        } : c
      ));
    }
    setJoinedChallenges(newJoined);
  };

  const handleCreatePost = async () => {
    if (newPost.title.trim() && newPost.content.trim()) {


      const docRef = await addDoc(collection(db, "posts"), {
      title: newPost.title,
      author: user.displayName,
      replies: 0,
      views: 1,
      lastActivity: new Date().toDateString(),
      category: newPost.category,
      isHot: false,
      avatar: "🆕",
      likes: 0,
      content: newPost.content,
      createdAt: serverTimestamp(),
      repliesData: [] 
      // ✅ Firebase timestamp
    });
      const newTopic = {
        id: docRef.id,
        title: newPost.title,
        author: user.displayName,
        replies: 0,
        views: 1,
        lastActivity:new Date().toDateString(),
        category: newPost.category,
        isHot: false,
        avatar: "🆕",
        likes: 0,
        content: newPost.content,
        repliesData: []
      };
      
      setForumTopics(prev => [newTopic, ...prev]);
      setUserStats(prev => ({ 
        ...prev, 
        points: prev.points + 100,
        postsCreated: prev.postsCreated + 1 
      }));
      showNotification("Post created successfully! +100 points");
      setNewPost({ title: '', content: '', category: 'General' });
      setShowNewPostModal(false);
      setActiveTab('forums');
    }
  };

  const handleReply = async (topicId) => {
    if (newReply.trim()) {
      const newReplyData = {
        id: Date.now(),
        author: "You",
        content: newReply,
        timestamp: "Just now",
        likes: 0,
        avatar: "🌟"
      };

      const docRef = doc(db, "posts", topicId.toString());

      await updateDoc(docRef, {
        repliesData: arrayUnion(newReplyData),
        replies: increment(1),
      });

      setForumTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { 
              ...topic, 
              repliesData: [...topic.repliesData, newReplyData],
              replies: topic.replies + 1,
              lastActivity: "Just now"
            } 
          : topic
      ));

      // Update the selectedTopic state to reflect the new reply
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(prev => ({
          ...prev,
          repliesData: [...prev.repliesData, newReplyData],
          replies: prev.replies + 1,
          lastActivity: "Just now"
        }));
      }

      setUserStats(prev => ({ 
        ...prev, 
        points: prev.points + 25,
        helpfulAnswers: prev.helpfulAnswers + 1
      }));
      
      showNotification("Reply posted! +25 points");
      setNewReply('');
    }
  };

  const handleLikeReply = (topicId, replyId) => {
    setForumTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? {
            ...topic,
            repliesData: topic.repliesData.map(reply =>
              reply.id === replyId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          }
        : topic
    ));

    // Update the selectedTopic state to reflect the like
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic(prev => ({
        ...prev,
        repliesData: prev.repliesData.map(reply =>
          reply.id === replyId 
            ? { ...reply, likes: reply.likes + 1 }
            : reply
        )
      }));
    }

    setUserStats(prev => ({ ...prev, points: prev.points + 2 }));
  };

  const toggleReplies = (topicId) => {
    setShowReplies(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const openTopicDetail = (topic) => {
    setSelectedTopic(topic);
    // Increment view count
    setForumTopics(prev => prev.map(t => 
      t.id === topic.id ? { ...t, views: t.views + 1 } : t
    ));
  };

  const updateChallengeProgress = (challengeId, increment = 5) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId && joinedChallenges.has(challengeId) ? 
      { ...c, progress: Math.min(100, c.progress + increment) } : c
    ));
    setUserStats(prev => ({ ...prev, points: prev.points + increment }));
  };

  const filteredForumTopics = searchQuery 
    ? forumTopics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : forumTopics;

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Auto-increment challenge progress for demo
  useEffect(() => {
    const interval = setInterval(() => {
      joinedChallenges.forEach(challengeId => {
        if (Math.random() > 0.7) { // 30% chance every 5 seconds
          updateChallengeProgress(challengeId, 1);
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [joinedChallenges]);

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #000000, #1a1a1a, #0f0f0f)',
      minHeight: '100vh',
      color: '#FFD700',
      position: 'relative'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%)',
        zIndex: -1
      }} />

      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {notifications.map(notification => (
            <div key={notification.id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              color: '#FFD700',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '2px solid #FFD700',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
              animation: 'slideIn 0.3s ease-out',
              maxWidth: '300px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} />
                {notification.message}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', position: 'relative', zIndex: 1 }}>
        {/* Header with User Stats */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            💰 FinanceHub Community
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#C9B037', margin: '0 0 20px 0' }}>
            Connect, Learn, and Grow Together
          </p>
          
          {/* User Quick Stats */}
          <div style={{
            display: 'inline-flex',
            gap: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '12px 24px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFD700' }}>
                {userStats.points.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#8B7355' }}>Points</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 215, 0, 0.3)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFA500' }}>
                #{userStats.rank}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#8B7355' }}>Rank</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 215, 0, 0.3)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#C9B037' }}>
                {userStats.challengesCompleted}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#8B7355' }}>Completed</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px'
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B7355'
            }} />
            <input
              type="text"
              placeholder="Search discussions, groups, or challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 48px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '25px',
                color: '#FFD700',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD700';
                e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          {[
            { id: 'forums', label: 'Discussion Forums', icon: MessageCircle },
            { id: 'groups', label: 'Study Groups', icon: Users },
            { id: 'challenges', label: 'Challenges', icon: Trophy },
            { id: 'leaderboard', label: 'Leaderboard', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: activeTab === tab.id ? '#FFD700' : 'transparent',
                  color: activeTab === tab.id ? '#000000' : '#C9B037',
                  transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                    e.target.style.color = '#FFD700';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#C9B037';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Topic Detail Modal */}
        {selectedTopic && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 1000,
            paddingTop: '20px',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid #FFD700',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              margin: '20px'
            }}>
              {/* Topic Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '2rem' }}>{selectedTopic.avatar}</div>
                    <div>
                      <h2 style={{ 
                        color: '#FFD700', 
                        margin: '0 0 4px 0',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                      }}>
                        {selectedTopic.title}
                      </h2>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: '16px',
                        fontSize: '0.7rem',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)'
                      }}>
                        {selectedTopic.category}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    fontSize: '0.8rem', 
                    color: '#8B7355',
                    marginBottom: '16px'
                  }}>
                    <span>By {selectedTopic.author}</span>
                    <span>•</span>
                    <span>{selectedTopic.replies} replies</span>
                    <span>•</span>
                    <span>{selectedTopic.views} views</span>
                    <span>•</span>
                    <span>{selectedTopic.likes} likes</span>
                    <span>•</span>
                    <span style={{ color: '#C9B037' }}>{selectedTopic.lastActivity}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTopic(null)}
                  style={{
                    background: 'none',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    color: '#C9B037',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                    e.target.style.borderColor = '#FFD700';
                    e.target.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                    e.target.style.color = '#C9B037';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Original Post Content */}
              <div style={{
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                marginBottom: '24px'
              }}>
                <p style={{ 
                  color: '#C9B037', 
                  lineHeight: '1.6',
                  margin: '0',
                  fontSize: '1rem'
                }}>
                  {selectedTopic.content}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 215, 0, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleLikePost(selectedTopic.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: likedPosts.has(selectedTopic.id) ? '#FFD700' : '#8B7355',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <Heart size={18} fill={likedPosts.has(selectedTopic.id) ? 'currentColor' : 'none'} />
                      <span style={{ fontSize: '0.8rem' }}>{selectedTopic.likes}</span>
                    </button>
                    
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B7355',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                        e.target.style.color = '#FFD700';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#8B7355';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <Share2 size={18} />
                      <span style={{ fontSize: '0.8rem' }}>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  color: '#FFD700', 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MessageCircle size={20} />
                  Replies ({selectedTopic.repliesData.length})
                </h3>

                {selectedTopic.repliesData.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedTopic.repliesData.map(reply => (
                      <div key={reply.id} style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ fontSize: '1.2rem' }}>{reply.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '12px', 
                              marginBottom: '8px' 
                            }}>
                              <span style={{ 
                                color: reply.author === 'You' ? '#FFD700' : '#C9B037',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                              }}>
                                {reply.author}
                              </span>
                              <span style={{ color: '#8B7355', fontSize: '0.7rem' }}>
                                {reply.timestamp}
                              </span>
                            </div>
                            <p style={{ 
                              color: '#C9B037', 
                              margin: '0 0 12px 0',
                              lineHeight: '1.5',
                              fontSize: '0.9rem'
                            }}>
                              {reply.content}
                            </p>
                            <button
                              onClick={() => handleLikeReply(selectedTopic.id, reply.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#8B7355',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                padding: '4px 8px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                                e.target.style.color = '#FFD700';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#8B7355';
                              }}
                            >
                              <Heart size={14} />
                              {reply.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#8B7355',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255, 215, 0, 0.3)'
                  }}>
                    <MessageCircle size={32} style={{ marginBottom: '8px' }} />
                    <p>No replies yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {/* Reply Input */}
              <div style={{
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                <h4 style={{ 
                  color: '#FFD700', 
                  margin: '0 0 12px 0',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  Add Your Reply
                </h4>
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Share your thoughts, ask follow-up questions, or provide helpful advice..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#FFD700',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    marginBottom: '12px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD700';
                    e.target.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleReply(selectedTopic.id)}
                    disabled={!newReply.trim()}
                    style={{
                      padding: '10px 20px',
                      background: newReply.trim() ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(139, 115, 85, 0.5)',
                      border: 'none',
                      borderRadius: '8px',
                      color: newReply.trim() ? '#000' : '#8B7355',
                      fontWeight: '600',
                      cursor: newReply.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      if (newReply.trim()) {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newReply.trim()) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <Send size={16} />
                    Post Reply (+25 points)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Post Modal */}
        {showNewPostModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid #FFD700',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '1.5rem' }}>
                Create New Discussion
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#C9B037', display: 'block', marginBottom: '8px' }}>
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#FFD700',
                    fontSize: '1rem'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} style={{ backgroundColor: '#000' }}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#C9B037', display: 'block', marginBottom: '8px' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter discussion title..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#FFD700',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#C9B037', display: 'block', marginBottom: '8px' }}>
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="What would you like to discuss?"
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#FFD700',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#C9B037',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                    e.target.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#C9B037';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Send size={16} />
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Active Members', value: '12,847', icon: '👥' },
                { label: 'Posts Today', value: '234', icon: '💬' },
                { label: 'Questions Answered', value: '89%', icon: '✅' },
                { label: 'Your Posts', value: userStats.postsCreated.toString(), icon: '📝' }
              ].map((stat, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFD700', marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#C9B037' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Create New Post Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                onClick={() => setShowNewPostModal(true)}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Plus size={20} />
                Create New Discussion
              </button>
            </div>

            {/* Forum Topics */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#FFD700', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <MessageCircle size={24} />
                Latest Discussions
                {searchQuery && <span style={{ fontSize: '1rem', color: '#C9B037' }}>({filteredForumTopics.length} results)</span>}
              </h2>
              
              {filteredForumTopics.map(topic => (
                <div key={topic.id} style={{
                  padding: '20px',
                  marginBottom: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => openTopicDetail(topic)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02) translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                }}>
                  {topic.isHot && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'linear-gradient(135deg, #FF6B6B, #FFD700)',
                      color: '#000',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}>
                      🔥 HOT
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '1.5rem' }}>{topic.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        color: '#FFD700', 
                        margin: '0 0 8px 0' 
                      }}>
                        {topic.title}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px', 
                        fontSize: '0.8rem', 
                        color: '#8B7355' 
                      }}>
                        <span>By {topic.author}</span>
                        <span>•</span>
                        <span>{topic.replies} replies</span>
                        <span>•</span>
                        <span>{topic.views} views</span>
                        <span>•</span>
                        <span>{topic.likes} likes</span>
                        <span>•</span>
                        <span style={{ color: '#C9B037' }}>{topic.lastActivity}</span>
                      </div>
                      <div style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '4px 12px',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: '16px',
                        fontSize: '0.7rem',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)'
                      }}>
                        {topic.category}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePost(topic.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: likedPosts.has(topic.id) ? '#FFD700' : '#8B7355',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          padding: '8px',
                          borderRadius: '50%'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                          e.target.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <Heart size={18} fill={likedPosts.has(topic.id) ? 'currentColor' : 'none'} />
                      </button>
                      <ChevronRight size={18} color="#C9B037" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Groups Tab */}
        {activeTab === 'groups' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
            {studyGroups.map(group => (
              <div key={group.id} style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '16px',
                padding: '28px',
                border: joinedGroups.has(group.id) ? '2px solid #FFD700' : '1px solid rgba(255, 215, 0, 0.3)',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                position: 'relative',
                transform: joinedGroups.has(group.id) ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.borderColor = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = joinedGroups.has(group.id) ? 'scale(1.02) translateY(0)' : 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = joinedGroups.has(group.id) ? '#FFD700' : 'rgba(255, 215, 0, 0.3)';
              }}>
                {joinedGroups.has(group.id) && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '700'
                  }}>
                    ✓ JOINED
                  </div>
                )}
                
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{group.icon}</div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '700', 
                    color: '#FFD700', 
                    margin: '0 0 8px 0' 
                  }}>
                    {group.name}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '16px',
                    fontSize: '0.7rem',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    marginBottom: '8px'
                  }}>
                    {group.level}
                  </div>
                </div>

                <p style={{ 
                  color: '#C9B037', 
                  fontSize: '0.9rem', 
                  marginBottom: '20px',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  {group.description}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '20px',
                  fontSize: '0.8rem',
                  color: '#8B7355'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} />
                    {group.members.toLocaleString()} members
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {group.nextMeeting}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinGroup(group.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: joinedGroups.has(group.id) 
                      ? 'linear-gradient(135deg, #8B7355, #6B5B45)' 
                      : 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: joinedGroups.has(group.id) ? '#FFD700' : '#000'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {joinedGroups.has(group.id) ? 'Leave Group' : 'Join Group'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {challenges.map(challenge => (
              <div key={challenge.id} style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '16px',
                padding: '28px',
                border: joinedChallenges.has(challenge.id) ? '2px solid #FFD700' : '1px solid rgba(255, 215, 0, 0.3)',
                transition: 'all 0.4s ease',
                position: 'relative',
                transform: joinedChallenges.has(challenge.id) ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.borderColor = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = joinedChallenges.has(challenge.id) ? 'scale(1.02) translateY(0)' : 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = joinedChallenges.has(challenge.id) ? '#FFD700' : 'rgba(255, 215, 0, 0.3)';
              }}>
                {joinedChallenges.has(challenge.id) && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '700'
                  }}>
                    ✓ JOINED
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '700', 
                    color: '#FFD700', 
                    margin: '0 0 12px 0' 
                  }}>
                    {challenge.title}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      padding: '4px 12px',
                      backgroundColor: challenge.difficulty === 'Easy' ? 'rgba(40, 167, 69, 0.2)' : 
                                       challenge.difficulty === 'Medium' ? 'rgba(255, 193, 7, 0.2)' : 
                                       'rgba(220, 53, 69, 0.2)',
                      borderRadius: '16px',
                      fontSize: '0.7rem',
                      color: challenge.difficulty === 'Easy' ? '#28A745' : 
                             challenge.difficulty === 'Medium' ? '#FFD700' : '#DC3545',
                      border: `1px solid ${challenge.difficulty === 'Easy' ? '#28A745' : 
                                           challenge.difficulty === 'Medium' ? '#FFC107' : '#DC3545'}`
                    }}>
                      {challenge.difficulty}
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: '16px',
                      fontSize: '0.7rem',
                      color: '#FFD700',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      {challenge.participants.toLocaleString()} participants
                    </div>
                  </div>

                  <p style={{ 
                    color: '#C9B037', 
                    fontSize: '0.9rem', 
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    {challenge.description}
                  </p>

                  {/* Progress Bar */}
                  {joinedChallenges.has(challenge.id) && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{ color: '#C9B037' }}>Progress</span>
                        <span style={{ color: '#FFD700', fontWeight: '600' }}>{challenge.progress}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${challenge.progress}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px',
                    fontSize: '0.8rem',
                    color: '#8B7355'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {challenge.daysLeft} days left
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trophy size={14} />
                      {challenge.reward}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinChallenge(challenge.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: joinedChallenges.has(challenge.id) 
                      ? 'linear-gradient(135deg, #8B7355, #6B5B45)' 
                      : 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: joinedChallenges.has(challenge.id) ? '#FFD700' : '#000'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {joinedChallenges.has(challenge.id) ? 'Leave Challenge' : 'Join Challenge'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#FFD700', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'center',
              justifyContent: 'center'
            }}>
              <Award size={24} />
              Community Leaderboard
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              {topContributors.map((contributor, index) => (
                <div key={contributor.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px',
                  backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '12px',
                  border: index < 3 ? '2px solid #FFD700' : '1px solid rgba(255, 215, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02) translateY(-3px)';
                  e.currentTarget.style.borderColor = '#FFD700';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.borderColor = index < 3 ? '#FFD700' : 'rgba(255, 215, 0, 0.2)';
                  e.currentTarget.style.backgroundColor = index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.6)';
                }}>
                  
                  {index < 3 && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '16px',
                      background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                                  index === 1 ? 'linear-gradient(135deg, #C0C0C0, #A8A8A8)' :
                                  'linear-gradient(135deg, #CD7F32, #B87333)',
                      color: '#000',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}>
                      #{index + 1}
                    </div>
                  )}

                  <div style={{
                    fontSize: '2rem',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}>
                    {contributor.avatar}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: contributor.name === 'You' ? '#FFD700' : '#C9B037', 
                      margin: '0 0 4px 0' 
                    }}>
                      {contributor.name}
                      {contributor.name === 'You' && <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>👈</span>}
                    </h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      color: '#FFD700',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      {contributor.badge}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '700', 
                      color: '#FFD700' 
                    }}>
                      {contributor.points.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8B7355' }}>
                      points
                    </div>
                  </div>

                  {index < 10 && (
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#8B7355',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      #{index + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Personal Stats */}
            <div style={{
              marginTop: '32px',
              padding: '24px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '12px',
              border: '2px solid #FFD700'
            }}>
              <h3 style={{ 
                color: '#FFD700', 
                marginBottom: '16px',
                fontSize: '1.2rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Your Community Stats
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '16px',
                textAlign: 'center'
              }}>
                {[
                  { label: 'Total Points', value: userStats.points.toLocaleString(), icon: '⭐' },
                  { label: 'Current Rank', value: `#${userStats.rank}`, icon: '🏆' },
                  { label: 'Posts Created', value: userStats.postsCreated.toString(), icon: '📝' },
                  { label: 'Helpful Answers', value: userStats.helpfulAnswers.toString(), icon: '✅' },
                  { label: 'Challenges Won', value: userStats.challengesCompleted.toString(), icon: '🎯' }
                ].map((stat, index) => (
                  <div key={index}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#FFD700' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#C9B037' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default CommunityPage;