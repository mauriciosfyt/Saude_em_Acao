import React, { useState } from 'react';
import './AdicionarAluno.css'; 
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { useNavigate } from 'react-router-dom';
import { createAluno } from '../../../services/usuarioService'; 

const UserIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
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
      <path
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        fill="currentColor"
      />
    ) : (
      <path
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        fill="currentColor"
      />
    )}
  </svg>
);

const AdicionarAluno = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    plano: '',
    senha: '',
    confirmarSenha: '',
    idade: '',
    sexo: '', // Novo campo adicionado ao estado
    peso: '',
    altura: '', 
    objetivo: '',
    nivelAtividade: '', 
  });

  const [imagemArquivo, setImagemArquivo] = useState(null); 
  const [imagemPreview, setImagemPreview] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemArquivo(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelar = () => {
    navigate('/GerenciarAlunos'); 
  };

  const senha = formData.senha || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.cpf || !formData.telefone || !formData.plano || !formData.senha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!imagemArquivo) {
      alert('A foto de perfil é obrigatória.');
      return;
    }

    const planoExigeDadosExtras = formData.plano === 'GOLD';
    
    if (planoExigeDadosExtras) {
      // Adicionada validação para o campo sexo
      if (!formData.idade || !formData.sexo || !formData.peso || !formData.altura || !formData.objetivo || !formData.nivelAtividade) {
        alert('Para o plano GOLD, os campos: idade, sexo, peso, altura, objetivo e nível de atividade são obrigatórios.');
        return;
      }
    }

    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    
    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const dadosFormulario = new FormData();
    dadosFormulario.append('nome', formData.nome);
    dadosFormulario.append('email', formData.email);
    dadosFormulario.append('cpf', formData.cpf);
    dadosFormulario.append('telefone', formData.telefone);
    dadosFormulario.append('plano', formData.plano);
    dadosFormulario.append('senha', formData.senha);
    dadosFormulario.append('fotoPerfil', imagemArquivo); 

    if (planoExigeDadosExtras) {
      dadosFormulario.append('idade', formData.idade);
      dadosFormulario.append('sexo', formData.sexo); // Adicionado ao FormData
      dadosFormulario.append('peso', formData.peso);
      dadosFormulario.append('altura', formData.altura); 
      dadosFormulario.append('objetivo', formData.objetivo);
      dadosFormulario.append('nivelAtividade', formData.nivelAtividade);
    }

    try {
      await createAluno(dadosFormulario);
      alert('Aluno criado com sucesso!');
      localStorage.setItem('showAlunoAdicionado', 'true');
      navigate('/GerenciarAlunos'); 

    } catch (error) {
      console.error('Erro ao criar o aluno:', error);
      alert(`Falha ao criar aluno: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />
      <main className="adicionar-aluno-container">
        <h1 className="aluno-main-title">Adicionar Novo Aluno</h1>
        <div className="aluno-form-layout">
          {/* Lado Esquerdo: Upload de Imagem */}
          <div className="aluno-image-upload-section">
            <label htmlFor="profile-pic" className="aluno-image-placeholder">
              {imagemPreview ? (
                <img src={imagemPreview} alt="Preview" className="aluno-image-preview" />
              ) : (
                <UserIcon /> 
              )}
            </label>
            <input 
              type="file" 
              id="profile-pic" 
              style={{ display: 'none' }} 
              onChange={handleImagemChange}
              accept="image/png, image/jpeg, image/webp"
            />
          </div>

          {/* Lado Direito: Formulário de Dados */}
          <div className="aluno-form-fields-section">
            <form onSubmit={handleSubmit}>
              
              <div className="aluno-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>

              {/* Campo Plano */}
              <div className="aluno-form-group">
                <label htmlFor="plano">Plano</label>
                <select 
                  id="plano" 
                  name="plano" 
                  value={formData.plano} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>Selecione um plano</option>
                  <option value="BASICO">Básico</option>
                  <option value="ESSENCIAL">Essencial</option>
                  <option value="GOLD">Gold</option>
                </select>
              </div>

              {/* Campos Condicionais (Plano GOLD) */}
              {(formData.plano === 'GOLD') && (
                <>
                  <div className="aluno-form-group">
                    <label htmlFor="idade">Idade</label>
                    <input type="number" id="idade" name="idade" value={formData.idade} onChange={handleChange} placeholder="Ex: 25" required />
                  </div>

                  {/* --- NOVO CAMPO: SEXO --- */}
                  <div className="aluno-form-group">
                    <label htmlFor="sexo">Sexo</label>
                    <select 
                      id="sexo" 
                      name="sexo" 
                      value={formData.sexo} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                    </select>
                  </div>
                  {/* --- FIM DO NOVO CAMPO --- */}
                  
                  <div className="aluno-form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ex: 70.5" step="0.1" required />
                  </div>

                  <div className="aluno-form-group">
                    <label htmlFor="altura">Altura (cm)</label>
                    <input 
                      type="number" 
                      id="altura" 
                      name="altura" 
                      value={formData.altura} 
                      onChange={handleChange} 
                      placeholder="Ex: 175" 
                      step="1" 
                      required 
                    />
                  </div>

                  <div className="aluno-form-group">
                    <label htmlFor="objetivo">Objetivo</label>
                    <input type="text" id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} placeholder="Ex: Hipertrofia" required />
                  </div>

                  <div className="aluno-form-group">
                    <label htmlFor="nivelAtividade">Nível Atividade</label>
                    <select 
                      id="nivelAtividade" 
                      name="nivelAtividade" 
                      value={formData.nivelAtividade} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="" disabled>Selecione um nível</option>
                      <option value="INICIANTE">Iniciante</option>
                      <option value="INTERMEDIARIO">Intermediário</option>
                      <option value="AVANCADO">Avançado</option> 
                    </select>
                  </div>
                </>
              )}
              {/* --- FIM DOS CAMPOS CONDICIONAIS --- */}

              <div className="aluno-form-group">
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

              <div className="aluno-form-group">
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

              <div className="aluno-action-buttons">
                <button type="button" className="button-cancelar-aluno" onClick={handleCancelar}>
                  cancelar
                </button>
                <button type="submit" className="button-salvar-aluno">
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

export default AdicionarAluno;