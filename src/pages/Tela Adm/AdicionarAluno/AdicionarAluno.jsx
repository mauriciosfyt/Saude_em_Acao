import React, { useState } from 'react';
import './AdicionarAluno.css'; // Importando o novo CSS exclusivo
import MenuAdm from '../../../components/MenuAdm/MenuAdm';

// Ícone de usuário para o placeholder da imagem
const UserIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
  </svg>
);

const AdicionarAluno = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    plano: '', // Campo novo
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

      {/* --- ALTERAÇÃO: Classes renomeadas com prefixo 'aluno-' --- */}
      <main className="adicionar-aluno-container">
        <h1 className="aluno-main-title">Adicionar Novo Aluno</h1>

        <div className="aluno-form-layout">
          {/* Lado Esquerdo: Upload de Imagem */}
          <div className="aluno-image-upload-section">
            <div className="aluno-image-placeholder">
              <UserIcon />
              <input type="file" id="profile-pic" style={{ display: 'none' }} />
            </div>
          </div>

          {/* Lado Direito: Formulário de Dados */}
          <div className="aluno-form-fields-section">
            <form>
              <div className="aluno-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="plano">Plano</label>
                <input type="text" id="plano" name="plano" value={formData.plano} onChange={handleChange} />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />
              </div>
            </form>
          </div>
        </div>

        {/* Seção de Botões */}
        <div className="aluno-action-buttons">
          <button className="aluno-cancel-button">cancelar</button>
          <button className="aluno-save-button">Salvar</button>
        </div>
      </main>
    </div>
  );
};

export default AdicionarAluno;