import React, { useState } from 'react';
import './AdicionarPersonal.css'; // Apontando para o CSS restaurado
import MenuAdm from '../../../components/MenuAdm/MenuAdm';

// --- ALTERAÇÃO --- Restaurado o PlusIcon para esta tela
const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdicionarPersonal = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="adicionar-personal-container">
        <h1 className="personal-main-title">Adicionar Novo Personal</h1>

        <div className="personal-form-layout">
          {/* Lado Esquerdo: Upload de Imagem */}
          <div className="personal-image-upload-section">
            <div className="personal-image-placeholder">
              {/* --- ALTERAÇÃO --- Usando o PlusIcon aqui */}
              <PlusIcon />
              <input type="file" id="profile-pic" style={{ display: 'none' }} />
            </div>
          </div>

          {/* Lado Direito: Formulário de Dados */}
          <div className="personal-form-fields-section">
            <form>
              <div className="personal-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
              </div>
              <div className="personal-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="personal-form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} />
              </div>
              <div className="personal-form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
              </div>
              <div className="personal-form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} />
              </div>
              <div className="personal-form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />
              </div>
              
            </form>
          </div>
        </div>

        {/* Seção de Botões */}
        <div className="personal-action-buttons">
          <button className="personal-cancel-button">cancelar</button>
          <button className="personal-save-button">Salvar</button>
        </div>
      </main>
    </div>
  );
};

export default AdicionarPersonal;