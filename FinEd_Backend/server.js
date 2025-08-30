import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google GenAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory cache for definitions and insights
const definitionCache = new Map();
const insightCache = new Map();

// WealthWise AI System Prompt
const SYSTEM_PROMPT = `You are WealthWise AI, a financial literacy assistant created by the Vionix team.

Your mission is to help young adults understand financial concepts without collecting sensitive financial data.

Core Guidelines:
- Provide clear, simple explanations of financial terms and concepts
- Focus on financial literacy topics: budgeting, saving, investing, debt management, credit, insurance
- Use a kind, educative, and supportive tone
- Simplify complex financial jargon into easy-to-understand language
- Never request or collect personal financial information (bank details, income, etc.)
- Only answer finance-related questions - politely redirect non-financial queries
- Provide practical, actionable advice suitable for beginners
- Include real-world examples when explaining concepts
Format your answer EXACTLY like this:
  - Point 1
  - Point 2
  - Point 3
  - Practical Tip: ...
Each point should be in a new line
Ensure proper formatting

Remember: You're here to educate and empower, not to provide personalized financial advice or collect sensitive data.`;

// --- Enhanced Chat Endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context = 'financial_assistant', mode = 'general' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        response: "Please provide a valid message to get financial guidance." 
      });
    }

    // Configure model with specific settings for financial advice
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    // Enhanced prompt engineering based on advisory mode
    const modeContext = {
      general: "general financial literacy and basic concepts",
      investment: "investment strategies, mutual funds, SIPs, and portfolio building",
      planning: "financial planning, goal setting, retirement planning, and insurance",
      debt: "debt management, credit improvement, and loan optimization"
    };

    const enhancedPrompt = `${SYSTEM_PROMPT}

Current Advisory Mode: ${mode.toUpperCase()}
Focus Area: ${modeContext[mode] || modeContext.general}

User Query: "${message}"

Instructions:
1. Analyze if this is a finance-related question
2. If non-financial, politely redirect to financial topics
3. If financial, provide educational content appropriate for the ${mode} mode
4. Use simple language suitable for young adults
5. Include practical examples or tips where relevant
6. Never ask for personal financial details
7. Keep responses short and structured: 3-5 sentences or bullet points.
8. Always provide a practical tip or example

Provide a helpful, educational response:`;

    const result = await model.generateContent(enhancedPrompt);
    const reply = result.response.text();

    // Log interaction for monitoring (without sensitive data)
    console.log(`[${new Date().toISOString()}] Mode: ${mode}, Query Length: ${message.length}`);

    res.json({ 
      response: reply,
      mode: mode,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Chat API Error:', err);
    
    // Provide fallback response based on mode
    const fallbackResponses = {
      general: "I'm experiencing a temporary service issue. Here's a quick tip: Always prioritize building an emergency fund of 3-6 months' expenses before investing. This creates a financial safety net for unexpected situations.",
      investment: "Service temporarily unavailable. Remember: For beginners, starting with SIP investments in diversified equity mutual funds is often a good strategy for long-term wealth building.",
      planning: "I'm currently offline, but here's valuable advice: The 50/30/20 rule is great for budgeting - 50% for needs, 30% for wants, and 20% for savings and investments.",
      debt: "Service issue detected. Important tip: Always pay more than the minimum on high-interest debt like credit cards to save significantly on interest charges."
    };

    res.status(200).json({ 
      response: fallbackResponses[req.body.mode] || fallbackResponses.general,
      mode: req.body.mode || 'general',
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

// --- Helper Functions ---

// Generate educational insights using Gemini
async function generateInsight(title, summary) {
  const cacheKey = `${title}_${summary}`.substring(0, 100);
  
  if (insightCache.has(cacheKey)) {
    return insightCache.get(cacheKey);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.6,
      }
    });

    const prompt = `As a financial educator, summarize this news in 2 lines for a beginner and provide one practical takeaway.

Title: ${title}
Summary: ${summary}

Format:
Summary: [2 line summary for beginners]
Takeaway: [One practical tip]`;

    const result = await model.generateContent(prompt);
    const insight = result.response.text();
    
    // Cache the result
    insightCache.set(cacheKey, insight);
    
    return insight;
  } catch (error) {
    console.error('Insight generation error:', error);
    return "💡 Stay informed about market trends to make better financial decisions!";
  }
}

// Analyze sentiment using Gemini
async function analyzeSentiment(title, summary) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.3,
      }
    });

    const prompt = `Analyze the market sentiment of this financial news. Respond with ONLY one word: "Positive", "Negative", or "Neutral".

Title: ${title}
Summary: ${summary}`;

    const result = await model.generateContent(prompt);
    const sentiment = result.response.text().trim().toLowerCase();
    
    if (sentiment.includes('positive')) return 'positive';
    if (sentiment.includes('negative')) return 'negative';
    return 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 'neutral';
  }
}

