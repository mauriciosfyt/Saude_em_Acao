import React, { useState, useEffect } from 'react';
import './EditarPersonal.css';
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfessorById, API_URL } from '../../../services/usuarioService'; // <-- adicionado API_URL

const PlusIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditarPersonal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });

  const [imagemPreview, setImagemPreview] = useState(null);

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
          const baseServer = API_URL.replace(/\/api$/, ''); // ex: http://34.205.11.57
          const isAbsolute = /^https?:\/\//i.test(foto);
          const fotoUrl = isAbsolute ? foto : (foto.startsWith('/') ? `${baseServer}${foto}` : `${baseServer}/${foto}`);
          setImagemPreview(fotoUrl);
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

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelar = () => {
    navigate('/GerenciarPersonal');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    console.log('ID do personal:', id);
    navigate('/GerenciarPersonal');
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
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} />
              </div>
              <div className="editar-personal-form-group">
                <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />
              </div>
              
              <div className="editar-personal-actions">
                <button type="button" className="editar-personal-cancel" onClick={handleCancelar}>
                  Cancelar
                </button>
                <button type="submit" className="editar-personal-save">
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

export default EditarPersonal;