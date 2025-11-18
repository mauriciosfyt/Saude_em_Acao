import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const perfil = sessionStorage.getItem("userPerfil");

  if (perfil !== "ALUNO") {
    return <Navigate to="/nao-autorizado" />;
  }

  return children;
}
