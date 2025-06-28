import { useNavigate } from "react-router-dom"; 
import "./Home.css";

function Home({ onLogout }) {
  const navigate = useNavigate(); 

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">CIVIS</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home")}>Home</a>
          <a href="#" onClick={() => navigate("/nova-vistoria")}>Nova Vistoria</a>
          <a href="#" onClick={() => navigate("/vistorias-agendadas")}>Vistorias Agendadas</a>
          <a href="#" onClick={() => navigate("/clientes")}>Clientes</a>
          <a href="#" onClick={() => navigate("/empreendimentos")}>Empreendimentos</a>
          <a href="#" onClick={() => navigate("/funcionarios")}>Funcionários</a>
        </nav>
        <button className="logout-button" onClick={onLogout}>
          Sair
        </button>
      </header>

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="texto">
          <h1>
            Sistema de <br /> <span>Gestão de Vistorias</span>
          </h1>
          <p>
            Gerencie, acompanhe e realize vistorias de forma rápida, prática e
            eficiente com o <strong>CIVIS</strong>.
          </p>

        </div>

        <div className="imagem">
          <img src="/imagens/vistoria.png" alt="Imagem Vistoria" />
        </div>
      </main>

      {/* Seção de Atalhos */}
      <section className="atalhos">
        <h2>Gerenciamento Rápido</h2>
        <div className="atalhos-cards" >
          <div className="card" onClick={() => navigate("/nova-vistoria")}>
            <img src="/assets/nova.png" alt="Nova Vistoria" />
            <h3>Nova Vistoria</h3>
          </div>
          <div className="card" onClick={() => navigate("/vistorias-agendadas")}>
            <img src="/assets/agendada.png" alt="Agendadas" />
            <h3>Vistorias Agendadas</h3>
          </div>
            <div className="card" onClick={() => navigate("/clientes")}>
            <img src="/assets/cliente.png" alt="Clientes" />
            <h3>Clientes</h3>
          </div>
          <div className="card" onClick={() => navigate("/empreendimentos")}>
            <img src="/assets/empreendimentos.png" alt="Empreendimentos" />
            <h3>Empreendimentos</h3>
          </div>
          <div className="card" onClick={() => navigate("/funcionarios")}>
            <img src="/assets/funcionario.jpg" alt="Funcionário" />
            <h3>Funcionário</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;  


