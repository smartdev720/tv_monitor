import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout";
import { Sequence, AnalogSettings } from "./pages";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sequence" element={<Sequence />} />
        <Route path="/analog-setting" element={<AnalogSettings />} />
      </Routes>
    </>
  );
}

export default App;
