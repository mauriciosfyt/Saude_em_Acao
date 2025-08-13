import React, { useEffect } from 'react';
import './ModalTermos.css';

const ModalTermos = ({ onConcordo, onClose }) => {
  // Adiciona classe ao body para impedir scroll quando o modal estiver aberto
  useEffect(() => {
    document.body.classList.add('body-modal-open');
    return () => {
      document.body.classList.remove('body-modal-open');
    };
  }, []);

  return (
    <div className="modal-termos-overlay">
      <div className="modal-termos-container">
        {/* Botão de fechar modal */}
        <button
          className="modal-termos-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "-13px",
            background: "transparent",
            border: "none",
            fontSize: "2.5rem",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            outline: "none",
            boxShadow: "none"
          }}
          aria-label="Fechar modal"
        >
          &times;
        </button>

        {/* Título */}
        <h2 className="modal-termos-title">TERMOS DE USO</h2>

        {/* Conteúdo dos termos */}
        <div className="modal-termos-content">
          <p>
            Ao usar a aplicação web Equipe Saúde em Ação, você concorda com os seguintes termos:<br /><br />
            <strong>Aceitação:</strong> Ao acessar a plataforma, você concorda com estes Termos de Uso. Caso não concorde, não utilize a aplicação.<br />
            <strong>Uso da Aplicação:</strong> A plataforma oferece serviços relacionados a treinos, agendamento de aulas e acompanhamento de desempenho. Use-a apenas para fins pessoais e dentro da lei.<br />
            <strong>Cadastro e Conta:</strong> Para algumas funcionalidades, será necessário criar uma conta. Você é responsável pela segurança da sua conta.<br />
            <strong>Privacidade:</strong> Seus dados são protegidos conforme nossa Política de Privacidade.<br />
            <strong>Responsabilidades do Usuário:</strong> Não use a aplicação para fins ilegais, ofensivos ou prejudiciais.<br />
            <strong>Modificações:</strong> Podemos alterar ou descontinuar funcionalidades da aplicação a qualquer momento.<br />
            <strong>Isenção de Responsabilidade:</strong> Não nos responsabilizamos por danos à saúde ou problemas técnicos decorrentes do uso da plataforma.<br />
            <strong>Terminação de Conta:</strong> Podemos suspender ou encerrar sua conta em caso de violação dos Termos.<br />
            <strong>Propriedade Intelectual:</strong> O conteúdo da aplicação é protegido por direitos autorais. Não é permitido utilizá-lo sem autorização.<br />
            <strong>Limitação de Responsabilidade:</strong> Não somos responsáveis por danos indiretos ou incidentais relacionados ao uso da aplicação.<br />
            <strong>Alterações:</strong> Podemos atualizar os Termos de Uso periodicamente. O uso contínuo da aplicação após as alterações implica sua aceitação.<br />
            <strong>Lei Aplicável:</strong> Este acordo segue as leis do Brasil e qualquer disputa será resolvida no foro de São Paulo.<br />
            Para dúvidas, entre em contato: otavio.personal@hotmail.com.
          </p>
        </div>

        {/* Botão de concordar */}
        <button className="modal-termos-button" onClick={onConcordo}>
          CONCORDO
        </button>
      </div>
    </div>
  );
};

export default ModalTermos;
