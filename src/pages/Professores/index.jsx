import React from "react";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import "./Pprofs.css";
import { FaWhatsapp } from "react-icons/fa";
import banner from "../../assets/banners/banner_profs.png";

const membros = [
    { nome: "Fulano", telefone: "(11) 99999-9999", foto: "/imagens/user1.jpg" },
    { nome: "Ciclano", telefone: "(21) 98888-8888", foto: "/imagens/user2.jpg" },
    { nome: "Beltrano", telefone: "(31) 97777-7777", foto: "/imagens/user3.jpg" },
    { nome: "Maria", telefone: "(41) 96666-6666", foto: "/imagens/user4.jpg" },
    { nome: "Ana", telefone: "(51) 95555-5555", foto: "/imagens/user5.jpg" },
    { nome: "Pedro", telefone: "(61) 94444-4444", foto: "/imagens/user6.jpg" },
];

export default function Equipe() {
    return (
        <div className="equipe-container">
            <HeaderUser />

            {/* Banner principal com gradiente igual ao Sobre Nós */}
            <main className="profs-container">
                <section className="profs-section">
                    <section className="profs-banner">
                        <img src={banner} alt="Banner Saúde em Ação" />
                    </section>
                </section>
            </main>

            {/* Onda ondulada */}
            <div className="professores-wave">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path
                        fill="#D9D9D9"
                        d="M0,256L60,240C120,224,240,192,360,181.3C480,171,600,181,720,197.3C840,213,960,235,1080,229.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </div>

            {/* Lista de membros */}
            <div className="equipe-grid">
                {membros.map((m, index) => (
                    <div className="equipe-card" key={index}>
                        <div className="equipe-foto">
                            <img src={m.foto} alt={m.nome} />
                        </div>
                        <p className="equipe-nome">{m.nome}</p>
                        <p className="equipe-telefone">{m.telefone}</p>
                        <a
                            href={`https://wa.me/55${m.telefone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp"
                        >
                            <FaWhatsapp /> Conversar
                        </a>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