// Fetch definition from FreeDictionaryAPI
async function fetchDefinition(term) {
  if (definitionCache.has(term)) {
    return definitionCache.get(term);
  }

  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`, {
      timeout: 3000
    });
    
    const definition = response.data[0]?.meanings[0]?.definitions[0]?.definition;
    if (definition) {
      definitionCache.set(term, definition);
      return definition;
    }
  } catch (error) {
    console.log(`Dictionary lookup failed for: ${term}`);
  }

  // Fallback to Gemini for financial terms
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.3,
      }
    });

    const prompt = `Provide a simple, beginner-friendly definition for the financial term: "${term}". Keep it under 50 words.`;
    const result = await model.generateContent(prompt);
    const definition = result.response.text();
    
    definitionCache.set(term, definition);
    return definition;
  } catch (error) {
    console.error('Gemini definition error:', error);
    return `${term}: A financial term. Search online for detailed explanation.`;
  }
}

// --- Enhanced Finance News Endpoint ---
app.get("/api/finnews", async (req, res) => {
  try {
    let { 
      q = "finance", 
      pageSize = 10, 
      category = "all",
      entities = "",
      sentiment_filter = "all"
    } = req.query;

    // Validate and sanitize inputs
    pageSize = Math.min(Math.max(parseInt(pageSize) || 10, 1), 50);
    
    if (!q || q.startsWith("_")) {
      q = "finance";
    }

    let articles = [];

    // Try Marketaux API first (primary source)
    try {
      const marketauxParams = {
        api_token: process.env.MARKETAUX_API_KEY,
        search: q,
        limit: pageSize,
        language: "en",
        sort: "published_desc"
      };

      // Add entity filtering if specified
      if (entities && entities !== "all") {
        marketauxParams.filter_entities = "true";
        marketauxParams.must_have_entities = entities;
      }

      const marketauxResponse = await axios.get("https://api.marketaux.com/v1/news/all", {
        params: marketauxParams,
        timeout: 8000
      });

      if (marketauxResponse.data?.data) {
        const marketauxArticles = await Promise.all(
          marketauxResponse.data.data.map(async (article, idx) => {
            // Generate insight and sentiment analysis
            const [insight, sentiment] = await Promise.all([
              generateInsight(article.title, article.description || article.snippet),
              article.sentiment ? article.sentiment : analyzeSentiment(article.title, article.description || article.snippet)
            ]);

            return {
              id: `mx_${idx + 1}`,
              title: article.title,
              summary: article.description || article.snippet || "No summary available",
              source: article.source,
              timestamp: article.published_at,
              category: article.entities?.length > 0 ? article.entities[0].type : "Finance",
              url: article.url,
              readTime: `${Math.ceil((article.snippet?.split(" ").length || 60) / 200)} min read`,
              entities: article.entities || [],
              sentiment: sentiment,
              insight: insight,
              image: article.image_url,
              provider: "marketaux"
            };
          })
        );

        articles = marketauxArticles;
      }
    } catch (marketauxError) {
      console.log('Marketaux API unavailable, falling back to NewsAPI:', marketauxError.message);
    }

    // Fallback to NewsAPI if Marketaux fails
    if (articles.length === 0) {
      try {
        const newsApiResponse = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q,
            language: "en",
            sortBy: "publishedAt",
            pageSize,
            apiKey: process.env.NEWS_API_KEY,
          },
          timeout: 8000
        });

        if (newsApiResponse.data?.articles) {
          const newsApiArticles = await Promise.all(
            newsApiResponse.data.articles.map(async (article, idx) => {
              const [insight, sentiment] = await Promise.all([
                generateInsight(article.title, article.description),
                analyzeSentiment(article.title, article.description)
              ]);

              return {
                id: `na_${idx + 1}`,
                title: article.title,
                summary: article.description || "No summary available",
                source: article.source.name,
                timestamp: article.publishedAt,
                category: "Finance",
                url: article.url,
                readTime: `${Math.ceil((article.content?.split(" ").length || 60) / 200)} min read`,
                entities: [],
                sentiment: sentiment,
                insight: insight,
                image: article.urlToImage,
                provider: "newsapi"
              };
            })
          );

          articles = newsApiArticles;
        }
      } catch (newsApiError) {
        console.error('Both news sources failed:', newsApiError.message);
        throw new Error('News services unavailable');
      }
    }

    // Apply sentiment filtering
    if (sentiment_filter && sentiment_filter !== "all") {
      articles = articles.filter(article => article.sentiment === sentiment_filter);
    }

    // Apply category filtering (for Marketaux entities)
    if (category && category !== "all") {
      articles = articles.filter(article => 
        article.category.toLowerCase().includes(category.toLowerCase()) ||
        article.entities.some(entity => entity.type.toLowerCase().includes(category.toLowerCase()))
      );
    }

    res.json({ 
      news: articles,
      total: articles.length,
      query: q,
      filters: {
        category,
        entities,
        sentiment_filter
      },
      provider: articles.length > 0 ? articles[0].provider : "none",
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Enhanced FinNews API Error:", err.message);
    res.status(500).json({ 
      error: "Unable to fetch finance news",
      message: "News services are temporarily unavailable. Please try again later.",
      timestamp: new Date().toISOString()
    });
  }
});

// --- Financial Dictionary Endpoint ---
app.get("/api/dictionary/:term", async (req, res) => {
  try {
    const { term } = req.params;
    
    if (!term || term.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a term to define" });
    }

    const cleanTerm = term.toLowerCase().trim();
    const definition = await fetchDefinition(cleanTerm);

    res.json({
      term: cleanTerm,
      definition: definition,
      cached: definitionCache.has(cleanTerm),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dictionary API Error:', error);
    res.status(500).json({ 
      error: "Unable to fetch definition",
      term: req.params.term
    });
  }
});

// --- Market Categories Endpoint ---
app.get("/api/categories", (req, res) => {
  const categories = {
    all: { name: "All News", icon: "Globe", color: "blue" },
    stocks: { name: "Stocks", icon: "TrendingUp", color: "green" },
    crypto: { name: "Cryptocurrency", icon: "Bitcoin", color: "orange" },
    economy: { name: "Economy", icon: "Building", color: "purple" },
    bonds: { name: "Bonds", icon: "Shield", color: "blue" },
    commodities: { name: "Commodities", icon: "Wheat", color: "yellow" },
    forex: { name: "Forex", icon: "DollarSign", color: "green" },
    investment: { name: "Investment", icon: "Target", color: "indigo" },
    banking: { name: "Banking", icon: "CreditCard", color: "gray" }
  };

  res.json({ categories });
});

// --- Popular Financial Entities Endpoint ---
app.get("/api/entities", (req, res) => {
  const popularEntities = {
    stocks: [
      { symbol: "AAPL", name: "Apple Inc.", type: "stock" },
      { symbol: "MSFT", name: "Microsoft", type: "stock" },
      { symbol: "GOOGL", name: "Google", type: "stock" },
      { symbol: "TSLA", name: "Tesla", type: "stock" },
      { symbol: "AMZN", name: "Amazon", type: "stock" }
    ],
    crypto: [
      { symbol: "BTC", name: "Bitcoin", type: "crypto" },
      { symbol: "ETH", name: "Ethereum", type: "crypto" },
      { symbol: "BNB", name: "Binance Coin", type: "crypto" }
    ],
    indices: [
      { symbol: "SPY", name: "S&P 500", type: "index" },
      { symbol: "QQQ", name: "NASDAQ", type: "index" },
      { symbol: "DIA", name: "Dow Jones", type: "index" }
    ],
    indian_stocks: [
      { symbol: "RELIANCE", name: "Reliance Industries", type: "stock" },
      { symbol: "TCS", name: "Tata Consultancy Services", type: "stock" },
      { symbol: "INFY", name: "Infosys", type: "stock" },
      { symbol: "HDFCBANK", name: "HDFC Bank", type: "stock" }
    ]
  };

  res.json({ entities: popularEntities });
});

// --- Advanced News Search Endpoint ---
app.post("/api/finnews/search", async (req, res) => {
  try {
    const { 
      query = "finance",
      filters = {},
      pageSize = 10,
      includeInsights = true,
      includeSentiment = true 
    } = req.body;

    const searchParams = {
      q: query,
      pageSize: Math.min(Math.max(parseInt(pageSize) || 10, 1), 50),
      category: filters.category || "all",
      entities: filters.entities || "",
      sentiment_filter: filters.sentiment || "all"
    };

    // Use the existing finnews endpoint logic
    const response = await axios.get(`http://localhost:${process.env.PORT || 8000}/api/finnews`, {
      params: searchParams
    });

    res.json({
      ...response.data,
      searchQuery: query,
      appliedFilters: filters,
      enhancementsEnabled: {
        insights: includeInsights,
        sentiment: includeSentiment
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ 
      error: "Search failed",
      message: "Unable to perform advanced news search"
    });
  }
});

