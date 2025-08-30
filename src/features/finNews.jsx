import React, { useState, useEffect } from 'react';
import './FinNews.css';

const FinNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [categories, setCategories] = useState({});
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch news data
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        q: selectedCategory === 'all' ? 'finance' : selectedCategory,
        pageSize: 12,
        category: selectedCategory,
        sentiment_filter: sentimentFilter
      });

      const response = await fetch(`http://localhost:8000/api/finnews?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setNewsData(data.news || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Unable to connect to news service');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, sentimentFilter]);

  // Fetch definition for financial terms
  const fetchDefinition = async (term) => {
    try {
      const response = await fetch(`http://localhost:8000/api/dictionary/${encodeURIComponent(term)}`);
      const data = await response.json();
      return data.definition;
    } catch (err) {
      return `${term}: Financial term (definition unavailable)`;
    }
  };

  // Handle term hover for tooltips
  const handleTermHover = async (e) => {
    const term = e.target.getAttribute('data-term');
    if (term) {
      const definition = await fetchDefinition(term);
      setHoveredTerm({ term, definition });
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTermLeave = () => {
    setHoveredTerm(null);
  };

  // Update tooltip position on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (hoveredTerm) {
        setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 10 });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredTerm]);

  // Highlight financial terms in text
  const highlightFinanceTerms = (text) => {
    if (!text) return '';
    
    const financeTerms = [
      'inflation', 'gdp', 'federal reserve', 'interest rates', 'stock market',
      'cryptocurrency', 'bitcoin', 'nasdaq', 'dow jones', 's&p 500',
      'recession', 'bull market', 'bear market', 'dividend', 'market cap',
      'volatility', 'portfolio', 'bonds', 'yield', 'earnings', 'investment',
      'mutual funds', 'sip', 'equity', 'debt', 'credit', 'banking'
    ];

    let highlightedText = text;
    
    financeTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, (match) => 
        `<span class="finance-term" data-term="${term.toLowerCase()}">${match}</span>`
      );
    });
    
    return highlightedText;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  // Get sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  // Open article in new tab
  const openArticle = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading && newsData.length === 0) {
    return (
      <div className="fin-news-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading latest finance news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fin-news-container">
      <header className="fin-news-header">
        <h1>
          <span className="logo-wealth">Wealth</span>
          <span className="logo-wise">Wise</span>
          <span className="logo-news"> News</span>
        </h1>
        <p className="subtitle">AI-powered financial news with educational insights</p>
        <div className="last-updated">
          <span>Last updated: {lastUpdated || 'Never'}</span>
          <button className="refresh-btn" onClick={fetchNews} disabled={loading}>
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </header>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="category-filter">
          <h3>Categories:</h3>
          <div className="filter-buttons">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sentiment-filter">
          <h3>Sentiment:</h3>
          <div className="filter-buttons">
            {['all', 'positive', 'negative', 'neutral'].map(sentiment => (
              <button
                key={sentiment}
                className={`sentiment-btn ${sentimentFilter === sentiment ? 'active' : ''}`}
                onClick={() => setSentimentFilter(sentiment)}
              >
                {sentiment === 'all' ? 'All' : 
                 sentiment === 'positive' ? '📈 Positive' :
                 sentiment === 'negative' ? '📉 Negative' : '📊 Neutral'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchNews} className="retry-btn">Try Again</button>
        </div>
      )}

      {/* News Grid */}
      <div className="news-grid">
        {newsData.map(news => (
          <article 
            key={news.id} 
            className="news-card"
            onClick={() => openArticle(news.url)}
            onMouseOver={handleTermHover}
            onMouseLeave={handleTermLeave}
          >
            {news.image && (
              <div className="news-image">
                <img src={news.image} alt={news.title} loading="lazy" />
              </div>
            )}
            
            <div className="news-content">
              <div className="news-badges">
                <span className="category-badge">{news.category}</span>
                {news.sentiment && (
                  <span className={`sentiment-badge sentiment-${news.sentiment}`}>
                    {getSentimentIcon(news.sentiment)} {news.sentiment}
                  </span>
                )}
              </div>
              
              <div className="news-meta">
                <span className="news-source">{news.source}</span>
                <span className="news-time">{formatTimestamp(news.timestamp)}</span>
                {news.readTime && <span className="read-time">{news.readTime}</span>}
              </div>
              
              <h2 className="news-title">{news.title}</h2>
              
              <div 
                className="news-summary"
                dangerouslySetInnerHTML={{ 
                  __html: highlightFinanceTerms(news.summary) 
                }}
              />

              {news.insight && (
                <div className="news-insight">
                  <h4>💡 AI Insight:</h4>
                  <p>{news.insight}</p>
                </div>
              )}

              {news.entities && news.entities.length > 0 && (
                <div className="news-entities">
                  <h4>Related:</h4>
                  <div className="entity-tags">
                    {news.entities.slice(0, 3).map((entity, idx) => (
                      <span key={idx} className="entity-tag">
                        {entity.name || entity.symbol}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="news-actions">
                <button className="read-more-btn">
                  Read Full Article 📖
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {newsData.length === 0 && !loading && (
        <div className="no-news">
          <p>No news articles found for the selected filters.</p>
          <button onClick={() => {
            setSelectedCategory('all');
            setSentimentFilter('all');
          }}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Tooltip */}
      {hoveredTerm && (
        <div 
          className="tooltip" 
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <strong>{hoveredTerm.term.charAt(0).toUpperCase() + hoveredTerm.term.slice(1)}</strong>
          <p>{hoveredTerm.definition}</p>
        </div>
      )}

      <footer className="news-footer">
        <p className="info-text">💡 Hover over highlighted terms to learn financial concepts</p>
        <div className="disclaimer">
          <small>* News and insights powered by AI for educational purposes</small>
        </div>
      </footer>
    </div>
  );
};

export default FinNews;