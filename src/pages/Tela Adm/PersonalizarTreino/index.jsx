import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminHeader from '../../../components/header_admin';
import Footer from '../../../components/footer';
import './personalizarTreino.css';

const PersonalizarTreino = () => {
  const [searchParams] = useSearchParams();
  const dia = searchParams.get('dia') || 'Dia';
  const alunoId = searchParams.get('alunoId') || '';

  // Mapeia os grupos por dia
  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z]/g,'');
  const diaKey = normalize(dia);
  const gruposPorDia = {
    [normalize('SEGUNDA-FEIRA')]: ['Peito', 'Tríceps'],
    [normalize('TERÇA-FEIRA')]: ['Costas', 'Bíceps'],
    [normalize('QUARTA-FEIRA')]: ['Perna'],
    [normalize('QUINTA-FEIRA')]: ['Cardio', 'Ombro'],
    [normalize('SEXTA-FEIRA')]: ['Costas', 'Abdomen'],
  };
  const grupos = gruposPorDia[diaKey] || ['Grupo'];
  const [modalAberto, setModalAberto] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const inputArquivoRef = useRef(null);
  const [previaImagem, setPreviaImagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');

  const abrirModal = (grupo) => {
    setGrupoSelecionado(grupo);
    setModalAberto(true);
  };

  const fecharModal = () => setModalAberto(false);

  const aoMudarImagem = (e) => {
    const arquivo = e.target.files && e.target.files[0];
    if (arquivo && arquivo.type.startsWith('image/')) {
      const leitor = new FileReader();
      leitor.onloadend = () => setPreviaImagem(leitor.result);
      leitor.readAsDataURL(arquivo);
      setNomeArquivo(arquivo.name);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="personalizar-container">
        <h1 className="personalizar-title">{decodeURIComponent(dia)}</h1>

        <div className="painel">
        <div className="grupos-container">
          {grupos.map((grupo) => (
            <section className="grupo-card" key={grupo}>
              <header className="grupo-header-treino">
                <div className="grupo-titulo">{grupo}</div>
                <button className="barra-add" onClick={() => abrirModal(grupo)}>+</button>
              </header>
              <div className="exercicios-lista">
                {[1,2,3].map((i) => (
                  <div className="exercicio-item" key={i}>
                    <div className="exercicio-info">
                      <div className="thumb" />
                      <div className="texto">
                        <strong>{grupo === 'Tríceps' || grupo === 'Bíceps' ? `${grupo} no pulley` : 'Supino inclinado'}</strong>
                        <div>
                          <div>Série: <b>4</b></div>
                          <div>Repetição: <b>12</b></div>
                          <div>Carga: <b>{grupo === 'Perna' ? '80kg' : '60kg'}</b></div>
                        </div>
                      </div>
                    </div>
                    <div className="acoes">
                      <button className="btn-amarelo">Editar</button>
                      <button className="btn-vermelho">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        </div>

        <div className="acoes-finais">
          <button className="btn-azul">Limpar histórico de treino</button>
          <button className="btn-verde">Salvar treino</button>
        </div>
      </div>
      <Footer />
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-titulo">Adicionar exercício</h3>
            <form className="form-exercicio" onSubmit={(e) => { e.preventDefault(); fecharModal(); }}>
              <label>
                <span>Classe do exercícios:</span>
                <select defaultValue={grupoSelecionado}>
                  {grupos.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Nome do exercício:</span>
                <input type="text" placeholder="Supino com halteres" />
              </label>

              <label>
                <span>Nº de séries:</span>
                <select defaultValue="5">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>

              <label>
                <span>Nº de repetições:</span>
                <select defaultValue="12">
                  {[6,8,10,12,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>

              <label>
                <span>Carga:</span>
                <select defaultValue="15 kg">
                  {[0,5,10,12,15,20,25,30,35,40,45,50].map(n => <option key={n} value={`${n} kg`}>{n} kg</option>)}
                </select>
              </label>

              <label>
                <span>Adicionar foto:</span>
                <div className="upload-area" onClick={() => inputArquivoRef.current && inputArquivoRef.current.click()}>
                  {previaImagem ? (
                    <img src={previaImagem} alt="Pré-visualização" className="previa-imagem-exercicio" />
                  ) : (
                    <button type="button" className="btn-plus">+</button>
                  )}
                </div>
                <input
                  type="file"
                  ref={inputArquivoRef}
                  onChange={aoMudarImagem}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {nomeArquivo && <small className="nome-arquivo">{nomeArquivo}</small>}
              </label>

              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-finalizar">Finalizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalizarTreino;


