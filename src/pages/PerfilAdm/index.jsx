import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import perfilPhoto from "../../assets/icones/icone Perfil 100x100.png";
import './PerfilAdm.css';

const PerfilAdm = () => {
  return (
    <div>
      <HeaderUser />

    <main className="perfil-container">
  <section className="perfil-section">
    <div className="perfil-header">
      <img src={perfilPhoto} alt="Foto do Perfil" className="perfil-foto" />
      <h2>OLÁ, NOME</h2>
      <p className="perfil-status">Ativo: Administrador</p>
    </div>

    <div className="perfil-dados">
      {/* Card 1 - Produtos */}
      <div className="card-produtos">
        <p className="produtos-reservados-label">Produtos Reservados:</p>
        <p className="produtos-reservados-valor"><strong>100</strong></p>
        <hr className="divisor-produtos" />
        <p className="produtos-ativos-label">Produtos Ativos:</p>
        <p className="produtos-ativos-valor"><strong>150</strong></p>
      </div>

      {/* Card 2 - Vendas */}
      <div className="card-vendas">
        <p className="vendas-totais-label">Total Vendido:</p>
        <p className="vendas-totais-valor"><strong>R$99.999,99</strong></p>
        <hr className="divisor-vendas" />
        <p className="pagamento-pendente-label">Aguardando Pagamento:</p>
        <p className="pagamento-pendente-valor"><strong>100</strong></p>
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

        <div className="actions-row">
          <button className="logout-btn">Desconectar</button>
          <button className="manage-btn">Gerenciar</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilAdm;
