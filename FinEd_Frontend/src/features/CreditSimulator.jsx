import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const styles = {
  container: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0A0A0A',
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.02) 0%, transparent 50%)',
    minHeight: '100vh',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
    cursor: 'default',
    transition: 'all 0.4s ease',
    position: 'relative',
  },
  titleHover: {
    transform: 'scale(1.05)',
    textShadow: '0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#B8860B',
    fontWeight: '400',
    transition: 'color 0.3s ease',
  },
  setupCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateY(0) scale(1)',
    position: 'relative',
    overflow: 'hidden',
    width:'400px'
  },
  setupCardHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  setupTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  formSpace: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#D4AF37',
    marginBottom: '6px',
    transition: 'color 0.3s ease',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '1rem',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: '#2A2A2A',
    color: '#FFD700',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#FFD700',
    boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.1), 0 0 20px rgba(255, 215, 0, 0.2)',
    transform: 'scale(1.02)',
  },
  inputWithLeftIcon: {
    paddingLeft: '36px',
  },
  inputWithRightIcon: {
    paddingRight: '36px',
  },
  currencySymbol: {
    position: 'absolute',
    left: '12px',
    color: '#B8860B',
    fontWeight: '500',
    pointerEvents: 'none',
    transition: 'color 0.3s ease',
  },
  percentSymbol: {
    position: 'absolute',
    right: '12px',
    color: '#B8860B',
    fontWeight: '500',
    pointerEvents: 'none',
    transition: 'color 0.3s ease',
  },
  startButton: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0A0A0A',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '10px',
    position: 'relative',
    overflow: 'hidden',
    transform: 'scale(1)',
  },
  startButtonHover: {
    transform: 'scale(1.02)',
    backgroundColor: '#FFA500',
    
  },
  startButtonActive: {
    transform: 'scale(0.98)',
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    className: 'cards-grid',
  },
  summaryCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, transparent 60%)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    transform: 'translateY(0) scale(1)',
    position: 'relative',
    overflow: 'hidden',
  },
  summaryCardHover: {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#B8860B',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    transition: 'color 0.3s ease',
  },
  cardTitleHover: {
    color: '#FFD700',
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0',
    transition: 'all 0.3s ease',
  },
  redValue: { 
    color: '#FF6B6B',
    textShadow: '0 0 10px rgba(255, 107, 107, 0.3)',
  },
  greenValue: { 
    color: '#4ECDC4',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
  },
  orangeValue: { 
    color: '#FFB347',
    textShadow: '0 0 10px rgba(255, 179, 71, 0.3)',
  },
  blueValue: { 
    color: '#74B9FF',
    textShadow: '0 0 10px rgba(116, 185, 255, 0.3)',
  },
  purpleValue: { 
    color: '#A29BFE',
    textShadow: '0 0 10px rgba(162, 155, 254, 0.3)',
  },
  smallText: {
    fontSize: '0.75rem',
    color: '#8B7355',
    marginTop: '4px',
    transition: 'color 0.3s ease',
  },
  timelineCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 165, 0, 0.02) 100%)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
    cursor: 'pointer',
  },
  timelineCardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  timelineTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  currentMonth: {
    fontSize: '0.875rem',
    color: '#B8860B',
    textAlign: 'center',
    transition: 'color 0.3s ease',
  },
  actionsCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  actionsCardHover: {
    transform: 'scale(1.01)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  actionsTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '20px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    className: 'actions-grid',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    transform: 'scale(1) translateY(0)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  actionButtonHover: {
    transform: 'scale(1.08) translateY(-3px)',
    filter: 'brightness(1.1)',
  },
  actionButtonActive: {
    transform: 'scale(0.95) translateY(1px)',
  },
  payMinimumButton: {
    backgroundColor: '#B8860B',
    backgroundImage: 'linear-gradient(135deg, #DAA520, #B8860B)',
    color: '#0A0A0A',
    border: '1px solid rgba(255, 215, 0, 0.3)',
  },
  payMinimumButtonHover: {
    boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4), 0 0 20px rgba(255, 215, 0, 0.3)',
    backgroundColor: '#DAA520',
  },
  payFullButton: {
    backgroundColor: '#2D5A3D',
    backgroundImage: 'linear-gradient(135deg, #3D7C47, #2D5A3D)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.2)',
  },
  payFullButtonHover: {
    boxShadow: '0 8px 25px rgba(45, 90, 61, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)',
    backgroundColor: '#3D7C47',
  },
  payCustomButton: {
    backgroundColor: '#4A148C',
    backgroundImage: 'linear-gradient(135deg, #6A1B9A, #4A148C)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.2)',
  },
  payCustomButtonHover: {
    boxShadow: '0 8px 25px rgba(74, 20, 140, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)',
    backgroundColor: '#6A1B9A',
  },
  makeChargeButton: {
    backgroundColor: '#8B0000',
    backgroundImage: 'linear-gradient(135deg, #A52A2A, #8B0000)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.2)',
  },
  makeChargeButtonHover: {
    boxShadow: '0 8px 25px rgba(139, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2)',
    backgroundColor: '#A52A2A',
  },
  undoButton: {
    backgroundColor: '#CC7A00',
    backgroundImage: 'linear-gradient(135deg, #FF8C00, #CC7A00)',
    color: '#0A0A0A',
    border: '1px solid rgba(255, 215, 0, 0.3)',
  },
  undoButtonHover: {
    boxShadow: '0 8px 25px rgba(204, 122, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.3)',
    backgroundColor: '#FF8C00',
  },
  modalOverlay: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 60%)',
    borderRadius: '12px',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.1)',
    animation: 'modalSlideIn 0.3s ease',
    transform: 'scale(1)',
    transition: 'transform 0.2s ease',
  },
  modalOverlayHover: {
    transform: 'scale(1.01)',
  },
  modalTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '8px',
    transition: 'color 0.3s ease',
  },
  modalInfo: {
    fontSize: '0.875rem',
    color: '#B8860B',
    marginBottom: '16px',
    transition: 'color 0.3s ease',
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalInputContainer: {
    flex: 1,
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
  confirmButton: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0A0A0A',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  confirmButtonHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#FFA500',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
  },
  cancelButton: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: '#2A2A2A',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  cancelButtonHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#3A3A3A',
    borderColor: 'rgba(255, 215, 0, 0.4)',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.2)',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    className: 'charts-grid',
  },
  chartCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
    cursor: 'pointer',
  },
  chartCardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  chartContainer: {
    height: '300px',
    transition: 'all 0.3s ease',
  },
  creditScoreContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  creditScoreBar: {
    width: '100%',
  },
  creditScoreTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: '#2A2A2A',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  creditScoreProgress: {
    height: '100%',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(90deg, #FF6B6B, #FFD700, #4ECDC4)',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    
  },
  creditScoreLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '0.75rem',
    color: '#8B7355',
    transition: 'color 0.3s ease',
  },
  creditScoreValue: {
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  creditScoreValueHover: {
    transform: 'scale(1.05)',
  },
  creditScoreNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    lineHeight: 1,
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  creditScoreLabel: {
    fontSize: '0.875rem',
    color: '#B8860B',
    marginTop: '4px',
    transition: 'color 0.3s ease',
  },
  creditTip: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#FFB347',
    border: '1px solid rgba(255, 179, 71, 0.2)',
    transition: 'all 0.3s ease',
  },
  resetContainer: {
    textAlign: 'center',
  },
  resetButton: {
    padding: '12px 24px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: '#2A2A2A',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  resetButtonHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#3A3A3A',
    borderColor: 'rgba(255, 215, 0, 0.5)',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.2)',
  },
  notification: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    maxWidth: '400px',
    padding: '16px 20px',
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, transparent 60%)',
    color: '#FFD700',
    borderRadius: '8px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.2)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    zIndex: 1000,
    transform: 'translateX(0) scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideInFromRight 0.5s ease',
  },
  notificationHover: {
    transform: 'translateX(-5px) scale(1.02)',
    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 215, 0, 0.4)',
  },
  notificationText: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    transition: 'all 0.3s ease',
  },
}

