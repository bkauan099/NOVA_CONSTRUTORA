import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Usa o CSS compartilhado com Login

function CadastroLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const storedUsers = localStorage.getItem("usersMock");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user.email === email)) {
      alert("Este e-mail já está cadastrado!");
      return;
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      email,
      password, // Em produção, use hash!
      type: "cliente",
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("usersMock", JSON.stringify(updatedUsers));

    alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
    navigate("/login");
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
        <div className="login-container"> {/* Mesmo container visual do login */}
          <button
            type="button"
            className="back-arrow"
            onClick={() => navigate("/login")}
            aria-label="Voltar"
          >
            &#8592;
          </button>

          <h1 className="login-title">Cadastro</h1>

          <form onSubmit={handleRegister} className="login-form">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="Crie sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirme a senha</label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-button">
              Cadastrar
            </button>

            <p className="no-account" onClick={() => navigate("/login")}>
              Já possui cadastro?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroLogin;
