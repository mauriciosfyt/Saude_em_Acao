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
    peso: '',
    altura: '', // (Este será enviado como inteiro, ex: 175)
    objetivo: '',
    nivelAtividade: '', // (Este usará INICIANTE, INTERMEDIARIO, AVANCADO)
  });

  const [imagemArquivo, setImagemArquivo] = useState(null); 
  const [imagemPreview, setImagemPreview] = useState(null); 

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
      if (!formData.idade || !formData.peso || !formData.altura || !formData.objetivo || !formData.nivelAtividade) {
        alert('Para o plano GOLD, os campos: idade, peso, altura, objetivo e nível de atividade são obrigatórios.');
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
      dadosFormulario.append('peso', formData.peso);
      dadosFormulario.append('altura', formData.altura); 
      dadosFormulario.append('objetivo', formData.objetivo);
      // 'nivelAtividade' agora enviará INICIANTE, INTERMEDIARIO, ou AVANCADO
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

              {/* Campo Plano (Correto) */}
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
                  
                  <div className="aluno-form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ex: 70.5" step="0.1" required />
                  </div>

                  {/* Campo Altura (Corrigido para CM) */}
                  <div className="aluno-form-group">
                    <label htmlFor="altura">Altura (cm)</label>
                    <input 
                      type="number" 
                      id="altura" 
                      name="altura" 
                      value={formData.altura} 
                      onChange={handleChange} 
                      placeholder="Ex: 175" 
                      step="1" // Força número inteiro
                      required 
                    />
                  </div>

                  <div className="aluno-form-group">
                    <label htmlFor="objetivo">Objetivo</label>
                    <input type="text" id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} placeholder="Ex: Hipertrofia" required />
                  </div>

                  {/* --- CORREÇÃO AQUI (Nível Atividade) --- */}
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
                      {/* Valores (value="...") atualizados para o que a API Java 
                        provavelmente espera (maiúsculas, com base no seu feedback).
                      */}
                      <option value="INICIANTE">Iniciante</option>
                      <option value="INTERMEDIARIO">Intermediário</option>
                      <option value="AVANCADO">Avançado</option> 
                      {/* (Assumi "AVANCADO" para "avançado") */}
                    </select>
                  </div>
                  {/* --- FIM DA CORREÇÃO --- */}
                </>
              )}
              {/* --- FIM DOS CAMPOS CONDICIONAIS --- */}

              <div className="aluno-form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required />
              </div>
              <div className="aluno-form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />
              </div>

              {/* Seção de Botões */}
              <div className="aluno-action-buttons">
                <button type="button" className="aluno-cancel-button" onClick={handleCancelar}>
                  cancelar
                </button>
                <button type="submit" className="aluno-save-button">
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