import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BookOpen, Bell, X, Info } from 'lucide-react';
import './StockSimulator.css';

const StockSimulator = () => {
  const [currentView, setCurrentView] = useState('portfolio');
  const [wallet, setWallet] = useState(100000);
  const [holdings, setHoldings] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [showTooltip, setShowTooltip] = useState(null);
  const [currentNews, setCurrentNews] = useState(0);
  const newsIntervalRef = useRef(null);

  // Indian companies with realistic data
  const companies = {
    'RELIANCE': {
      name: 'Reliance Industries Ltd',
      description: 'India\'s largest private sector company operating in petrochemicals, oil & gas, and retail sectors.',
      sector: 'Energy',
      marketCap: '₹15,50,000 Cr',
      pe: 25.4
    },
    'TCS': {
      name: 'Tata Consultancy Services',
      description: 'Global leader in IT services, consulting and business solutions with strong presence in digital transformation.',
      sector: 'IT Services',
      marketCap: '₹12,80,000 Cr',
      pe: 28.9
    },
    'HDFCBANK': {
      name: 'HDFC Bank Ltd',
      description: 'India\'s largest private sector bank offering comprehensive banking and financial services.',
      sector: 'Banking',
      marketCap: '₹11,20,000 Cr',
      pe: 18.5
    },
    'INFY': {
      name: 'Infosys Ltd',
      description: 'Multinational IT corporation providing consulting, technology and outsourcing services globally.',
      sector: 'IT Services',
      marketCap: '₹7,45,000 Cr',
      pe: 24.8
    },
    'HINDUNILVR': {
      name: 'Hindustan Unilever Ltd',
      description: 'Leading FMCG company with portfolio of trusted brands in home & personal care and foods.',
      sector: 'FMCG',
      marketCap: '₹5,90,000 Cr',
      pe: 58.2
    },
    'ICICIBANK': {
      name: 'ICICI Bank Ltd',
      description: 'India\'s second-largest private sector bank providing retail and corporate banking services.',
      sector: 'Banking',
      marketCap: '₹8,75,000 Cr',
      pe: 16.8
    },
    'SBIN': {
      name: 'State Bank of India',
      description: 'India\'s largest public sector bank with extensive domestic and international presence.',
      sector: 'Banking',
      marketCap: '₹6,20,000 Cr',
      pe: 12.4
    },
    'BHARTIARTL': {
      name: 'Bharti Airtel Ltd',
      description: 'Leading telecommunications company providing mobile, fixed-line and digital services across India and Africa.',
      sector: 'Telecom',
      marketCap: '₹4,85,000 Cr',
      pe: 22.1
    },
    'ITC': {
      name: 'ITC Ltd',
      description: 'Diversified conglomerate with presence in FMCG, hotels, paperboards, packaging and agri-business.',
      sector: 'FMCG',
      marketCap: '₹5,15,000 Cr',
      pe: 26.7
    },
    'LT': {
      name: 'Larsen & Toubro Ltd',
      description: 'Engineering, construction and manufacturing company with global operations in infrastructure projects.',
      sector: 'Construction',
      marketCap: '₹4,95,000 Cr',
      pe: 19.3
    },
    'MARUTI': {
      name: 'Maruti Suzuki India Ltd',
      description: 'India\'s largest passenger car manufacturer with strong market presence and dealer network.',
      sector: 'Automotive',
      marketCap: '₹4,25,000 Cr',
      pe: 23.8
    },
    'ASIANPAINT': {
      name: 'Asian Paints Ltd',
      description: 'Leading paint company in India with strong brand presence in decorative and industrial coatings.',
      sector: 'Paints',
      marketCap: '₹3,85,000 Cr',
      pe: 55.2
    }
  };

  // Initialize stock prices and historical data
  const [stockData, setStockData] = useState(() => {
    const data = {};
    Object.keys(companies).forEach(symbol => {
      const basePrice = Math.random() * 2000 + 500; // Random base price between 500-2500
      const history = [];
      let currentPrice = basePrice;
      
      // Generate intraday data (last 7 hours of trading)
      const now = new Date();
      const startHour = 9; // Market opens at 9 AM
      const currentHour = now.getHours();
      const marketHours = currentHour >= startHour ? currentHour - startHour + 1 : 7; // Default to 7 hours if after market
      
      for (let i = Math.min(marketHours, 7) - 1; i >= 0; i--) {
        const time = new Date();
        time.setHours(startHour + (Math.min(marketHours, 7) - 1 - i));
        time.setMinutes(0);
        time.setSeconds(0);
        
        // Intraday volatility pattern (U-shape: high at open/close, lower midday)
        const hourOfDay = startHour + (Math.min(marketHours, 7) - 1 - i);
        const distanceFromMidpoint = Math.abs(hourOfDay - 12.5); // 12.5 is midpoint of 9-16
        const volatilityMultiplier = 0.8 + (distanceFromMidpoint / 7) * 0.4; // U-shape volatility
        
        // Hourly time step with realistic intraday movement
        const dt = 1/(252 * 7); // Hourly time step (252 trading days, 7 hours per day)
        const mu = 0.1; // Annual drift
        const sigma = 0.25 * volatilityMultiplier; // Annual volatility with intraday pattern
        const randomShock = Math.random() < 0.02 ? (Math.random() - 0.5) * 0.05 : 0; // 2% chance of news
        
        const drift = mu * dt;
        const diffusion = sigma * Math.sqrt(dt) * (Math.random() * 2 - 1);
        const priceChange = currentPrice * (drift + diffusion + randomShock);
        
        currentPrice = Math.max(currentPrice + priceChange, 10); // Minimum price of 10
        
        // Format time for display
        const timeString = time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        history.push({
          date: timeString,
          time: time.getTime(),
          price: Math.round(currentPrice * 100) / 100,
          volume: Math.floor(Math.random() * 100000) + 10000 // Lower volume for hourly data
        });
      }
      
      data[symbol] = {
        currentPrice: history[history.length - 1].price,
        history: history,
        change: history.length > 1 ? 
          ((history[history.length - 1].price - history[history.length - 2].price) / history[history.length - 2].price * 100) : 0
      };
    });
    return data;
  });

  // Financial terms and definitions
  const financialTerms = {
    'Stock': 'A share in the ownership of a company, representing a claim on part of the company\'s assets and earnings.',
    'Dividend': 'A payment made by corporations to their shareholders, usually as a distribution of profits.',
    'Market Cap': 'The total value of a company\'s shares, calculated by multiplying share price by number of shares outstanding.',
    'P/E Ratio': 'Price-to-Earnings ratio, comparing a company\'s current share price to its per-share earnings.',
    'Bull Market': 'A market condition where prices are rising or are expected to rise.',
    'Bear Market': 'A market condition where prices are falling or are expected to fall.',
    'Volatility': 'The degree of variation in a stock\'s price over time.',
    'Portfolio': 'A collection of financial investments like stocks, bonds, and cash.',
    'IPO': 'Initial Public Offering - when a company first sells shares to the public.',
    'Market Order': 'An order to buy or sell a stock immediately at the current market price.',
    'Limit Order': 'An order to buy or sell a stock at a specific price or better.',
    'Stop Loss': 'An order to sell a stock when it reaches a certain price to limit losses.',
    'ROI': 'Return on Investment - a measure of the efficiency of an investment.',
    'Beta': 'A measure of a stock\'s volatility compared to the overall market.',
    'EPS': 'Earnings Per Share - a company\'s profit divided by the outstanding shares.',
    'Book Value': 'The net worth of a company according to its balance sheet.',
    'Liquidity': 'How easily an asset can be converted into cash.',
    'Yield': 'The income return on an investment, expressed as a percentage.',
    'Sector': 'A group of companies that operate in the same business area.',
    'Blue Chip': 'Stocks of large, well-established companies with reliable performance.'
  };

  // Investment tips
  const investmentTips = [
    'Diversify your portfolio across different sectors to reduce risk.',
    'Never invest more than you can afford to lose.',
    'Do thorough research before investing in any company.',
    'Consider long-term investing rather than frequent trading.',
    'Keep emotions in check - don\'t panic sell during market downturns.',
    'Regularly review and rebalance your portfolio.',
    'Understand the company\'s business model before investing.',
    'Pay attention to management quality and corporate governance.',
    'Consider the company\'s debt levels and financial health.',
    'Look at industry trends and competitive positioning.',
    'Don\'t try to time the market - time in market beats timing the market.',
    'Start investing early to benefit from compound growth.',
    'Consider systematic investment plans (SIP) for disciplined investing.',
    'Keep some cash reserves for emergency situations.',
    'Understand tax implications of your investments.',
    'Monitor key financial ratios like P/E, P/B, and ROE.',
    'Be wary of hot tips and market rumors.',
    'Consider the economic cycle when making investment decisions.',
    'Learn from your mistakes and keep improving your strategy.',
    'Stay updated with company quarterly results and annual reports.'
  ];

  // News headlines
  const newsHeadlines = [
    'Technology sector shows strong growth amid digital transformation trends',
    'Banking stocks rally on positive quarterly earnings reports',
    'Government announces new infrastructure spending package worth ₹2 lakh crore',
    'Oil prices surge following global supply concerns',
    'Rupee strengthens against dollar on foreign investment inflows',
    'Electric vehicle adoption accelerates with new policy support',
    'Pharmaceutical companies report breakthrough in cancer research',
    'Retail sales boom during festive season across major cities',
    'Renewable energy sector attracts record investment this quarter',
    'IT services companies expand operations in international markets'
  ];

  // Simulate real-time price updates (every minute in real trading hours)
  useEffect(() => {
    const interval = setInterval(() => {
      setStockData(prevData => {
        const newData = { ...prevData };
        const now = new Date();
        const currentHour = now.getHours();
        const isMarketHours = currentHour >= 9 && currentHour <= 15; // 9 AM to 3:30 PM IST
        
        Object.keys(newData).forEach(symbol => {
          const currentPrice = newData[symbol].currentPrice;
          
          // Higher volatility during market hours
          const baseVolatility = isMarketHours ? 0.005 : 0.002; // 0.5% during market, 0.2% after
          
          // Intraday volatility pattern (U-shape)
          const distanceFromMidpoint = Math.abs(currentHour - 12);
          const volatilityMultiplier = isMarketHours ? (0.7 + (distanceFromMidpoint / 6) * 0.6) : 0.3;
          
          const volatility = baseVolatility * volatilityMultiplier;
          const randomChange = (Math.random() - 0.5) * volatility;
          const newPrice = Math.max(currentPrice * (1 + randomChange), 10);
          
          // Update history with new data point
          const history = [...newData[symbol].history];
          const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          // Keep only last 7 data points for display
          if (history.length >= 7) {
            history.shift();
          }
          
          history.push({
            date: timeString,
            time: now.getTime(),
            price: Math.round(newPrice * 100) / 100,
            volume: Math.floor(Math.random() * 50000) + 5000
          });
          
          newData[symbol] = {
            ...newData[symbol],
            currentPrice: Math.round(newPrice * 100) / 100,
            change: ((newPrice - currentPrice) / currentPrice * 100),
            history: history
          };
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds for demo purposes

    return () => clearInterval(interval);
  }, []);

  // News rotation
  useEffect(() => {
    newsIntervalRef.current = setInterval(() => {
      setCurrentNews(prev => (prev + 1) % newsHeadlines.length);
    }, 5000);

    return () => {
      if (newsIntervalRef.current) {
        clearInterval(newsIntervalRef.current);
      }
    };
  }, []);

  // Calculate portfolio value
  const calculatePortfolioValue = () => {
    let totalValue = wallet;
    Object.entries(holdings).forEach(([symbol, quantity]) => {
      totalValue += quantity * stockData[symbol].currentPrice;
    });
    return totalValue;
  };

  // Calculate total P&L
  const calculateTotalPL = () => {
    return calculatePortfolioValue() - 100000; // Starting amount was 100000
  };

  // Handle stock trade
  const handleTrade = (symbol, action) => {
    const price = stockData[symbol].currentPrice;
    const amount = parseInt(tradeAmount);
    
    if (!amount || amount <= 0) return;
    
    if (action === 'buy') {
      const totalCost = amount * price;
      if (totalCost <= wallet) {
        setWallet(prev => prev - totalCost);
        setHoldings(prev => ({
          ...prev,
          [symbol]: (prev[symbol] || 0) + amount
        }));
        
        setTradeHistory(prev => [{
          id: Date.now(),
          symbol,
          action: 'BUY',
          quantity: amount,
          price: price,
          total: totalCost,
          timestamp: new Date().toLocaleString()
        }, ...prev]);
      }
    } else if (action === 'sell') {
      const currentHolding = holdings[symbol] || 0;
      if (amount <= currentHolding) {
        const totalValue = amount * price;
        setWallet(prev => prev + totalValue);
        setHoldings(prev => ({
          ...prev,
          [symbol]: prev[symbol] - amount
        }));
        
        setTradeHistory(prev => [{
          id: Date.now(),
          symbol,
          action: 'SELL',
          quantity: amount,
          price: price,
          total: totalValue,
          timestamp: new Date().toLocaleString()
        }, ...prev]);
      }
    }
    
    setTradeAmount('');
    setSelectedStock(null);
  };

  // Render stock card
  const renderStockCard = (symbol) => {
    const stock = stockData[symbol];
    const company = companies[symbol];
    const holding = holdings[symbol] || 0;
    const isPositive = stock.change >= 0;
    
    return (
      <div key={symbol} className="ssstock-card" onClick={() => setSelectedStock(symbol)}>
        <div className="ssstock-header">
          <div>
            <h3 className="ssstock-symbol">{symbol}</h3>
            <p className="sscompany-name">{company.name}</p>
          </div>
          <div className="ssstock-price">
            <span className="ssprice">₹{stock.currentPrice}</span>
            <span className={`sschange ${isPositive ? 'sspositive' : 'ssnegative'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(stock.change).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="ssstock-info">
          <div className="ssinfo-row">
            <span>Sector: {company.sector}</span>
            <span>P/E: {company.pe}</span>
          </div>
          <div className="ssinfo-row">
            <span>Market Cap: {company.marketCap}</span>
            {holding > 0 && <span className="ssholding">Holdings: {holding}</span>}
          </div>
        </div>
        
        <div className="ssmini-chart">
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={stock.history}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#10B981" : "#EF4444"} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Render detailed stock view
  const renderStockDetail = () => {
    if (!selectedStock) return null;
    
    const stock = stockData[selectedStock];
    const company = companies[selectedStock];
    const holding = holdings[selectedStock] || 0;
    
    return (
      <div className="ssmodal-overlay" onClick={() => setSelectedStock(null)}>
        <div className="ssstock-detail-modal" onClick={e => e.stopPropagation()}>
          <div className="ssmodal-header">
            <h2>{selectedStock} - {company.name}</h2>
            <button className="ssclose-btn" onClick={() => setSelectedStock(null)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="ssmodal-content">
            <div className="ssstock-chart-section">
              <div className="ssprice-info">
                <span className="sscurrent-price">₹{stock.currentPrice}</span>
                <span className={`ssprice-change ${stock.change >= 0 ? 'sspositive' : 'ssnegative'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </span>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stock.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#888"
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #FFD700',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      `₹${value}`, 
                      'Price'
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#FFD700" 
                    strokeWidth={2}
                    dot={{ fill: '#FFD700', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 6, stroke: '#FFD700', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="sscompany-info">
              <h3>Company Information</h3>
              <p>{company.description}</p>
              <div className="sscompany-stats">
                <div className="ssstat">
                  <span>Sector</span>
                  <span>{company.sector}</span>
                </div>
                <div className="ssstat">
                  <span>Market Cap</span>
                  <span>{company.marketCap}</span>
                </div>
                <div className="ssstat">
                  <span>P/E Ratio</span>
                  <span>{company.pe}</span>
                </div>
                <div className="ssstat">
                  <span>Your Holdings</span>
                  <span>{holding} shares</span>
                </div>
              </div>
            </div>
            
            <div className="sstrade-section">
              <h3>Trade {selectedStock}</h3>
              <div className="sstrade-controls">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="sstrade-input"
                />
                <div className="sstrade-buttons">
                  <button 
                    className="ssbtn-buy"
                    onClick={() => handleTrade(selectedStock, 'buy')}
                    disabled={!tradeAmount || tradeAmount * stock.currentPrice > wallet}
                  >
                    Buy (₹{tradeAmount ? (tradeAmount * stock.currentPrice).toFixed(2) : '0'})
                  </button>
                  <button 
                    className="ssbtn-sell"
                    onClick={() => handleTrade(selectedStock, 'sell')}
                    disabled={!tradeAmount || tradeAmount > holding}
                  >
                    Sell (₹{tradeAmount ? (tradeAmount * stock.currentPrice).toFixed(2) : '0'})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render portfolio view
  const renderPortfolio = () => (
    <div className="ssportfolio-view">
      <div className="ssportfolio-summary">
        <div className="sssummary-card">
          <div className="sssummary-item">
            <DollarSign className="sssummary-icon" />
            <div>
              <span className="sssummary-label">Cash Balance</span>
              <span className="sssummary-value">₹{wallet.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="sssummary-card">
          <div className="sssummary-item">
            <PieChart className="sssummary-icon" />
            <div>
              <span className="sssummary-label">Portfolio Value</span>
              <span className="sssummary-value">₹{calculatePortfolioValue().toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="sssummary-card">
          <div className="sssummary-item">
            <TrendingUp className="sssummary-icon" />
            <div>
              <span className="sssummary-label">Total P&L</span>
              <span className={`sssummary-value ${calculateTotalPL() >= 0 ? 'sspositive' : 'ssnegative'}`}>
                ₹{calculateTotalPL().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ssholdings-section">
        <h2>Your Holdings</h2>
        {Object.keys(holdings).filter(symbol => holdings[symbol] > 0).length === 0 ? (
          <div className="ssempty-state">
            <p>No holdings yet. Start trading to build your portfolio!</p>
          </div>
        ) : (
          <div className="ssholdings-grid">
            {Object.entries(holdings)
              .filter(([symbol, quantity]) => quantity > 0)
              .map(([symbol, quantity]) => {
                const currentValue = quantity * stockData[symbol].currentPrice;
                const currentPrice = stockData[symbol].currentPrice;
                const change = stockData[symbol].change;
                const isPositive = change >= 0;
                return (
                  <div key={symbol} className="ssholding-card">
                    <div className="ssholding-header">
                      <div>
                        <span className="ssholding-symbol">{symbol}</span>
                        <span className="sscompany-name-small">{companies[symbol].name}</span>
                      </div>
                      <span className="ssholding-quantity">{quantity} shares</span>
                    </div>
                    
                    <div className="ssholding-price-info">
                      <div className="sscurrent-price-small">₹{currentPrice}</div>
                      <div className={`sschange-small ${isPositive ? 'sspositive' : 'ssnegative'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="ssholding-value">
                      <span>₹{currentValue.toLocaleString()}</span>
                    </div>
                    
                    <div className="ssholding-actions">
                      <button 
                        className="ssbtn-view-details"
                        onClick={() => setSelectedStock(symbol)}
                      >
                        View Details
                      </button>
                      <button 
                        className="ssbtn-sell-holding"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStock(symbol);
                          setTradeAmount(quantity.toString());
                        }}
                      >
                        Sell All
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="ssrecent-trades">
        <h2>Recent Trades</h2>
        {tradeHistory.length === 0 ? (
          <div className="ssempty-state">
            <p>No trades yet. Start trading to see your history!</p>
          </div>
        ) : (
          <div className="sstrade-list">
            {tradeHistory.slice(0, 10).map(trade => (
              <div key={trade.id} className="sstrade-item">
                <div className="sstrade-info">
                  <span className={`sstrade-action ${trade.action.toLowerCase() === 'buy' ? 'ssbuy' : 'sssell'}`}>
                    {trade.action}
                  </span>
                  <span className="sstrade-symbol">{trade.symbol}</span>
                  <span className="sstrade-details">
                    {trade.quantity} @ ₹{trade.price}
                  </span>
                </div>
                <div className="sstrade-total">
                  ₹{trade.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render trade view
  const renderTrade = () => (
    <div className="sstrade-view">
      <div className="ssmarket-overview">
        <h2>Market Overview</h2>
        <div className="ssstocks-grid">
          {Object.keys(companies).map(renderStockCard)}
        </div>
      </div>
    </div>
  );

  // Render learn view
  const renderLearn = () => (
    <div className="sslearn-view">
      <div className="sslearn-section">
        <h2>Financial Terms</h2>
        <div className="ssterms-grid">
          {Object.entries(financialTerms).map(([term, definition]) => (
            <div 
              key={term} 
              className="ssterm-card"
              onMouseEnter={() => setShowTooltip(term)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <h3>{term}</h3>
              <p>{definition}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sslearn-section">
        <h2>Investment Tips</h2>
        <div className="sstips-grid">
          {investmentTips.map((tip, index) => (
            <div key={index} className="sstip-card">
              <div className="sstip-number">{index + 1}</div>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="ssapp">
      <header className="ssheaderc">
        <div className="ssheader-content">
          <h1 className="sslogo"><span className="logo-fin">Fin</span>
        <span className="logo-ed">Ed</span> Investment</h1>
          <nav className="ssnav">
            <button 
              className={`ssnav-item ${currentView === 'portfolio' ? 'ssactive' : ''}`}
              onClick={() => setCurrentView('portfolio')}
            >
              Portfolio
            </button>
            <button 
              className={`ssnav-item ${currentView === 'trade' ? 'ssactive' : ''}`}
              onClick={() => setCurrentView('trade')}
            >
              Trade
            </button>
            <button 
              className={`ssnav-item ${currentView === 'learn' ? 'ssactive' : ''}`}
              onClick={() => setCurrentView('learn')}
            >
              Learn
            </button>
          </nav>
        </div>
      </header>

      <div className="ssnews-ticker">
        <Bell size={16} />
        <span className="ssnews-text">{newsHeadlines[currentNews]}</span>
      </div>

      <main className="ssmain-content">
        {currentView === 'portfolio' && renderPortfolio()}
        {currentView === 'trade' && renderTrade()}
        {currentView === 'learn' && renderLearn()}
      </main>

      {selectedStock && renderStockDetail()}
    </div>
  );
};

export default StockSimulator;