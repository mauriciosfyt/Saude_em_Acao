import { Navigate } from "react-router-dom";

export default function PersonalRoute({ children }) {
  const perfil = sessionStorage.getItem("userPerfil");

  if (perfil !== "PROFESSOR") {
    return <Navigate to="/nao-autorizado" />;
  }

  return children;
}
