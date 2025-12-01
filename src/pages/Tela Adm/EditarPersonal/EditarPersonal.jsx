import React, { useState, useEffect } from 'react';
import './EditarPersonal.css';
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfessorById, API_URL, updateProfessor, deleteProfessor } from '../../../services/usuarioService';

// --- REACT TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import '../../../components/Mensagem/Editado.css'
// --- FIM REACT TOASTIFY ---

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

const EditarPersonal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });

  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemOriginal, setImagemOriginal] = useState(null); // URL original do servidor
  const [isSubmitting, setIsSubmitting] = useState(false);
  // validation state is derived from formData.senha, we compute on render

  // --- NOVO: buscar dados do personal ao montar e popular campos ---
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchProfessor = async () => {
      try {
        const professor = await getProfessorById(id);
        if (!mounted || !professor) return;

        // Popular campos (ajuste conforme o formato retornado pela API)
        setFormData(prev => ({
          ...prev,
          nome: professor.nome || professor.nomeCompleto || prev.nome || '',
          email: professor.email || prev.email || '',
          cpf: professor.cpf || professor.cpfProfessor || prev.cpf || '',
          telefone: professor.telefone || professor.telefoneContato || prev.telefone || ''
          // senha e confirmarSenha permanecem vazios por segurança
        }));

        // Popular preview da imagem (campo pode variar: fotoPerfil, foto, imagem, avatar)
        const foto = professor.fotoPerfil || professor.foto || professor.imagem || professor.avatar || professor.urlFoto;
        if (foto) {
          // Se retornar URL absoluta, usa direto.
          // Se retornar caminho relativo (ex: /uploads/xyz.jpg ou uploads/xyz.jpg), prefixa com a base do servidor (sem /api).
          const baseServer = API_URL.replace(/\/api$/, ''); // ex: http://54.81.240.117
          const isAbsolute = /^https?:\/\//i.test(foto);
          const fotoUrl = isAbsolute ? foto : (foto.startsWith('/') ? `${baseServer}${foto}` : `${baseServer}/${foto}`);
          setImagemOriginal(fotoUrl); // Salva URL original
          setImagemPreview(fotoUrl); // Mostra preview inicial
          setImagemFile(null); // Limpa o arquivo selecionado
        }
      } catch (err) {
        console.error('Falha ao obter dados do personal:', err);
        // Não interrompe a tela; campos permanecem como estão
      }
    };

    fetchProfessor();
    return () => { mounted = false; };
  }, [id]);
  // --- FIM NOVO ---
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // senha validation helpers
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
      // Validação de tamanho (máx 5MB)
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      if (file.size > maxSizeBytes) {
        toast.warning(`A imagem deve ter no máximo ${maxSizeMB}MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }

      // Validação de tipo
      const tiposAceitos = ['image/png', 'image/jpeg', 'image/webp'];
      if (!tiposAceitos.includes(file.type)) {
        toast.warning('Por favor, selecione uma imagem válida (PNG, JPEG ou WebP)');
        return;
      }

      console.log('📸 Imagem selecionada:', file.name, 'Tipo:', file.type, 'Tamanho:', (file.size / 1024).toFixed(2) + 'KB');
      
      // Criar nova URL local para preview
      const novaPreview = URL.createObjectURL(file);
      console.log('🖼️ Preview URL criada:', novaPreview);
      
      // Limpar URL anterior se for local
      if (imagemPreview && imagemPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreview);
        console.log('🗑️ URL anterior limpa');
      }
      
      // Atualizar estado
      setImagemFile(file);
      setImagemPreview(novaPreview);
      
      console.log('✅ Nova imagem pronta para envio');
    } else {
      console.warn('⚠️ Nenhum arquivo selecionado');
    }
  };

  const handleCancelar = () => {
    navigate('/GerenciarPersonal');
  };

  const handleExcluir = async () => {
    try {
      setIsDeleting(true);
      await deleteProfessor(id);
      
      // Sucesso na exclusão (Mantive verde pois é uma ação conclusiva de sucesso)
      toast.success('Excluído com sucesso!', {
        className: 'custom-success-toast', // Reutilizando a classe verde definida no Sucesso.css
        progressClassName: 'Toastify__progress-bar--success',
        autoClose: 2000,
      });

      // Aguarda o toast antes de navegar
      setTimeout(() => {
        navigate('/GerenciarPersonal');
      }, 2200);

    } catch (err) {
      console.error('Erro ao excluir professor:', err);
      const msg = err?.message || 'Falha ao excluir professor.';
      toast.error(msg);
      setIsDeleting(false); // Só volta o estado se der erro, se der sucesso navega
    } finally {
      // setShowDeleteModal(false); // Isso pode causar erro se o componente desmontar na navegação, mas ok
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação simples de senha (se preenchida)
    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      setIsSubmitting(true);

      const dados = new FormData();
      dados.append('nome', formData.nome || '');
      dados.append('email', formData.email || '');
      // CPF normalmente é a chave do recurso (já está no URL), mas incluímos também caso a API espere
      dados.append('cpf', formData.cpf || '');
      dados.append('telefone', formData.telefone || '');
      if (formData.senha) {
        dados.append('senha', formData.senha);
      }
      
      // Anexa imagem se houver
      if (imagemFile) {
        console.log('✅ Imagem será enviada:', imagemFile.name, imagemFile.type);
        dados.append('fotoPerfil', imagemFile); // Usar 'fotoPerfil' consistente com criar
      } else {
        console.warn('⚠️ Nenhuma imagem para enviar');
      }

      console.log('📤 Enviando dados do personal para API...');
      // Chama a função do serviço que envia o PUT multipart/form-data
      await updateProfessor(id, dados);

      // Sucesso na Edição - COR LARANJA
      toast.success('Atualizado com sucesso.', {
        className: 'custom-edit-toast',          // Classe Laranja definida no CSS
        progressClassName: 'custom-edit-progress-bar', // Barra Laranja
        autoClose: 2000,
      });

      // Aguarda o toast antes de navegar
      setTimeout(() => {
        navigate('/GerenciarPersonal');
      }, 2200);

    } catch (err) {
      console.error('Erro ao salvar personal:', err);
      const msg = err?.message || 'Falha ao salvar alterações.';
      toast.error(msg);
      setIsSubmitting(false); // Habilita o botão novamente em caso de erro
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />

      <main className="editar-personal-container">
        <h1 className="editar-personal-title">Editar Personal</h1>

        <div className="editar-personal-form-layout">
          <div className="editar-personal-image-section">
            <label htmlFor="profile-pic" className="editar-personal-image-placeholder">
              {imagemPreview ? (
                <img src={imagemPreview} alt="Preview" className="editar-personal-image-preview" />
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
                  console.log('🔄 Imagem resetada para original');
                }}
              >
                Desfazer alteração
              </button>
            )}
          </div>

          <div className="editar-personal-fields-section">
            <form onSubmit={handleSubmit}>
              <div className="editar-personal-form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="editar-personal-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="editar-personal-form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
              <div className="editar-personal-form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>
              <div className="editar-personal-form-group">
                <label htmlFor="senha">Nova Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="senha" 
                    name="senha" 
                    value={formData.senha} 
                    onChange={handleChange}
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
              <div className="editar-personal-form-group">
                <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmarSenha" 
                    name="confirmarSenha" 
                    value={formData.confirmarSenha} 
                    onChange={handleChange}
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
                  <li className={`requirement ${confirmMatches ? 'met' : 'unmet'}`}>
                    Confirmação corresponde à nova senha
                  </li>
                </ul>
              </div>
              
              <div className="editar-personal-actions">
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
        
        {/* Container para renderizar os toasts */}
        <ToastContainer />
      </main>
    </div>
  );
};

export default EditarPersonal;