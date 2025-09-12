import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import './Perfil.css';

const Perfil = () => {
  return (
    <div>
      <HeaderUser />

      <main className="perfil-container">
        <section className="perfil-section">
          <div className="perfil-header">
         <img src={perfilPhoto} alt="Foto do Perfil" className="perfil-icon" />
            <h2>OLÁ, NOME</h2>
            <p className="perfil-desc">
              Estudando resolver cenários e aprendendo com os erros
            </p>
          </div>

          <div className="perfil-cards">
            <div className="card-info desempenho-card">
              <div className="card-header">
                <span className="icon-desempenho">📊</span>
                <h4>Meu Desempenho</h4>
              </div>
              <div className="desempenho-info">
                <p className="treinos-feitos"><strong>2/6</strong></p>
                <p className="info-label">Treinos Feitos na Semana</p>
                <hr className="linha-divisoria" />
                <p className="ultimo-treino"><strong>30/06</strong></p>
                <p className="info-label">Último Treino</p>
              </div>
            </div>

            <div className="card-info">
              <h3>Plano Black</h3>
              <ul>
                <li>Academia</li>
                <li>Aulas</li>
                <li>Nutricionista</li>
                <li>Psicólogo</li>
              </ul>
            </div>
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

        <button className="logout-btn">Desconectar</button>
      </div>

      <Footer />
    </div>
  );
};

export default Perfil;
