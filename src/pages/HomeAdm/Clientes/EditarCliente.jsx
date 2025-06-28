import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../home.css'; 
import './clientes.css'; 


//essa função é para editar o cliente, ela pega o id do cliente que foi clicado na listagem e preenche o formulario com os dados dele
function EditarCliente() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idCliente: '', // idCliente será exibido, mas não editável
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });

  useEffect(() => {
    const storedClientes = localStorage.getItem('clientesMock');
    const clientes = storedClientes ? JSON.parse(storedClientes) : [];
    
    //busca o cliente pelo id interno
    const clienteEncontrado = clientes.find(cliente => cliente.id === parseInt(id));

    if (clienteEncontrado) {
      // Preenchimento dos dados no formulario, garantindo que sejam strings
      const sanitizedData = {
        idCliente: clienteEncontrado.idCliente || '',
        nome: clienteEncontrado.nome || '',
        cpf: clienteEncontrado.cpf || '',
        telefone: clienteEncontrado.telefone || '',
        email: clienteEncontrado.email || '',
      };
      setFormData(sanitizedData);
    } else {
      alert('Cliente não encontrado!');
      navigate('/clientes');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const storedClientes = localStorage.getItem('clientesMock');
    let clientes = storedClientes ? JSON.parse(storedClientes) : [];

    const updatedClientes = clientes.map(cliente =>
      cliente.id === parseInt(id) ? { 
        ...formData, 
        id: parseInt(id), //mantem o id do cliente original (id interno do localStorage)
        // NÃO ALTERA O idCliente do cliente, usa o idCliente ORIGINAL do cliente encontrado
        // Isso garante que mesmo que o campo readOnly seja manipulado, o ID não será atualizado.
        idCliente: cliente.idCliente // Garante que o idCliente permanece o original
      } : cliente
    );
    localStorage.setItem('clientesMock', JSON.stringify(updatedClientes));

    alert('Cliente atualizado com sucesso!');
    navigate('/clientes');
  };

  const handleDelete = () => {
    if (window.confirm(`ATENÇÃO: Tem certeza que deseja EXCLUIR o cliente(a) "${formData.nome}" permanentemente? Esta ação não pode ser desfeita.`)) {
      const confirmacaoFinal = prompt("Para confirmar a exclusão, digite 'EXCLUIR' no campo abaixo:");
      if (confirmacaoFinal === "EXCLUIR") {
        const storedClientes = localStorage.getItem('clientesMock');
        let clientes = storedClientes ? JSON.parse(storedClientes) : [];

        const updatedClientes = clientes.filter(cliente => cliente.id !== parseInt(id));
        localStorage.setItem('clientesMock', JSON.stringify(updatedClientes));

        alert(`Cliente(a) "${formData.nome}" excluído(a) com sucesso!`);
        navigate('/clientes');
      } else {
        alert("Exclusão cancelada ou confirmação incorreta.");
      }
    }
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS (Admin)</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home")}>Home</a>
          <a href="#" onClick={() => navigate("/clientes")}>Clientes</a>
        </nav>
        <button className="logout-button" onClick={() => {navigate("/login"); }}> {/*logout */ }
          Sair
        </button>
      </header>

      <main className="admin-page-container">
        <button className="back-arrow" onClick={() => navigate('/clientes')} style={{ marginBottom: '20px' }}>
          &#8592; Voltar
        </button>
        <h1 style={{ marginBottom: '30px', color: '#004080' }}>Editar Cliente: {formData.nome}</h1>

        <form onSubmit={handleUpdate} className="form-container">
          <div className="form-group">
            <label htmlFor="idCliente">ID Cliente:</label>
            <input type="number" id="idCliente" name="idCliente" value={formData.idCliente} onChange={handleChange} readOnly /> {/* Adicionado readOnly */}
          </div>
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
              Atualizar Cliente
            </button>
            <button type="button" className="btn-excluir-form" onClick={handleDelete}>
              Excluir Cliente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditarCliente;