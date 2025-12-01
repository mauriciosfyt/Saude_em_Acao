import React, { useState, useEffect } from 'react';
import './EditarAluno.css';
import '../../../components/Mensagem/Editado.css'; // Importando o estilo Laranja específico da edição
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getAlunoById, updateAluno, deleteAluno, API_URL } from '../../../services/usuarioService';

// Imports necessários para o Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ícones reutilizados
const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const EditarAluno = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const alunoState = location.state?.aluno;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    plano: '',
    senha: '',
    confirmarSenha: '',
    idade: '',
    sexo: '', 
    peso: '',
    altura: '',
    objetivo: '',
    nivelAtividade: ''
  });

  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemOriginal, setImagemOriginal] = useState(null);

  useEffect(() => {
    let mounted = true;

    const preencherCampos = (dados) => {
      setFormData(prev => ({
        ...prev,
        nome: dados.nome || prev.nome || '',
        email: dados.email || prev.email || '',
        cpf: dados.cpf || prev.cpf || '',
        telefone: dados.telefone || dados.numero || prev.telefone || '',
        plano: dados.plano || prev.plano || '',
        idade: dados.idade || prev.idade || '',
        sexo: dados.sexo || prev.sexo || '',
        peso: dados.peso || prev.peso || '',
        altura: dados.altura || prev.altura || '',
        objetivo: dados.objetivo || prev.objetivo || '',
        nivelAtividade: dados.nivelAtividade || prev.nivelAtividade || ''
      }));

      const foto = dados.fotoPerfil || dados.foto || dados.imagem || dados.avatar || dados.urlFoto;
      if (foto) {
        const baseServer = API_URL.replace(/\/api$/, '');
        const isAbsolute = /^https?:\/\//i.test(foto);
        const fotoUrl = isAbsolute ? foto : (foto.startsWith('/') ? `${baseServer}${foto}` : `${baseServer}/${foto}`);
        setImagemOriginal(fotoUrl);
        setImagemPreview(fotoUrl);
        setImagemFile(null);
      }
    };

    if (id) {
      (async () => {
        try {
          const aluno = await getAlunoById(id);
          if (!mounted) return;
          if (!aluno) {
            if (alunoState) preencherCampos(alunoState);
            return;
          }
          preencherCampos(aluno);
        } catch (err) {
          console.error('Falha ao obter dados do aluno:', err);
          if (alunoState) preencherCampos(alunoState);
        }
      })();
    } else if (alunoState) {
      preencherCampos(alunoState);
    } else {
      const alunoLocal = localStorage.getItem('alunoParaEditar');
      if (alunoLocal) {
        try {
          const dados = JSON.parse(alunoLocal);
          preencherCampos(dados);
        } catch (e) {
          console.warn('Aluno no localStorage inválido');
        }
      } else if (!id) {
        // Substituindo Alert por Toast
        toast.error('Dados do aluno não encontrados.');
        navigate('/GerenciarAlunos');
      }
    }

    return () => { mounted = false; };
  }, [id, alunoState, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const senha = formData.senha || '';
  const validations = {
    length: senha.length >= 6,
    upper: /[A-Z]/.test(senha),
    lower: /[a-z]/.test(senha),
    number: /[0-9]/.test(senha),
    special: /[^A-Za-z0-9]/.test(senha)
  };
  const confirmMatches = formData.confirmarSenha ? formData.confirmarSenha === senha : false;

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        // Substituindo Alert por Toast
        toast.warn(`A imagem deve ter no máximo ${maxSizeMB}MB.`);
        return;
      }
      const tiposAceitos = ['image/png', 'image/jpeg', 'image/webp'];
      if (!tiposAceitos.includes(file.type)) {
        // Substituindo Alert por Toast
        toast.warn('Por favor, selecione uma imagem válida.');
        return;
      }
      const novaPreview = URL.createObjectURL(file);
      if (imagemPreview && imagemPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreview);
      }
      setImagemFile(file);
      setImagemPreview(novaPreview);
    }
  };

  const handleCancelar = () => {
    navigate('/GerenciarAlunos');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.cpf || !formData.telefone || !formData.plano) {
      // Substituindo Alert por Toast
      toast.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.plano === 'GOLD') {
      // Removida validação de !formData.sexo pois não é mais editável
      if (!formData.idade || !formData.peso || !formData.altura || !formData.objetivo || !formData.nivelAtividade) {
        // Substituindo Alert por Toast
        toast.warn('Para o plano GOLD, os campos: idade, peso, altura, objetivo e nível de atividade são obrigatórios.');
        return;
      }
    }

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      // Substituindo Alert por Toast
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      setIsSubmitting(true);
      const dados = new FormData();
      dados.append('nome', formData.nome);
      dados.append('email', formData.email);
      dados.append('cpf', formData.cpf);
      dados.append('telefone', formData.telefone);
      dados.append('plano', formData.plano);
      
      if (formData.senha) dados.append('senha', formData.senha);

      if (formData.plano === 'GOLD') {
        dados.append('idade', formData.idade);
        // Removido o append do sexo para não enviar para a API
        dados.append('peso', formData.peso);
        dados.append('altura', formData.altura);
        dados.append('objetivo', formData.objetivo);
        dados.append('nivelAtividade', formData.nivelAtividade);
      }

      if (imagemFile) {
        dados.append('fotoPerfil', imagemFile);
      }

      const alvoId = id || (JSON.parse(localStorage.getItem('alunoParaEditar') || '{}').id);
      if (!alvoId) throw new Error('ID do aluno não encontrado para atualização.');

      await updateAluno(alvoId, dados);

      // Implementação Toastly para Sucesso na Edição (Laranja)
      toast.success('Atualizado com sucesso.', {
        className: 'custom-edit-toast', // Classe personalizada laranja
        progressClassName: 'custom-edit-progress-bar', // Barra de progresso laranja
        autoClose: 2000,
      });

      // Timeout para permitir visualização do toast antes de navegar
      setTimeout(() => {
        navigate('/GerenciarAlunos');
      }, 2100);
      
    } catch (err) {
      console.error('Erro ao salvar aluno:', err);
      // Substituindo Alert por Toast
      toast.error(err?.message || 'Falha ao salvar alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="editar-aluno-container">
        <h1 className="editar-aluno-title">Editar Aluno</h1>

        <div className="editar-aluno-form-layout">
          {/* Seção da Imagem */}
          <div className="editar-aluno-image-section">
            <label htmlFor="profile-pic" className="editar-aluno-image-placeholder">
              {imagemPreview ? (
                <img src={imagemPreview} alt="Preview" className="editar-aluno-image-preview" />
              ) : (
                <PlusIcon />
              )}
            </label>
            <input 
              type="file" 
              id="profile-pic" 
              style={{ display: 'none' }} 
              onChange={handleImagemChange}
              accept="image/png, image/jpeg, image/webp"
            />
            {imagemFile && (
              <button
                type="button"
                onClick={() => {
                  setImagemFile(null);
                  setImagemPreview(imagemOriginal);
                }}
              >
                Desfazer alteração
              </button>
            )}
          </div>

          {/* Seção do Formulário */}
          <div className="editar-aluno-fields-section">
            <form onSubmit={handleSubmit}>
              <div className="editar-aluno-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>

              <div className="editar-aluno-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="editar-aluno-form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>

              <div className="editar-aluno-form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>

              {/* Seletor de Plano */}
              <div className="editar-aluno-form-group">
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
                  <div className="editar-aluno-form-group">
                    <label htmlFor="idade">Idade</label>
                    <input type="number" id="idade" name="idade" value={formData.idade} onChange={handleChange} placeholder="Ex: 25" required />
                  </div>

                  {/* Campo de Sexo removido conforme solicitado */}
                  
                  <div className="editar-aluno-form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ex: 70.5" step="0.1" required />
                  </div>

                  <div className="editar-aluno-form-group">
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

                  <div className="editar-aluno-form-group">
                    <label htmlFor="objetivo">Objetivo</label>
                    <input type="text" id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} placeholder="Ex: Hipertrofia" required />
                  </div>

                  <div className="editar-aluno-form-group">
                    <label htmlFor="nivelAtividade">Nível Atividade</label>
                    <select 
                      id="nivelAtividade" 
                      name="nivelAtividade" 
                      value={formData.nivelAtividade} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="INICIANTE">Iniciante</option>
                      <option value="INTERMEDIARIO">Intermediário</option>
                      <option value="AVANCADO">Avançado</option> 
                    </select>
                  </div>
                </>
              )}

              {/* Campos de Senha */}
              <div className="editar-aluno-form-group">
                <label htmlFor="senha">Nova Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="senha" 
                    name="senha" 
                    value={formData.senha} 
                    onChange={handleChange}
                    placeholder="Deixe em branco para manter"
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

              {formData.senha && (
                <div className="password-requirements">
                  <p className="password-hint">A senha deve conter:</p>
                  <ul>
                    <li className={`requirement ${validations.length ? 'met' : 'unmet'}`}>
                      Pelo menos 6 caracteres
                    </li>
                    <li className={`requirement ${validations.upper ? 'met' : 'unmet'}`}>
                      Pelo menos uma letra maiúscula
                    </li>
                    <li className={`requirement ${validations.lower ? 'met' : 'unmet'}`}>
                      Pelo menos uma letra minúscula
                    </li>
                    <li className={`requirement ${validations.number ? 'met' : 'unmet'}`}>
                      Pelo menos um número
                    </li>
                    <li className={`requirement ${validations.special ? 'met' : 'unmet'}`}>
                      Pelo menos um caractere especial
                    </li>
                  </ul>
                </div>
              )}

              <div className="editar-aluno-form-group">
                <label htmlFor="confirmarSenha">Confirmar</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmarSenha" 
                    name="confirmarSenha" 
                    value={formData.confirmarSenha} 
                    onChange={handleChange}
                    disabled={!formData.senha}
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

              {formData.senha && (
                <div className="password-requirements">
                  <ul>
                    <li className={`requirement ${confirmMatches ? 'met' : 'unmet'}`}>
                      Confirmação corresponde à nova senha
                    </li>
                  </ul>
                </div>
              )}

              <div className="editar-aluno-actions">
                <button 
                  type="button" 
                  className="editar-personal-cancel" 
                  onClick={handleCancelar}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="editar-personal-save"
                  disabled={isSubmitting || isDeleting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Adicionando o Container do Toast ao final do layout */}
        <ToastContainer />
      </main>
    </div>
  );
};

export default EditarAluno;