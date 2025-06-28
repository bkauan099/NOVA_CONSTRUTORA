import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css"; // usa o CSS com grid e responsividade

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const senha = e.target.elements[1].value;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro desconhecido.");
      }

      const tipo = data.tipo;
      if (tipo === "cliente") {
        localStorage.setItem("idcliente", data.id);
      }

      alert(`Login de ${tipo} realizado com sucesso!`);
      onLogin(tipo);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Área da logo */}
      <div className="login-logo-section">
        <img
          src="src/pages/Login/logo.png"
          alt="CIVIS Logo"
          className="logo-image"
        />
      </div>

      {/* Área do formulário */}
      <div className="login-content-wrapper">
        <div className="login-container">
          <button
            type="button"
            className="back-arrow"
            onClick={() => navigate("/")}
            aria-label="Voltar"
          >
            &#8592;
          </button>

          <h1 className="login-title">Login</h1>

          <form onSubmit={handleLogin} className="login-form">
            <label>Email</label>
            <input type="email" placeholder="Digite seu email" required />

            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha" required />

            <button type="submit" className="login-button">
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p
              className="no-account"
              onClick={() => navigate("/cadastro-login")}
            >
              Não possui cadastro?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