const CreditCardSimulator = () => {
  const [creditLimit, setCreditLimit] = useState('50000');
  const [interestRate, setInterestRate] = useState('36');
  const [minimumPaymentPercent, setMinimumPaymentPercent] = useState('5');
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [interestDue,setInterestDue] = useState(0);
  const [totalPaymentsMade, setTotalPaymentsMade] = useState(0);
  const [totalChargesMade, setTotalChargesMade] = useState(0);
  const [totalPenalties, setTotalPenalties] = useState(0);
  const [creditScore, setCreditScore] = useState(700);
  const [notification, setNotification] = useState('');
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomPaymentModal, setShowCustomPaymentModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [gameStateHistory, setGameStateHistory] = useState([]);
  const [billGenerated, setBillGenerated] = useState(false);
  const [currentBillAmount, setCurrentBillAmount] = useState(0);
  const [phase, setPhase] = useState('spending');
  const [isMobile, setIsMobile] = useState(false);
  

  const monthlyInterestRate = parseFloat(interestRate || 0) / 12 / 100;
  const totalOutstanding = currentBalance + currentSpending;
  const minimumPayment = billGenerated && currentBillAmount > 0 
    ? Math.max(currentBillAmount * (parseFloat(minimumPaymentPercent) / 100), 0) 
    : Math.max(totalOutstanding * (parseFloat(minimumPaymentPercent) / 100), 0);
  const availableCredit = parseFloat(creditLimit || 0) - totalOutstanding;
  const utilizationRatio = creditLimit > 0 ? (totalOutstanding / parseFloat(creditLimit)) * 100 : 0;

  const saveCurrentState = () => {
    const currentState = {
      currentMonth,
      currentBalance,
      currentSpending,
      totalInterestPaid,
      interestDue,
      totalPaymentsMade,
      totalChargesMade,
      totalPenalties,
      creditScore,
      balanceHistory: [...balanceHistory],
      paymentHistory: [...paymentHistory],
      billGenerated,
      currentBillAmount,
      phase
    };
    setGameStateHistory(prev => [...prev, currentState]);
  };

   useEffect(() => {
        const checkMobile = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
      }, []);

  const undoLastAction = () => {
    if (gameStateHistory.length === 0) {
      setNotification('No actions to undo!');
      return;
    }

    const lastState = gameStateHistory[gameStateHistory.length - 1];
    
    setCurrentMonth(lastState.currentMonth);
    setCurrentBalance(lastState.currentBalance);
    setCurrentSpending(lastState.currentSpending);
    setTotalInterestPaid(lastState.totalInterestPaid);
    setInterestDue(lastState.interestDue);
    setTotalPaymentsMade(lastState.totalPaymentsMade);
    setTotalChargesMade(lastState.totalChargesMade);
    setTotalPenalties(lastState.totalPenalties);
    setCreditScore(lastState.creditScore);
    setBalanceHistory(lastState.balanceHistory);
    setPaymentHistory(lastState.paymentHistory);
    setBillGenerated(lastState.billGenerated);
    setCurrentBillAmount(lastState.currentBillAmount);
    setPhase(lastState.phase);
    
    setGameStateHistory(prev => prev.slice(0, -1));
    setNotification(`Last action undone! Back to Month ${lastState.currentMonth}.`);
  };

  const startSimulation = () => {
    if (!creditLimit || !interestRate) {
      setNotification('Please fill all fields to start simulation');
      return;
    }

    const limit = parseFloat(creditLimit);
    const rate = parseFloat(interestRate);
    const minPercent = parseFloat(minimumPaymentPercent);
    
    if (limit <= 0 || rate < 0 || minPercent <= 0) {
      setNotification('Please enter valid positive values');
      return;
    }

    setCurrentBalance(0);
    setCurrentSpending(0);
    setTotalInterestPaid(0);
    setInterestDue(0);
    setTotalPaymentsMade(0);
    setTotalChargesMade(0);
    setTotalPenalties(0);
    setCurrentMonth(1);
    setCreditScore(700);
    setIsSimulationStarted(true);
    setCustomAmount('');
    setShowCustomPaymentModal(false);
    setShowChargeModal(false);
    setBillGenerated(false);
    setCurrentBillAmount(0);
    setPhase('spending');
    setNotification('Credit card simulation started! Start by making purchases during your spending phase.');
    
    const initialHistory = [{ month: 0, balance: 0, creditScore: 700 }];
    setBalanceHistory(initialHistory);
    setPaymentHistory([]);
    setGameStateHistory([]);
  };

  const resetSimulation = () => {
    setIsSimulationStarted(false);
    setCreditLimit('50000');
    setInterestRate('36');
    setMinimumPaymentPercent('5');
    setCurrentMonth(1);
    setCurrentBalance(0);
    setCurrentSpending(0);
    setTotalInterestPaid(0);
    setInterestDue(0);
    setTotalPaymentsMade(0);
    setTotalChargesMade(0);
    setTotalPenalties(0);
    setCreditScore(700);
    setNotification('');
    setBalanceHistory([]);
    setPaymentHistory([]);
    setCustomAmount('');
    setShowCustomPaymentModal(false);
    setShowChargeModal(false);
    setGameStateHistory([]);
    setBillGenerated(false);
    setCurrentBillAmount(0);
    setPhase('spending');
  };

  const generateBill = () => {
    if (currentSpending === 0 && currentBalance === 0) {
      setNotification('No spending or balance to generate bill for!');
      return;
    }

    saveCurrentState();

    // Only calculate interest if there's a previous outstanding balance
    const lastState = gameStateHistory[gameStateHistory.length - 1];
    let minus=0
    if(lastState.totalPaymentsMade==totalPaymentsMade){
      minus=500
    }
    console.log(lastState)
    const interestCharge = currentBalance > 0 ? (currentBalance-minus) * monthlyInterestRate : 0;
    const totalBill = currentBalance + interestCharge + currentSpending;
    
    setCurrentBillAmount(totalBill);
    
    
    setBillGenerated(true);
    setPhase('payment');
    
    setPaymentHistory(prev => [...prev, { 
      month: currentMonth, 
      action: 'Bill Generated', 
      amount: totalBill,
      balance: totalBill,
      interest: interestCharge
    }]);
    
    setNotification(`Bill generated for Month ${currentMonth}! Total Due: ₹${Math.round(totalBill)}${interestCharge > 0 ? `, Interest: ₹${Math.round(interestCharge)}` : ''}`);
  };


  const makePayment = (paymentAmount, paymentType) => {
  if (!billGenerated || currentBillAmount <= 0) {
    setNotification('No bill to pay! Generate bill first.');
    return;
  }

  saveCurrentState();
  
  const actualPayment = Math.min(paymentAmount, currentBillAmount);
  
  // Correct interest tracking
  setTotalInterestPaid(prev => prev + interestDue);
  
  const remainingBalance = currentBillAmount - actualPayment;
  
  // Carry forward unpaid interest
  const interest=remainingBalance > 0 ? remainingBalance * monthlyInterestRate : 0;
  setInterestDue(remainingBalance > 0 ? remainingBalance * monthlyInterestRate : 0);    
  
  setCurrentBalance(remainingBalance);
  setCurrentSpending(0);
  setCurrentBillAmount(prev=>prev+interest-actualPayment);
  setTotalPaymentsMade(prev => prev + actualPayment);
  setBillGenerated(false);
  setPhase('spending');
  
  // Credit score update
  if (paymentType === 'full') {
    setCreditScore(prev => Math.min(850, prev + 5));
  } else if (paymentType === 'minimum') {
    setCreditScore(prev => Math.max(300, prev - 2));
  } else {
    setCreditScore(prev => Math.min(850, prev + 2));
  }
  
  const newHistoryPoint = { 
    month: currentMonth, 
    balance: remainingBalance, 
    creditScore
  };
  setBalanceHistory(prev => [...prev, newHistoryPoint]);
  
  setPaymentHistory(prev => [...prev, { 
    month: currentMonth, 
    action: `${paymentType} Payment`, 
    amount: actualPayment,
    balance: remainingBalance 
  }]);
  
  const nextMonth = currentMonth + 1;
  setCurrentMonth(nextMonth);
  
  if (remainingBalance > 0) {
    setNotification(`Payment of ₹${Math.round(actualPayment)} made! Remaining balance: ₹${Math.round(remainingBalance)}. Now in Month ${nextMonth} spending phase. Interest will accrue on unpaid balance.`);
  } else {
    setNotification(`Payment of ₹${Math.round(actualPayment)} made! Balance cleared! Now in Month ${nextMonth} spending phase.`);
  }
};

  
  const makeCharge = () => {
    if (phase !== 'spending') {
      setNotification('Cannot make purchases during payment phase! Complete your payment first.');
      return;
    }

    if (!customAmount || parseFloat(customAmount) <= 0) {
      setNotification('Please enter a valid purchase amount');
      return;
    }

    const chargeAmount = parseFloat(customAmount);
    
    if (chargeAmount > availableCredit) {
      setNotification(`Purchase declined! Available credit: ₹${Math.round(availableCredit)}`);
      return;
    }

    saveCurrentState();

    const newSpending = currentSpending + chargeAmount;
    const newTotalOutstanding = currentBalance + newSpending;
    
    setCurrentSpending(newSpending);
    setTotalChargesMade(prev => prev + chargeAmount);
    
    const newUtilization = (newTotalOutstanding / parseFloat(creditLimit)) * 100;
    if (newUtilization > 80) {
      setCreditScore(prev => Math.max(300, prev - 8));
    } else if (newUtilization > 50) {
      setCreditScore(prev => Math.max(300, prev - 3));
    }
    
    setPaymentHistory(prev => [...prev, { 
      month: currentMonth, 
      action: 'Purchase Made', 
      amount: -chargeAmount,
      balance: newTotalOutstanding 
    }]);
    
    setCustomAmount('');
    setShowChargeModal(false);
    setNotification(`Purchase of ₹${Math.round(chargeAmount)} made! Current spending: ₹${Math.round(newSpending)}, Total outstanding: ₹${Math.round(newTotalOutstanding)}`);
  };


  const skipPayment = () => {
  if (!billGenerated || currentBillAmount <= 0) {
    setNotification('No bill to skip payment on! Generate bill first.');
    return;
  }

  saveCurrentState();

  const latePenalty = 500;
  const interestOnBill = currentBillAmount * monthlyInterestRate;
  const newBalance = currentBillAmount;

  setCurrentBalance(newBalance+latePenalty);
  setInterestDue(prev => prev + interestOnBill);
  setCurrentSpending(0);
  setCurrentBillAmount(prev=>prev+interestOnBill+latePenalty);
  setTotalPenalties(prev => prev + latePenalty);
  setBillGenerated(false);
  setPhase('spending');
  
  const newCreditScore = Math.max(300, creditScore - 25);
  setCreditScore(newCreditScore);
  
  const newHistoryPoint = { 
    month: currentMonth, 
    balance: newBalance + interestOnBill, 
    creditScore: newCreditScore
  };
  setBalanceHistory(prev => [...prev, newHistoryPoint]);
  setPaymentHistory(prev => [...prev, { 
    month: currentMonth, 
    action: 'Payment Missed (Penalty + Interest)', 
    amount: -(latePenalty + interestOnBill),
    balance: newBalance + interestOnBill 
  }]);
  
  const nextMonth = currentMonth + 1;
  setCurrentMonth(nextMonth);
  
  setNotification(`Payment missed! Penalty: ₹${Math.round(latePenalty)}, Additional interest: ₹${Math.round(interestOnBill)}. New balance: ₹${Math.round(newBalance + interestOnBill)}. Now in Month ${nextMonth}.`);
};



  const getCreditScoreColor = (score) => {
    if (score >= 750) return '#10B981';
    if (score >= 650) return '#F59E0B';
    return '#EF4444';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    return 'Poor';
  };

  const getUtilizationColor = (ratio) => {
    if (ratio >= 80) return '#EF4444';
    if (ratio >= 50) return '#F59E0B';
    if (ratio >= 30) return '#10B981';
    return '#3B82F6';
  };

  const pieData = [
    { name: 'Available Credit', value: Math.max(0, availableCredit), color: '#10B981' },
    { name: 'Used Credit', value: totalOutstanding, color: '#DC2626' }
  ];

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>Credit Card Simulator</h1>
          <p style={styles.subtitle}>Learn how credit cards, interest, and payments work with proper billing cycles</p>
        </div>

        {!isSimulationStarted ? (
          <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div style={styles.setupCard}>
            <h2 style={styles.setupTitle}>Setup Your Credit Card</h2>
            
            <div style={styles.formSpace}>
              <div>
                <label style={styles.label}>Credit Limit</label>
                <div style={styles.inputContainer}>
                  <span style={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    style={{...styles.input, ...styles.inputWithLeftIcon}}
                    placeholder="50000"
                    onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Annual Interest Rate (APR)</label>
                <div style={styles.inputContainer}>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{...styles.input, ...styles.inputWithRightIcon}}
                    placeholder="18"
                    onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <span style={styles.percentSymbol}>%</span>
                </div>
              </div>

              <div>
                <label style={styles.label}>Minimum Payment Percentage</label>
                <div style={styles.inputContainer}>
                  <input
                    type="number"
                    step="0.1"
                    value={minimumPaymentPercent}
                    onChange={(e) => setMinimumPaymentPercent(e.target.value)}
                    style={{...styles.input, ...styles.inputWithRightIcon}}
                    placeholder="5"
                    onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <span style={styles.percentSymbol}>%</span>
                </div>
              </div>

              <button
                onClick={startSimulation}
                style={styles.startButton}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.startButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.startButton)}
              >
                Start Simulation
              </button>
            </div>
          </div>
          </div>
        ) : (
          <div style={styles.dashboard}>
            <div style={{...styles.cardsGrid,gridTemplateColumns: isMobile? 'repeat(auto-fit, minmax(150px, 1fr))': 'repeat(auto-fit, minmax(200px, 1fr))',}}>
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Credit Limit</h3>
                <p style={{...styles.cardValue, ...styles.blueValue}}>₹{parseFloat(creditLimit).toLocaleString()}</p>
              </div>
              
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Outstanding Balance</h3>
                <p style={{...styles.cardValue, ...styles.redValue}}>₹{Math.round(currentBalance).toLocaleString()}</p>
                <p style={styles.smallText}>From previous bills</p>
              </div>
              
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Current Spending</h3>
                <p style={{...styles.cardValue, ...styles.orangeValue}}>₹{Math.round(currentSpending).toLocaleString()}</p>
                <p style={styles.smallText}>This billing cycle</p>
              </div>         
              
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Available Credit</h3>
                <p style={{...styles.cardValue, ...styles.greenValue}}>₹{Math.round(availableCredit).toLocaleString()}</p>
                <p style={styles.smallText}>Remaining limit</p>
              </div>  

              {!billGenerated && (
                <div style={styles.summaryCard}>
                  <h3 style={styles.cardTitle}>Current Bill Amount</h3>
                  <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(currentBillAmount).toLocaleString()}</p>
                  <p style={styles.smallText}>₹{Math.round(interestDue).toLocaleString()} (Interset)</p>
                </div>
              )}  
              
              {billGenerated && (
                <div style={styles.summaryCard}>
                  <h3 style={styles.cardTitle}>Current Bill Amount</h3>
                  <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(currentBillAmount).toLocaleString()}</p>
                  <p style={styles.smallText}>₹{Math.round(interestDue).toLocaleString()} (Interset)</p>
                </div>
              )}

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Minimum Payment</h3>
                <p style={{...styles.cardValue, ...styles.orangeValue}}>₹{Math.round(minimumPayment).toLocaleString()}</p>
                <p style={styles.smallText}>{minimumPaymentPercent}% of bill amount</p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Utilization Ratio</h3>
                <p style={{...styles.cardValue, color: getUtilizationColor(utilizationRatio)}}>{utilizationRatio.toFixed(1)}%</p>
                <p style={styles.smallText}>Keep under 30% for good credit</p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Total Interest Paid</h3>
                <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(totalInterestPaid).toLocaleString()}</p>
                <p style={styles.smallText}>Already charged</p>
              </div>              

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Total Penalties</h3>
                <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(totalPenalties).toLocaleString()}</p>
                <p style={styles.smallText}>Late payment fees</p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Total Payments Made</h3>
                <p style={{...styles.cardValue, ...styles.greenValue}}>₹{Math.round(totalPaymentsMade).toLocaleString()}</p>
              </div>
            </div>

            <div style={styles.timelineCard}>
              <h3 style={styles.timelineTitle}>Current Status</h3>
              <div style={styles.currentMonth}>
                Month: <span style={{fontWeight: '600', color: '#DC2626'}}>{currentMonth}</span> | 
                Phase: <span style={{fontWeight: '600', color: phase === 'spending' ? '#F59E0B' : '#7C3AED'}}>{phase === 'spending' ? 'Spending' : 'Payment'}</span> | 
                Outstanding: <span style={{fontWeight: '600', color: '#DC2626'}}>₹{Math.round(totalOutstanding)}</span> | 
                Credit Score: <span style={{fontWeight: '600', color: getCreditScoreColor(creditScore)}}>{creditScore}</span>
              </div>
              {phase === 'spending' && (
                <div style={{...styles.currentMonth, marginTop: '8px', fontSize: '0.75rem'}}>
                  {currentSpending > 0 || currentBalance > 0 ? 'You can continue spending or generate your bill' : 'Start by making purchases with your credit card'}
                </div>
              )}
              {phase === 'payment' && (
                <div style={{...styles.currentMonth, marginTop: '8px', fontSize: '0.75rem'}}>
                  Bill generated! Choose your payment option below
                </div>
              )}
            </div>

            <div style={styles.actionsCard}>
              <h3 style={styles.actionsTitle}>
                {phase === 'spending' ? `Spending Phase - Month ${currentMonth}` : `Payment Phase - Month ${currentMonth}`}
              </h3>
              <div style={styles.actionsGrid}>
                {phase === 'spending' && (
                  <>
                    <button
                      onClick={() => setShowChargeModal(true)}
                      style={{...styles.actionButton, ...styles.makeChargeButton}}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <span>💳</span>
                      <span>Make Purchase</span>
                    </button>
                    
                    {(currentSpending > 0 || currentBalance > 0) && (
                      <button
                        onClick={generateBill}
                        style={{...styles.actionButton, backgroundColor: '#7C3AED', color: 'white'}}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <span>📋</span>
                        <span>Generate Bill</span>
                      </button>
                    )}
                  </>
                )}

                {phase === 'payment' && billGenerated && (
                  <>
                    <button
                      onClick={() => makePayment(minimumPayment, 'minimum')}
                      style={{...styles.actionButton, ...styles.payMinimumButton}}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <span>💰</span>
                      <span>Pay Minimum (₹{Math.round(minimumPayment)})</span>
                    </button>
                    
                    <button
                      onClick={() => makePayment(currentBillAmount, 'full')}
                      style={{...styles.actionButton, ...styles.payFullButton}}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <span>✅</span>
                      <span>Pay Full (₹{Math.round(currentBillAmount)})</span>
                    </button>
                    
                    <button
                      onClick={() => setShowCustomPaymentModal(true)}
                      style={{...styles.actionButton, ...styles.payCustomButton}}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <span>💵</span>
                      <span>Pay Custom Amount</span>
                    </button>
                    
                    <button
                      onClick={skipPayment}
                      style={{...styles.actionButton, backgroundColor: '#EF4444', color: 'white'}}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <span>⚠️</span>
                      <span>Skip Payment</span>
                    </button>
                  </>
                )}

                {gameStateHistory.length > 0 && (
                  <button
                    onClick={undoLastAction}
                    style={{...styles.actionButton, ...styles.undoButton}}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <span>↩️</span>
                    <span>Undo Last Action</span>
                  </button>
                )}
              </div>

              {showCustomPaymentModal && (
                <div style={styles.modalOverlay}>
                  <h4 style={styles.modalTitle}>Enter Custom Payment Amount</h4>
                  <p style={styles.modalInfo}>Pay any amount between ₹1 and ₹{Math.round(currentBillAmount)}</p>
                  <div style={styles.modalActions}>
                    <div style={styles.modalInputContainer}>
                      <div style={styles.inputContainer}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          style={{...styles.input, ...styles.inputWithLeftIcon, borderColor: '#C084FC'}}
                          placeholder="Enter payment amount"
                          min="1"
                          max={currentBillAmount}
                          onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                          onBlur={(e) => e.target.style.borderColor = '#C084FC'}
                        />
                      </div>
                    </div>
                    <div style={styles.modalButtons}>
                      <button
                        onClick={() => {
                          const amount = parseFloat(customAmount);
                          if (amount > 0 && amount <= currentBillAmount) {
                            makePayment(amount, 'custom');
                            setShowCustomPaymentModal(false);
                            setCustomAmount('');
                          } else {
                            setNotification('Please enter a valid payment amount');
                          }
                        }}
                        style={styles.confirmButton}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        
                      >
                        Make Payment
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomPaymentModal(false);
                          setCustomAmount('');
                        }}
                        style={styles.cancelButton}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'black'}
                        onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.cancelButton)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showChargeModal && (
                <div style={{...styles.modalOverlay, borderColor: '#F87171'}}>
                  <h4 style={styles.modalTitle}>Make a Purchase</h4>
                  <p style={styles.modalInfo}>Available credit: ₹{Math.round(availableCredit)}</p>
                  <div style={styles.modalActions}>
                    <div style={styles.modalInputContainer}>
                      <div style={styles.inputContainer}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          style={{...styles.input, ...styles.inputWithLeftIcon, borderColor: '#F87171'}}
                          placeholder="Enter purchase amount"
                          min="1"
                          max={availableCredit}
                          onFocus={(e) => e.target.style.borderColor = '#DC2626'}
                          onBlur={(e) => e.target.style.borderColor = '#F87171'}
                        />
                      </div>
                    </div>
                    <div style={styles.modalButtons}>
                      <button
                        onClick={makeCharge}
                        style={{...styles.confirmButton, }}
                        
                      >
                        Make Purchase
                      </button>
                      <button
                        onClick={() => {
                          setShowChargeModal(false);
                          setCustomAmount('');
                        }}
                        style={styles.cancelButton}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.chartsGrid}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Balance Over Time</h3>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={balanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${Math.round(value).toLocaleString()}`, 'Balance']} />
                      <Line type="monotone" dataKey="balance" stroke="#DC2626" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Credit Utilization</h3>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Math.round(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{textAlign: 'center', marginTop: '16px'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: getUtilizationColor(utilizationRatio)}}>
                    {utilizationRatio.toFixed(1)}%
                  </div>
                  <div style={{fontSize: '0.875rem', color: '#6B7280'}}>Utilization Ratio</div>
                </div>
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Credit Score</h3>
                <div style={styles.creditScoreContainer}>
                  <div style={styles.creditScoreBar}>
                    <div style={styles.creditScoreTrack}>
                      <div
                        style={{
                          ...styles.creditScoreProgress,
                          width: `${((creditScore - 300) / 550) * 100}%`,
                          backgroundColor: getCreditScoreColor(creditScore)
                        }}
                      />
                    </div>
                    <div style={styles.creditScoreLabels}>
                      <span>300</span>
                      <span>850</span>
                    </div>
                  </div>
                  <div style={styles.creditScoreValue}>
                    <div style={{...styles.creditScoreNumber, color: getCreditScoreColor(creditScore)}}>
                      {creditScore}
                    </div>
                    <div style={styles.creditScoreLabel}>{getCreditScoreLabel(creditScore)}</div>
                  </div>
                </div>
                
                <div style={styles.creditTip}>
                  <p><strong>Tips:</strong></p>
                  <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
                    <li>Pay full balance to avoid interest</li>
                    <li>Keep utilization under 30%</li>
                    <li>Never miss payments</li>
                  </ul>
                </div>
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Transaction History</h3>
                <div style={{maxHeight: '250px', overflowY: 'auto',width:"100%"}}>
                  {paymentHistory.length === 0 ? (
                    <p style={{color: '#6B7280', textAlign: 'center', padding: '40px'}}>
                      No transactions yet
                    </p>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      {paymentHistory.slice().reverse().map((entry, index) => (
                        <div 
                          key={index} 
                          style={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '12px',
                            backgroundColor: entry.action.includes('Bill') ? '#EEF2FF' : '#F8FAFC',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            backgroundColor:"black"
                          }}
                        >
                          <span>Month {entry.month}: {entry.action}</span>
                          <span style={{
                            color: entry.amount > 0 ? '#16A34A' : '#DC2626',
                            fontWeight: '600'
                          }}>
                            {entry.amount > 0 ? '-' : '+'}₹{Math.abs(entry.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.resetContainer}>
              <button
                onClick={resetSimulation}
                style={styles.resetButton}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Reset Simulation
              </button>
            </div>
          </div>
        )}

        {/* {notification && (
          <div style={styles.notification}>
            <p style={styles.notificationText}>{notification}</p>
          </div>
        )} */}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .charts-grid {
              grid-template-columns: 1fr !important;
            }
            .actions-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          @media (max-width: 480px) {
            .cards-grid {
              grid-template-columns: 1fr !important;
            }
            .actions-grid {
              grid-template-columns: 1fr !important;
            }
          }
          
          input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
          }
          
          button:hover {
            transform: translateY(-1px);
          }
          
          button:active {
            transform: translateY(0);
          }
        `}
      </style>
    </div>
  );
};

export default CreditCardSimulator;