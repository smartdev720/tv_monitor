import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout";
import {
  Sequence,
  AnalogSettings,
  Groups,
  T2Settings,
  DVBCSettings,
  IPTVSettings,
  Devices,
} from "./pages";
import { FloatButton } from "antd";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sequence" element={<Sequence />} />
        <Route path="/analog-setting" element={<AnalogSettings />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/dvb-t2-setting" element={<T2Settings />} />
        <Route path="/dvb-c-setting" element={<DVBCSettings />} />
        <Route path="/iptv-setting" element={<IPTVSettings />} />
        <Route path="/devices" element={<Devices />} />
      </Routes>
      <FloatButton.BackTop />
    </>
  );
}

export default App;
