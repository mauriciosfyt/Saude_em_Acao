import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const perfil = sessionStorage.getItem("userPerfil");

  if (perfil !== "ADMIN") {
    return <Navigate to="/nao-autorizado" />;
  }

  return children;
}
