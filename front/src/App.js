import React from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import AdminPage from "./adminPages/AdminPage";
import UserPage from "./userPages/UserPage";
import BookmakerPage from "./bookmakerPages/BookmakerPage";
import { jwtDecode } from "jwt-decode";

function App() {

    const useAuth = (requiredRole) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;
        const decodedToken = jwtDecode(token);
        return decodedToken.role === requiredRole;
    };

    const ProtectedRoute = ({ children, role }) => {
        const hasPermission = useAuth(role);
        if (!hasPermission) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
            <Route path="/bookmaker" element={<ProtectedRoute role="bookmaker"><BookmakerPage /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute role="user"><UserPage /></ProtectedRoute>} />
        </Routes>
    );
}

export default App;
