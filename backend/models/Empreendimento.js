const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Criar novo empreendimento
router.post('/', async (req, res) => {
  const {
    nome,
    descricao,
    construtora,
    observacoes,
    estado,
    cidade,
    cep,
    rua
  } = req.body;

  try {
    const [empreendimento] = await db`
      INSERT INTO empreendimento
        (nome, descricao, construtora, observacoes, estado, cidade, cep, rua)
      VALUES
        (${nome}, ${descricao}, ${construtora}, ${observacoes}, ${estado}, ${cidade}, ${cep}, ${rua})
      RETURNING *
    `;
    res.status(201).json(empreendimento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Listar empreendimentos
router.get('/', async (req, res) => {
  try {
    const empreendimentos = await db`SELECT * FROM empreendimento`;
    res.status(200).json(empreendimentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Excluir por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db`DELETE FROM empreendimento WHERE idempreendimento = ${id}`;
    res.status(200).json({ message: 'Empreendimento excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Buscar um empreendimento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [empreendimento] = await db`
      SELECT * FROM empreendimento WHERE idempreendimento = ${Number(id)}
    `;

    if (!empreendimento) {
      return res.status(404).json({ error: 'Empreendimento não encontrado.' });
    }

    res.status(200).json(empreendimento);
  } catch (error) {
    console.error('Erro ao buscar empreendimento por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar empreendimento.' });
  }
});

module.exports = router;
