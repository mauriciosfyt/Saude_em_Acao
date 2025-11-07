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

// Ícone de olho para mostrar/ocultar senha
const EyeIcon = ({ visible }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: 'pointer' }}
  >
    {visible ? (
      // Ícone olho aberto
      <path
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        fill="currentColor"
      />
    ) : (
      // Ícone olho fechado (riscado)
      <path
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        fill="currentColor"
      />
    )}
  </svg>
);

const AdicionarPersonal = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Obter senha atual para validação
  const senha = formData.senha || '';

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
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="senha" 
                    name="senha" 
                    value={formData.senha} 
                    onChange={handleChange}
                    required 
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <EyeIcon visible={showPassword} />
                  </span>
                </div>
              </div>
              <div className="password-requirements">
                <p className="password-hint">A senha deve conter:</p>
                <ul>
                  <li className={`requirement ${senha.length >= 6 ? 'met' : 'unmet'}`}>
                    Pelo menos 6 caracteres
                  </li>
                  <li className={`requirement ${/[A-Z]/.test(senha) ? 'met' : 'unmet'}`}>
                    Pelo menos uma letra maiúscula
                  </li>
                  <li className={`requirement ${/[a-z]/.test(senha) ? 'met' : 'unmet'}`}>
                    Pelo menos uma letra minúscula
                  </li>
                  <li className={`requirement ${/[0-9]/.test(senha) ? 'met' : 'unmet'}`}>
                    Pelo menos um número
                  </li>
                  <li className={`requirement ${/[^A-Za-z0-9]/.test(senha) ? 'met' : 'unmet'}`}>
                    Pelo menos um caractere especial
                  </li>
                </ul>
              </div>
              <div className="personal-form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmarSenha" 
                    name="confirmarSenha" 
                    value={formData.confirmarSenha} 
                    onChange={handleChange}
                    required 
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </span>
                </div>
              </div>
              <div className="password-requirements">
                <ul>
                  <li className={`requirement ${formData.confirmarSenha && formData.senha === formData.confirmarSenha ? 'met' : 'unmet'}`}>
                    Confirmação corresponde à senha
                  </li>
                </ul>
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