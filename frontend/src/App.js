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
  Login,
  UserRegister,
  Main,
  TablePage,
  Video,
  ChartPage,
  Compare,
} from "./pages";
import { FloatButton } from "antd";
import { ProtectedRoute } from "./components/common";

function App() {
  const location = useLocation();
  const isLoginLocation = location.pathname === "/auth/login";
  const isUserRegisterLocation = location.pathname === "/auth/register";

  return (
    <>
      {!isLoginLocation && !isUserRegisterLocation && <Navbar />}
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<UserRegister />} />
        {/* <Route
          path="/auth/register"
          element={<ProtectedRoute element={<UserRegister />} />}
        /> */}
        <Route
          path="/sequence"
          element={<ProtectedRoute element={<Sequence />} />}
        />
        <Route
          path="/analog-setting"
          element={<ProtectedRoute element={<AnalogSettings />} />}
        />
        <Route
          path="/groups"
          element={<ProtectedRoute element={<Groups />} />}
        />
        <Route
          path="/dvb-t2-setting"
          element={<ProtectedRoute element={<T2Settings />} />}
        />
        <Route
          path="/dvb-c-setting"
          element={<ProtectedRoute element={<DVBCSettings />} />}
        />
        <Route
          path="/iptv-setting"
          element={<ProtectedRoute element={<IPTVSettings />} />}
        />
        <Route
          path="/devices"
          element={<ProtectedRoute element={<Devices />} />}
        />
        <Route
          path="/schedules"
          element={<ProtectedRoute element={<Schedules />} />}
        />
        <Route path="/main" element={<Main />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/video" element={<Video />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
      <FloatButton.BackTop />
    </>
  );
}

export default App;