// --- News Analytics Endpoint ---
app.get("/api/analytics/sentiment", async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // This would typically query a database of processed articles
    // For now, return mock analytics data
    const analytics = {
      period: `${days} days`,
      sentimentDistribution: {
        positive: 45,
        negative: 25,
        neutral: 30
      },
      trendingTopics: [
        { topic: "Stock Market", mentions: 156, sentiment: "positive" },
        { topic: "Interest Rates", mentions: 89, sentiment: "neutral" },
        { topic: "Inflation", mentions: 67, sentiment: "negative" },
        { topic: "Cryptocurrency", mentions: 134, sentiment: "positive" },
        { topic: "Banking Sector", mentions: 78, sentiment: "neutral" }
      ],
      marketImpact: {
        high: 15,
        medium: 35,
        low: 50
      },
      timestamp: new Date().toISOString()
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: "Analytics temporarily unavailable" });
  }
});

// --- Health Check Endpoint ---
app.get("/api/health", async (req, res) => {
  const healthCheck = {
    status: "healthy",
    service: "WealthWise AI Backend",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    features: {
      marketaux_integration: !!process.env.MARKETAUX_API_KEY,
      gemini_ai: !!process.env.GEMINI_API_KEY,
      newsapi_fallback: !!process.env.NEWS_API_KEY,
      enhanced_insights: true,
      sentiment_analysis: true,
      dynamic_dictionary: true
    }
  };

  // Test external services
  try {
    if (process.env.MARKETAUX_API_KEY) {
      await axios.get("https://api.marketaux.com/v1/news/all", {
        params: { api_token: process.env.MARKETAUX_API_KEY, limit: 1 },
        timeout: 3000
      });
      healthCheck.services = { marketaux: "online" };
    }
  } catch (error) {
    healthCheck.services = { marketaux: "offline" };
    healthCheck.status = "degraded";
  }

  res.json(healthCheck);
});

