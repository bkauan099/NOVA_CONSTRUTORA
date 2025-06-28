import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../home.css';
import './clientes.css';

function CadastrarCliente() {
  const navigate = useNavigate();

  // Removido idCliente da inicialização, pois será gerado automaticamente
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedClientes = localStorage.getItem('clientesMock');
    const clientes = storedClientes ? JSON.parse(storedClientes) : [];

    // Gerar novo ID interno (id) e ID de Cliente (idCliente) automaticamente
    const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
    const newIdCliente = clientes.length > 0 ? Math.max(...clientes.map(c => c.idCliente)) + 1 : 101; // Gera idCliente sequencial, começando de 101 ou do maior existente

    const novoCliente = {
      ...formData,
      id: newId,          // ID interno para o localStorage
      idCliente: newIdCliente // idCliente gerado automaticamente
    };

    const updatedClientes = [...clientes, novoCliente];
    localStorage.setItem('clientesMock', JSON.stringify(updatedClientes));

    alert(`Cliente cadastrado com sucesso! ID do Cliente: ${newIdCliente}`);
    navigate('/clientes'); // Volta para a listagem
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS (Admin)</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home")}>Home</a>
          <a href="#" onClick={() => navigate("/clientes")}>Clientes</a>
        </nav>
        <button className="logout-button" onClick={() => { navigate("/login"); }}>
          Sair
        </button>
      </header>

      <main className="admin-page-container">
        <button className="back-arrow" onClick={() => navigate('/clientes')} style={{ marginBottom: '20px' }}>
          &#8592; Voltar
        </button>
        <h1 style={{ marginBottom: '30px', color: '#004080' }}>Cadastrar Novo Cliente</h1>

        <form onSubmit={handleSubmit} className="form-container">
          {/* O campo ID Cliente foi removido do formulário, pois será gerado automaticamente */}
          {/* Você pode mostrar o ID gerado automaticamente na mensagem de sucesso, se quiser. */}
          
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={() => navigate('/clientes')}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Cliente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CadastrarCliente;