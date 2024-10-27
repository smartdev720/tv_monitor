import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout";
import {
  Sequence,
  AnalogSettings,
  Groups,
  T2Settings,
  DVBCSettings,
  IPTVSettings,
  Devices,
  Schedules,
  UserLogin,
  UserRegister,
} from "./pages";
import { FloatButton } from "antd";

function App() {
  const location = useLocation();
  const isLoginLocation = location.pathname === "/auth/login";
  const isRegisterLocation = location.pathname === "/auth/register";

  return (
    <>
      {!isLoginLocation && !isRegisterLocation && <Navbar />}
      <Routes>
        <Route path="/auth/login" element={<UserLogin />} />
        <Route path="/auth/register" element={<UserRegister />} />
        <Route path="/sequence" element={<Sequence />} />
        <Route path="/analog-setting" element={<AnalogSettings />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/dvb-t2-setting" element={<T2Settings />} />
        <Route path="/dvb-c-setting" element={<DVBCSettings />} />
        <Route path="/iptv-setting" element={<IPTVSettings />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/schedules" element={<Schedules />} />
      </Routes>
      <FloatButton.BackTop />
    </>
  );
}

export default App;
