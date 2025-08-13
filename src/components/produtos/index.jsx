
import produto1 from "../../assets/IMG PRODUTO.jpg";
import produto2 from "../../assets/IMG PRODUTO2.jpg";
import produto3 from "../../assets/IMG PRODUTO3.jpg";
import './produto.css'

const ProdutosSection = () => {
  const produtos = [
    { imgSrc: produto1, nome: 'Camiseta Preta', preco: 'R$ 199,90', formaDePagamento: 'Boleto ou PIX para alunos Black, ou 6x de R$24,58' },
    { imgSrc: produto2, nome: 'Camiseta Dark Lab', preco: 'R$ 299,90', formaDePagamento: 'Boleto ou PIX para alunos Black, ou 6x de R$37,48' },
    { imgSrc: produto3, nome: 'Whey', preco: 'R$ 399,90', formaDePagamento: 'Boleto ou PIX para alunos Black, ou 6x de R$49,98' },
  ];

  return (
    <section className="products-section">
      <h2 className="section-title">Destaques da Loja</h2>
      <div className="cards-container">
        {produtos.map((produto, index) => (
          <div className="product-card" key={index}>
            <img src={produto.imgSrc} alt={produto.nome} />
            <h3>{produto.nome}</h3>
            <hr className="linha-produto" />
            <div className="preco-produto">POR {produto.preco}</div>
            <div className="pagamento-produto">{produto.formaDePagamento}</div>
            <div className="botoes-produto">
              <button className="buy-button">Adicionar ao carrinho</button>
              <button className="detalhes-button">Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProdutosSection;
