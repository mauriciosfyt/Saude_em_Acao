import HeaderUser from "../../components/header";
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import './PerfilPersonal.css';

const PerfilPersonal = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeaderUser />

    <main className="perfil-container-personal">
  <section className="perfil-section-personal">
    <div className="perfil-header-personal">
      <img src={perfilPhoto} alt="Foto do Perfil" className="perfil-foto-personal" />
      <h2>OLÁ, NOME</h2>
      <p className="perfil-status-personal">Ativo: Personal</p>
    </div>

  </section>
</main>

 <div className="perfil-wave">
  <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
    <path
      fill="#D9D9D9"
      d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,218.7C840,235,960,245,1080,229.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    />
  </svg>
</div>


      <div className="container-dados">
        <div className="dados-box">
          <p><strong>Nome:</strong> Mauricio Da silva Ferreira</p>
          <p><strong>Email:</strong> maumau@gmail.com</p>
          <p><strong>Número:</strong> (11)9604-34797</p>
          <p><strong>Senha:</strong> XXXXXX</p>
        </div>

        <div className="actions-row-personal">
          <button className="logout-btn-personal">Desconectar</button>
          <button className="manage-btn-personal" onClick={() => navigate('/AdministrarAluno')}>Gerenciar</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilPersonal;
