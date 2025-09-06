import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Trophy, BookOpen, DollarSign, TrendingUp, Star, Calendar, Award, Target, Clock, ArrowRight, Heart, Share2, ChevronRight, Plus, Send, Bell, Search } from 'lucide-react';
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment, arrayUnion } from "firebase/firestore";
import { auth } from "../firebase.js";
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

 

  const categories = ["General", "Investing", "Budgeting", "Debt Management", "Income", "Crypto", "Emergency Planning"];

  const showNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
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

 

  function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

  return "just now";
}



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
        createdAt: serverTimestamp(),
      });

      const data = await fetchPosts();
      setForumTopics(data);

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
      setSelectedTopic(null);
      showNotification("Reply posted!");
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

  function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

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

  const width = useWindowWidth();
  const isMobile = width < 600;

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #000000, #1a1a1a, #0f0f0f)',
      minHeight: '100vh',
      color: '#FFD700',
      position: 'relative',
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

      <div style={{ maxWidth: '100%', margin: '0 auto', paddingLeft:isMobile? "20px":"70px", paddingRight:isMobile? "20px":"70px", paddingTop:"20px", position: 'relative', zIndex: 1, }}>
        {/* Header with User Stats */}
        <div style={{ textAlign: '', marginBottom: '40px',display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
          <div >
          <div style={{display:"flex", gap:"10px",flexWrap:"wrap" }} >
            <div>
          <span style={{
            fontSize: isMobile?'2rem': '3rem',
            fontWeight: '800',}} className="logo-fin">Fin</span>
        <span style={{
            fontSize: isMobile?'2rem': '3rem',
            fontWeight: '800',}} className="logo-ed">Ed</span> 
            </div>
          <h1 style={{
            fontSize: isMobile? '2rem' : '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            display: 'inline-block',
          }}>
            Community
          </h1>
          </div>
          <p style={{ fontSize: '1.2rem', color: '#C9B037', margin: '0 0 0px 0' }}>
            Connect, Learn, and Grow Together
          </p>
          </div>
        

           {/* Search Bar */}
          <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          width: '40%',
          display: isMobile? 'none' : 'flex'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
     
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
              placeholder="Search discussions, questions, and more..."
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
  paddingTop: 'clamp(10px, 2vh, 20px)',
  overflow: 'auto',

}}>
  <div style={{
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '2px solid #FFD700',
    borderRadius: 'clamp(8px, 2vw, 16px)',
    padding: 'clamp(16px, 4vw, 32px)',
    maxWidth: '800px',
    width: 'calc(100% - 20px)',
    maxHeight: 'calc(100vh - 40px)',
    overflow: 'auto',
    margin: '10px',
    '@media (max-width: 768px)': {
      width: 'calc(100% - 16px)',
      margin: '8px',
      borderRadius: '12px',
      padding: '20px 16px',
    }
  }}>
    {/* Topic Header */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: 'clamp(16px, 3vw, 24px)',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '0' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 12px)', 
          marginBottom: 'clamp(8px, 2vw, 12px)',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            flexShrink: 0
          }}>
            {selectedTopic.avatar}
          </div>
          <div style={{ minWidth: '0', flex: 1 }}>
            <h2 style={{ 
              color: '#FFD700', 
              margin: '0 0 4px 0',
              fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
              fontWeight: '700',
              wordBreak: 'break-word',
              lineHeight: '1.2'
            }}>
              {selectedTopic.title}
            </h2>
            <div style={{
              display: 'inline-block',
              padding: 'clamp(3px, 1vw, 4px) clamp(8px, 2vw, 12px)',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '16px',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
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
          gap: 'clamp(8px, 2vw, 16px)', 
          fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', 
          color: '#8B7355',
          marginBottom: 'clamp(12px, 2.5vw, 16px)',
          flexWrap: 'wrap'
        }}>
          <span>By {selectedTopic.author}</span>
          <span className="desktop-separator">•</span>
          <span>{selectedTopic.replies} replies</span>
          <span className="desktop-separator">•</span>
          <span>{selectedTopic.views} views</span>
          <span className="desktop-separator">•</span>
          <span>{selectedTopic.likes} likes</span>
          <span className="desktop-separator">•</span>
          <span style={{ color: '#C9B037' }}>{timeAgo(selectedTopic.createdAt.toDate())}</span>
        </div>
      </div>
      
      <button
        onClick={() => setSelectedTopic(null)}
        style={{
          background: 'none',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '50%',
          width: 'clamp(36px, 8vw, 40px)',
          height: 'clamp(36px, 8vw, 40px)',
          color: '#C9B037',
          cursor: 'pointer',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          flexShrink: 0
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
      padding: 'clamp(16px, 3vw, 20px)',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      marginBottom: 'clamp(16px, 3vw, 24px)'
    }}>
      <p style={{ 
        color: '#C9B037', 
        lineHeight: '1.6',
        margin: '0',
        fontSize: 'clamp(0.9rem, 2.2vw, 1rem)',
        wordBreak: 'break-word'
      }}>
        {selectedTopic.content}
      </p>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: 'clamp(12px, 2.5vw, 16px)',
        paddingTop: 'clamp(12px, 2.5vw, 16px)',
        borderTop: '1px solid rgba(255, 215, 0, 0.2)',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
          <button
            onClick={() => handleLikePost(selectedTopic.id)}
            style={{
              background: 'none',
              border: 'none',
              color: likedPosts.has(selectedTopic.id) ? '#FFD700' : '#8B7355',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 'clamp(6px, 1.5vw, 8px)',
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
            <Heart size={window.innerWidth <= 768 ? 16 : 18} fill={likedPosts.has(selectedTopic.id) ? 'currentColor' : 'none'} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)' }}>{selectedTopic.likes}</span>
          </button>
          
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#8B7355',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 'clamp(6px, 1.5vw, 8px)',
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
            <Share2 size={window.innerWidth <= 768 ? 16 : 18} />
            <span style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)' }}>Share</span>
          </button>
        </div>
      </div>
    </div>

    {/* Replies Section */}
    <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
      <h3 style={{ 
        color: '#FFD700', 
        fontSize: 'clamp(1.1rem, 2.8vw, 1.2rem)',
        fontWeight: '600',
        marginBottom: 'clamp(12px, 2.5vw, 16px)',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(6px, 1.5vw, 8px)'
      }}>
        <MessageCircle size={window.innerWidth <= 768 ? 18 : 20} />
        Replies ({selectedTopic.repliesData.length})
      </h3>

      {selectedTopic.repliesData.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.5vw, 16px)' }}>
          {selectedTopic.repliesData.map(reply => (
            <div key={reply.id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: 'clamp(12px, 3vw, 16px)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(8px, 2vw, 12px)' }}>
                <div style={{ 
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  flexShrink: 0
                }}>
                  {reply.avatar}
                </div>
                <div style={{ flex: 1, minWidth: '0' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'clamp(8px, 2vw, 12px)', 
                    marginBottom: 'clamp(6px, 1.5vw, 8px)',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ 
                      color: reply.author === 'You' ? '#FFD700' : '#C9B037',
                      fontWeight: '600',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                      {reply.author}
                    </span>
                    <span style={{ 
                      color: '#8B7355', 
                      fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)'
                    }}>
                      {reply.timestamp}
                    </span>
                  </div>
                  <p style={{ 
                    color: '#C9B037', 
                    margin: '0 0 12px 0',
                    lineHeight: '1.5',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    wordBreak: 'break-word'
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
                      padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)'
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
                    <Heart size={window.innerWidth <= 768 ? 12 : 14} />
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
          padding: 'clamp(24px, 5vw, 40px)',
          color: '#8B7355',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: '1px dashed rgba(255, 215, 0, 0.3)'
        }}>
          <MessageCircle size={window.innerWidth <= 768 ? 28 : 32} style={{ marginBottom: '8px' }} />
          <p style={{ 
            margin: 0,
            fontSize: 'clamp(0.9rem, 2.2vw, 1rem)'
          }}>
            No replies yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>

    {/* Reply Input */}
    <div style={{
      backgroundColor: 'rgba(255, 215, 0, 0.05)',
      padding: 'clamp(16px, 3vw, 20px)',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      border: '1px solid rgba(255, 215, 0, 0.3)'
    }}>
      <h4 style={{ 
        color: '#FFD700', 
        margin: '0 0 12px 0',
        fontSize: 'clamp(0.9rem, 2.2vw, 1rem)',
        fontWeight: '600'
      }}>
        Add Your Reply
      </h4>
      <textarea
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        placeholder="Share your thoughts, ask follow-up questions, or provide helpful advice..."
        rows={window.innerWidth <= 768 ? 3 : 4}
        style={{
          width: '100%',
          padding: 'clamp(10px, 2.5vw, 12px)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          color: '#FFD700',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          outline: 'none',
          resize: 'vertical',
          marginBottom: 'clamp(10px, 2.5vw, 12px)',
          boxSizing: 'border-box'
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
          onClick={() => {
            handleReply(selectedTopic.id)}}
          disabled={!newReply.trim()}
          style={{
            padding: 'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 20px)',
            background: newReply.trim() ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(139, 115, 85, 0.5)',
            border: 'none',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            color: newReply.trim() ? '#000' : '#8B7355',
            fontWeight: '600',
            cursor: newReply.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(6px, 1.5vw, 8px)',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
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
          <Send size={window.innerWidth <= 768 ? 14 : 16} />
          Post Reply
        </button>
      </div>
    </div>
  </div>

  <style>
    {`
      /* Custom scrollbar for webkit browsers */
      div::-webkit-scrollbar {
        width: 6px;
      }
      
      div::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
      }
      
      div::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #FFD700, #FFA500);
        border-radius: 3px;
        transition: background 0.3s ease;
      }
      
      div::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #FFA500, #FFD700);
      }
      
      /* Custom scrollbar for Firefox */
      div {
        scrollbar-width: thin;
        scrollbar-color: #FFD700 rgba(0, 0, 0, 0.3);
      }
      
      @media (max-width: 768px) {
        .desktop-separator {
          display: none;
        }
        
        /* Even thinner scrollbar on mobile */
        div::-webkit-scrollbar {
          width: 4px;
        }
      }
      
      @media (min-width: 769px) {
        .desktop-separator {
          display: inline;
        }
      }
    `}
  </style>
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
             

            {/* Forum Topics */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              flexShrink: 1
            }}>
              <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
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
              {/* Create New Post Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                onClick={() => setShowNewPostModal(true)}
                style={{
                  padding: '14px 10px',
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
              </div>
              
              {filteredForumTopics.map(topic => (
                
                <div style={{ padding: isMobile ? '0px' : '16px', maxWidth: '100%', margin: '0 auto' }}>
      <div key={topic.id} style={{
                  padding: window.innerWidth >= 768 ? '20px' : '16px',
                  marginBottom: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  
                }}
                onClick={() => openTopicDetail(topic)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = window.innerWidth >= 768 ? 'scale(1.02) translateY(-3px)' : 'scale(1.01)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                }}>
                  
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: window.innerWidth >= 768 ? '16px' : '12px',
                    flexDirection: window.innerWidth >= 640 ? 'row' : 'column'
                  }}>
                    <div style={{ 
                      fontSize: window.innerWidth >= 768 ? '1.5rem' : '1.25rem',
                      alignSelf: window.innerWidth >= 640 ? 'flex-start' : 'flex-start',
                      marginBottom: window.innerWidth >= 640 ? '0' : '8px'
                    }}>{topic.avatar}</div>
                    <div style={{ 
                      flex: 1, 
                      minWidth: 0,
                      width: '100%'
                    }}>
                      <h3 style={{ 
                        fontSize: window.innerWidth >= 1024 ? '1.25rem' : window.innerWidth >= 768 ? '1.1rem' : '1rem', 
                        fontWeight: '600', 
                        color: '#FFD700', 
                        margin: '0 0 8px 0', 
                        lineHeight: '1.4',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {topic.title}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: window.innerWidth >= 768 ? '16px' : '8px', 
                        fontSize: window.innerWidth >= 768 ? '0.8rem' : '0.75rem', 
                        color: '#8B7355',
                        flexWrap: window.innerWidth >= 640 ? 'nowrap' : 'wrap',
                        marginBottom: '8px'
                      }}>
                        <span style={{ whiteSpace: 'nowrap' }}>By {topic.author}</span>
                        <span style={{ display: window.innerWidth >= 480 ? 'inline' : 'none' }}>•</span>
                        <span style={{ whiteSpace: 'nowrap' }}>{topic.replies} replies</span>
                        <span style={{ display: window.innerWidth >= 640 ? 'inline' : 'none' }}>•</span>
                        <span style={{ 
                          whiteSpace: 'nowrap',
                          display: window.innerWidth >= 640 ? 'inline' : 'none'
                        }}>{topic.views} views</span>
                        <span style={{ display: window.innerWidth >= 768 ? 'inline' : 'none' }}>•</span>
                        <span style={{ 
                          whiteSpace: 'nowrap',
                          display: window.innerWidth >= 768 ? 'inline' : 'none'
                        }}>{topic.likes} likes</span>
                        <span style={{ display: window.innerWidth >= 480 ? 'inline' : 'none' }}>•</span>
                        <span style={{ 
                          color: '#C9B037', 
                          whiteSpace: 'nowrap',
                          marginLeft: window.innerWidth >= 640 ? '0' : 'auto'
                        }}>{timeAgo(topic.createdAt.toDate())}</span>
                      </div>
                      <div style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: window.innerWidth >= 768 ? '4px 12px' : '3px 8px',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: '16px',
                        fontSize: window.innerWidth >= 768 ? '0.7rem' : '0.65rem',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)'
                      }}>
                        {topic.category}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      alignSelf: window.innerWidth >= 640 ? 'flex-start' : 'flex-end',
                      marginTop: window.innerWidth >= 640 ? '0' : '-40px'
                    }}>
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
                          padding: window.innerWidth >= 768 ? '8px' : '6px',
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
                        <Heart size={window.innerWidth >= 768 ? 18 : 16} fill={likedPosts.has(topic.id) ? 'currentColor' : 'none'} />
                      </button>
                      <ChevronRight size={window.innerWidth >= 768 ? 18 : 16} color="#C9B037" />
                    </div>
                  </div>
                </div>
    </div>
              ))}
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