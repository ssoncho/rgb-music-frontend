import "./assets/css/fonts.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modes from "./pages/Modes/Modes";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Modes />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
