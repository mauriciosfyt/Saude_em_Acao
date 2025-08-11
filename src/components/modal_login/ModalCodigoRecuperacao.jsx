import React from "react";
import logo from "../../assets/logo1.png";

export default function RecoverCodeModal({
  code,
  onChange,
  onClose,
  onValidate,
}) {
  // Adiciona a classe 'modal-open' ao body do documento quando o componente é montado
  React.useEffect(() => {
    document.body.classList.add("modal-open");

    // Remove a classe 'modal-open' do body do documento quando o componente é desmontado
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
        <img src={logo} alt="Logo" className="modal-logo" />
        <h4
          className="modal-boasvindas"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Seja muito bem-vindo(a) à{" "}
          <span style={{ color: "#1062fe" }}>Saúde em Ação</span>, o lugar onde
          sua transformação começa
        </h4>
        <p
          className="modal-subtexto"
          style={{
            textAlign: "center",
            marginBottom: "8px",
            fontSize: "0.9rem",
            color: "#808080",
          }}
        >
          Prepare-se para viver sua melhor versão.
        </p>
        <h2 className="modal-title">DIGITE O CÓDIGO</h2>
        <p style={{ textAlign: "center", marginBottom: 24 }}>
          Digite o código que acabamos de enviar no seu email
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`recover-code-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="modal-code-input"
              value={digit}
              onChange={(e) => onChange(e.target.value, idx)}
              style={{
                textAlign: "center",
                fontSize: "2rem",
                width: 48,
                height: 48,
                border: "2px solid #1062fe",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
        <button className="modal-btn" onClick={onValidate}>
          VALIDAR
        </button>
        <p
          style={{
            textAlign: "center",
            marginTop: "8px",
            fontSize: "0.9rem",
            color: "#808080",
          }}
        >
          Este código expirará em 15 minutos. Se você não o recebeu, verifique
          sua caixa de spam ou solicite um novo código.
        </p>
      </div>
    </div>
  );
}