// --- Financial Tips Endpoint ---
app.get("/api/tips/:mode?", (req, res) => {
  const { mode = 'general' } = req.params;
  
  const tips = {
    general: [
      "Start investing early - even ₹500/month can grow significantly over 20 years due to compound interest.",
      "Track your expenses for a month to understand your spending patterns better.",
      "Build an emergency fund before investing - aim for 6 months of living expenses."
    ],
    investment: [
      "Diversification is key - don't put all your money in one type of investment.",
      "SIP (Systematic Investment Plan) helps you invest regularly and reduces market timing risks.",
      "Equity mutual funds are great for long-term goals (5+ years) due to higher growth potential."
    ],
    planning: [
      "Set SMART financial goals - Specific, Measurable, Achievable, Relevant, Time-bound.",
      "Review your financial plan annually and adjust based on life changes.",
      "Start retirement planning early - even in your 20s, small amounts can grow substantially."
    ],
    debt: [
      "Pay off high-interest debt first (like credit cards) to save on interest charges.",
      "Never use credit cards for cash advances - they come with very high interest rates.",
      "Maintain a credit utilization ratio below 30% for a healthy credit score."
    ]
  };

  res.json({
    mode: mode,
    tips: tips[mode] || tips.general,
    timestamp: new Date().toISOString()
  });
});

