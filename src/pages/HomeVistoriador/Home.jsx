import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomeVistoriador({ onLogout }) {
  const navigate = useNavigate();
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/imoveis/todos');
        const data = await res.json();
        setImoveis(data);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
      }
    };

    fetchImoveis();
  }, []);

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home")}>Home</a>
          <a href="#" onClick={() => navigate("/vistoriador/realizar-vistoria")}>Realizar Vistoria</a>
        </nav>
        <button className="logout-button" onClick={onLogout}>Sair</button>
      </header>

      <main className="main-content">
        <div className="texto">
          <h1>Bem-vindo ao <br /> <span>CIVIS Vistoriador</span></h1>
          <p>Gerencie suas vistorias e crie relatórios de forma rápida, prática e eficiente.</p>
        </div>
        <div className="imagem">
          <img src="/imagens/vistoria.png" alt="Imagem Vistoria" />
        </div>
      </main>

      <section className="possible-surveys-section">
        <div className="menu-header-surveys">
          <h2>Vistorias Disponíveis</h2>
          <div className="search-bar-and-add-surveys">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Pesquisar Vistoria..." className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <div className="survey-cards-container">
          {imoveis.map((imovel) => (
            <div key={imovel.idimovel} className="survey-card">
              <img
                src={`http://localhost:3001/uploads/${imovel.anexos}`}
                alt={`Imagem do imóvel ${imovel.descricao}`}
                className="survey-image"
              />
              <h3>
                {imovel.nomeempreendimento} - Bloco {imovel.bloco}, Nº {imovel.numero}
              </h3>
              <p>
                Status: {imovel.status} <br />
                {imovel.datainiciovistoria ? `Data Agendada: ${new Date(imovel.datainiciovistoria).toLocaleDateString()}` : ''}
              </p>

              <button
                className="view-survey-button"
                onClick={() => {
                  if (imovel.idvistoria) {
                    navigate(`/vistoriador/vistoria/${imovel.idvistoria}`);
                  } else {
                    navigate(`/nova-vistoria-para-imovel/${imovel.idimovel}`);
                  }
                }}
              >
                {imovel.idvistoria ? "Ver Vistoria" : "Criar Vistoria"}
              </button>
            </div>
          ))}
        </div>

        <div className="pagination">
          <a href="#">&lt;</a>
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">4</a>
          <a href="#">&gt;</a>
        </div>
      </section>
    </div>
  );
}

export default HomeVistoriador;
