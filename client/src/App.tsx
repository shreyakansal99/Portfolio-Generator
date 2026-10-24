import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Editor from "./pages/Editor";
import PublicPortfolio from "./pages/PublicPortfolio";
import PrivateRoute from "./components/common/PrivateRoute";
import Preview from "./pages/Preview";

export default function App() {
  const { pathname } = useLocation();
  const isPublicPage = pathname.startsWith("/u/");

  return (
    <>
      {!isPublicPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
        <Route path="/editor" element={<PrivateRoute><Editor /></PrivateRoute>} />
        <Route path="/u/:slug" element={<PublicPortfolio />} />
        <Route path="/preview" element={<PrivateRoute><Preview /></PrivateRoute>} />
      </Routes>
    </>
  );
}