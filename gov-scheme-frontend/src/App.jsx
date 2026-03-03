import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Language from "./pages/Language";
import Details from "./pages/Details";
import Chat from "./components/Chat";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route
        path="/language"
        element={
          <ProtectedRoute>
            <Language />
          </ProtectedRoute>
        }
      />

      <Route
        path="/details"
        element={
          <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
