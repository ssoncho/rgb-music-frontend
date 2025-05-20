import "./assets/css/fonts.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modes from "./pages/Modes/Modes";
import Settings from "./pages/Settings/Settings";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/modes" element={<Modes />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
