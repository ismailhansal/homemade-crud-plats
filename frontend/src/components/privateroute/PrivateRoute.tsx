import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        // Pas de token => on redirige vers login
        return <Navigate to="/login/client" replace />;
    }

    // Token présent, on affiche le composant enfant (ex: Browse)
    return children;
};

export default PrivateRoute;
