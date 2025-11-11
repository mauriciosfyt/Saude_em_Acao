import React, { useEffect } from 'react';
import './ModalPrivacidade.css';

const ModalPrivacidade = ({ onConcordo, onClose }) => {
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
        <h2 className="modal-termos-title">POLÍTICA DE PRIVACIDADE</h2>

        {/* Conteúdo da política */}
        <div className="modal-termos-content">
          <p>
            A sua privacidade é importante para nós. Esta política explica como coletamos, usamos, armazenamos e protegemos seus dados ao utilizar a plataforma da equipe Saúde em Ação.<br /><br />
            <strong>1. Coleta de dados</strong><br />
            Coletamos informações que você fornece ao criar uma conta, como nome, e-mail, telefone, CPF e dados de reserva.<br />
            Também podemos coletar dados de navegação, como IP, tipo de dispositivo e interações com a plataforma.<br /><br />
            <strong>2. Uso das informações</strong><br />
            Seus dados são utilizados para:<br />
            Fornecer e melhorar nossos serviços;<br />
            Personalizar sua experiência na plataforma;<br />
            Processar de reservas;<br />
            Enviar notificações e comunicados;<br />
            Cumprir obrigações legais.<br /><br />
            <strong>3. Compartilhamento de dados</strong><br />
            Não vendemos seus dados. Compartilhamos apenas com prestadores de serviço de tecnologia e autoridades legais, quando necessário.<br /><br />
            <strong>4. Segurança</strong><br />
            Implementamos medidas para proteger suas informações, mas o usuário também deve manter sua conta segura, evitando compartilhar sua senha.<br /><br />
            <strong>5. Armazenamento e retenção</strong><br />
            Seus dados são armazenados em servidores seguros e mantidos pelo tempo necessário para cumprir os propósitos desta política ou exigências legais.<br /><br />
            <strong>6. Direitos do usuário</strong><br />
            Você pode solicitar acesso, correção ou exclusão dos seus dados, bem como limitar ou contestar o uso deles.<br /><br />
            <strong>7. Cookies e tecnologias semelhantes</strong><br />
            Utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências no navegador.<br /><br />
            <strong>8. Alterações na política</strong><br />
            Podemos atualizar esta política de privacidade periodicamente. O uso contínuo da plataforma indica sua aceitação das mudanças.<br /><br />
            <strong>9. Contato</strong><br />
            Se você tiver dúvidas sobre esta política, entre em contato pelo e-mail: <span style={{color: "#1062fe"}}>otavio.personal@hotmail.com</span>.
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

export default ModalPrivacidade;
