//listagem de clientes 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../home.css'; 
import './clientes.css'; 

function Clientes() {
  const navigate = useNavigate();

  //estado de armazenar clientes
  const [clientes, setClientes] = useState(() => {
    const savedClientes = localStorage.getItem('clientesMock');
    return savedClientes ? JSON.parse(savedClientes) : [
      { id: 1, idCliente: 101, nome: 'Paule Eduarde Lime Rabele', cpf: '111.222.333-44', telefone: '11987654321', email: 'ana.silva@email.com' },
      { id: 2, idCliente: 102, nome: 'Carlos Roberto Costa', cpf: '555.666.777-88', telefone: '21998765432', email: 'carlos.costa@email.com' },
      { id: 3, idCliente: 103, nome: 'Mariana Lima Santos', cpf: '999.000.111-22', telefone: '31976543210', email: 'mariana.santos@email.com' },
    ];
  });

  // atualiza sempre que o estado do cleinte mudar  
  useEffect(() => {
    localStorage.setItem('clientesMock', JSON.stringify(clientes));
  }, [clientes]);

  //exclusão
  const handleExcluir = (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente(a) ${nome}?`)) {
      const novosClientes = clientes.filter(cliente => cliente.id !== id);
      setClientes(novosClientes);
      alert(`Cliente(a) ${nome} excluído(a) com sucesso!`);
    }
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS (Admin)</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home")}>Home</a>
          <a href="#" onClick={() => navigate("/funcionarios")}>Funcionários</a>
          <a href="#" onClick={() => navigate("/imoveis")}>Imóveis</a>
          <a href="#" onClick={() => navigate("/empreendimentos")}>Empreendimentos</a>
          <a href="#" onClick={() => navigate("/clientes")}>Clientes</a>
        </nav>
        <button className="logout-button" onClick={() => {navigate("/login"); }}> {/*logout */ }
          Sair
        </button>
      </header>

      <main className="admin-page-container">
        <div className="admin-header">
          <h1>Gestão de Clientes</h1>
          <button className="admin-action-button" onClick={() => navigate('/cadastrar-cliente')}>
            Adicionar Cliente
          </button>
        </div>

        {clientes.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '50px', color: '#555' }}>Nenhum cliente cadastrado.</p> //mensagenzinha se n tiver cliente cadastrado
        ) : (
          <table className="lista-tabela">
            <thead>
              <tr>
                <th>ID Cliente</th> 
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}> 
                  <td>{cliente.idCliente}</td> 
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.email}</td>
                  <td className="acoes-botoes">
                    <button className="btn-editar" onClick={() => navigate(`/editar-cliente/${cliente.id}`)}>
                      Editar
                    </button>
                    <button className="btn-excluir" onClick={() => handleExcluir(cliente.id, cliente.nome)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Clientes;