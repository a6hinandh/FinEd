import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FinEdLanding from "./LandingPage";
import FeaturesPage from "./FeaturePage";
import CommunityPage from "./features/CommunityPage";
import FinancialSimulatorLanding from "./features/CreditOrLoan";
import CreditCardSimulator from "./features/CreditSimulator";
import CreditCardSimulationExplanation from "./features/CreditSimulatorWorking";
import LoanSimulationExplanation from "./features/LoanSimulationWorking";
import LoanSimulator from "./features/LoanSimulator";
import FinancialChatbot from "./features/FinChatbot";
import FinNews from "./features/finNews";
import StockSimulator from "./features/StockSimulator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FinEdLanding />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/community" element={<CommunityPage/>}/>
        <Route path="/creditOrLoan" element={<FinancialSimulatorLanding/>}/>
        <Route path="/credit" element={<CreditCardSimulator/>}/>
        <Route path="/credit!help" element={<CreditCardSimulationExplanation/>}/>
        <Route path="/loan!help" element={<LoanSimulationExplanation/>}/>
        <Route path="/loan" element={<LoanSimulator/>}/>
        <Route path="/chatbot" element={<FinancialChatbot/>}/>
        <Route path="/news" element={<FinNews/>}/>
        <Route path="/stock" element={<StockSimulator/>}/>
      </Routes>
    </Router>
  );
}

export default App;
