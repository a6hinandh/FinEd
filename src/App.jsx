import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FinEdLanding from "./LandingPage";
import FeaturesPage from "./FeaturePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FinEdLanding />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