// --- Advisory Modes Info Endpoint ---
app.get("/api/modes", (req, res) => {
  const modes = {
    general: {
      name: "General Finance",
      description: "Basic financial literacy, budgeting, and money management",
      icon: "DollarSign",
      topics: ["Budgeting", "Saving", "Basic Investing", "Financial Planning Basics"]
    },
    investment: {
      name: "Investment Advisory",
      description: "Investment strategies, mutual funds, SIPs, and portfolio building",
      icon: "TrendingUp", 
      topics: ["Mutual Funds", "SIP Planning", "Portfolio Diversification", "Market Analysis"]
    },
    planning: {
      name: "Financial Planning",
      description: "Comprehensive financial planning for life goals",
      icon: "Target",
      topics: ["Retirement Planning", "Goal-based Investing", "Insurance", "Tax Planning"]
    },
    debt: {
      name: "Debt Management", 
      description: "Debt optimization and credit improvement strategies",
      icon: "CreditCard",
      topics: ["Credit Score Improvement", "Loan Optimization", "Debt Consolidation", "Credit Cards"]
    }
  };

  res.json({ modes });
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    response: "I'm experiencing technical difficulties. Please try again in a moment. Remember, I'm here to help with all your financial learning needs!",
    timestamp: new Date().toISOString(),
    error: true
  });
});

// --- 404 Handler ---
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: "Endpoint not found. Available endpoints: /api/chat, /api/health, /api/tips, /api/modes, /api/finnews, /api/dictionary/:term, /api/categories, /api/entities, /api/finnews/search, /api/analytics/sentiment" 
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ WealthWise AI Server running on http://localhost:${PORT}`);
  console.log(`🤖 Enhanced Financial Assistant Backend Ready`);
  console.log(`📊 Available Endpoints:`);
  console.log(`   POST /api/chat - Main chat functionality`);
  console.log(`   GET  /api/health - Health check with service status`);
  console.log(`   GET  /api/tips/:mode - Get financial tips`);
  console.log(`   GET  /api/modes - Get advisory mode info`);
  console.log(`   GET  /api/finnews - Enhanced finance news with insights`);
  console.log(`   GET  /api/dictionary/:term - Dynamic financial definitions`);
  console.log(`   GET  /api/categories - Available news categories`);
  console.log(`   GET  /api/entities - Popular financial entities`);
  console.log(`   POST /api/finnews/search - Advanced news search`);
  console.log(`   GET  /api/analytics/sentiment - Market sentiment analytics`);
  console.log(`🔍 Features: Marketaux integration, AI insights, sentiment analysis, dynamic dictionary`);
});