import React, { useState } from 'react';
import './AdicionarPersonal.css'; // Apontando para o CSS
import MenuAdm from '../../../components/MenuAdm/MenuAdm';

// --- ADIÇÕES DE LÓGICA ---
import { useNavigate } from 'react-router-dom';
import { createProfessor } from '../../../services/usuarioService'; // Importar a função da API
// --- FIM ADIÇÕES ---

const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdicionarPersonal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });

  // --- ADIÇÕES DE LÓGICA PARA IMAGEM ---
  const [imagemArquivo, setImagemArquivo] = useState(null); // Para guardar o ARQUIVO (File)
  const [imagemPreview, setImagemPreview] = useState(null); // Para guardar a URL da pré-visualização
  // --- FIM ADIÇÕES ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // --- ADIÇÃO DE LÓGICA: Handler para a imagem ---
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemArquivo(file); // Salva o arquivo para upload
      setImagemPreview(URL.createObjectURL(file)); // Cria uma URL local para mostrar a preview
    }
  };
  // --- FIM ADIÇÃO ---

  const handleCancelar = () => {
    navigate('/GerenciarPersonal');
  };

  // --- ALTERAÇÃO NA LÓGICA: handleSubmit agora usa FormData ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações...
    if (!formData.nome || !formData.email || !formData.cpf || !formData.telefone || !formData.senha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    // ...outras validações

    // 1. Criar um objeto FormData
    // Este é o formato obrigatório para enviar arquivos
    const dadosFormulario = new FormData();
    
    // 2. Adicionar os campos de texto
    dadosFormulario.append('nome', formData.nome);
    dadosFormulario.append('email', formData.email);
    dadosFormulario.append('cpf', formData.cpf);
    dadosFormulario.append('telefone', formData.telefone);
    dadosFormulario.append('senha', formData.senha);

    // 3. Adicionar o arquivo de imagem (se existir)
    // O nome 'fotoPerfil' é um palpite; deve ser o nome que a sua API espera
    if (imagemArquivo) {
      dadosFormulario.append('fotoPerfil', imagemArquivo);
    }

    try {
      // 4. Chamar a API com o FormData
      // A função 'createProfessor' PRECISA ser atualizada (veja abaixo)
      await createProfessor(dadosFormulario);

      alert('Personal criado com sucesso!');
      localStorage.setItem('showPersonalAdicionado', 'true');
      navigate('/GerenciarPersonal');

    } catch (error) {
      console.error('Erro ao criar o personal:', error);
      alert(`Falha ao criar personal: ${error.message}`);
    }
  };
  // --- FIM ALTERAÇÃO ---

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="adicionar-personal-container">
        <h1 className="personal-main-title">Adicionar Novo Personal</h1>

        <div className="personal-form-layout">
          {/* Lado Esquerdo: Upload de Imagem */}
          <div className="personal-image-upload-section">
            
            {/* --- ALTERAÇÃO AQUI --- */}
            {/* Usamos <label> para ativar o input ao clicar */}
            <label htmlFor="profile-pic" className="personal-image-placeholder">
              {imagemPreview ? (
                // 1. Se houver preview, mostre a imagem
                <img src={imagemPreview} alt="Preview" className="personal-image-preview" />
              ) : (
                // 2. Se não, mostre o ícone
                <PlusIcon />
              )}
            </label>
            {/* O input agora é ativado pela label e chama handleImagemChange */}
            <input 
              type="file" 
              id="profile-pic" 
              style={{ display: 'none' }} 
              onChange={handleImagemChange}
              accept="image/png, image/jpeg, image/webp" // Boa prática
            />
            {/* --- FIM ALTERAÇÃO --- */}

          </div>

          {/* Lado Direito: Formulário de Dados */}
          <div className="personal-form-fields-section">
            <form onSubmit={handleSubmit}>
              {/* ... (seus campos de formulário nome, email, cpf, etc. permanecem iguais) ... */}
              <div className="personal-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="personal-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="personal-form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
              <div className="personal-form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>
              <div className="personal-form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required />
              </div>
              <div className="personal-form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />
              </div>
              
              <div className="personal-action-buttons">
                <button type="button" className="personal-cancel-button" onClick={handleCancelar}>
                  cancelar
                </button>
                <button type="submit" className="personal-save-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdicionarPersonal;