
import produto1 from "../../assets/IMG PRODUTO.jpg";
import produto2 from "../../assets/IMG PRODUTO2.jpg";
import produto3 from "../../assets/IMG PRODUTO3.jpg";
import './produto.css'

const ProdutosSection = () => {
  const produtos = [
    { imgSrc: produto1, nome: 'Produto 1', preco: 'R$ 199,90' },
    { imgSrc: produto2, nome: 'Produto 2', preco: 'R$ 299,90' },
    { imgSrc: produto3, nome: 'Produto 3', preco: 'R$ 399,90' },
  ];

  return (
    <section className="products-section">
      <h2 className="section-title">Destaques da Loja</h2>
      <div className="cards-container">
        {produtos.map((produto, index) => (
          <div className="product-card" key={index}>
            <img src={produto.imgSrc} alt={produto.nome} />
            <h3>{produto.nome}</h3>
            <p>{produto.preco}</p>
            <div className="botoes-produto">
              <button className="buy-button">Comprar</button>
              <button className="detalhes-button">Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProdutosSection;
