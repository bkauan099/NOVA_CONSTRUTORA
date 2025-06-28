const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Listar todos os vistoriadores com nome e cpf (dados do funcionario)
router.get('/', async (req, res) => {
  try {
    const vistoriadores = await db`
      SELECT 
        v.idvistoriador,
        f.nome,
        f.cpf
      FROM vistoriador v
      JOIN funcionario f ON v.idvistoriador = f.id
    `;
    res.status(200).json(vistoriadores);
  } catch (err) {
    console.error('Erro ao listar vistoriadores:', err);
    res.status(500).json({ error: 'Erro ao listar vistoriadores.' });
  }
});

// POST: Cadastrar um novo vistoriador
router.post('/', async (req, res) => {
  const { idvistoriador } = req.body;

  if (!idvistoriador) {
    return res.status(400).json({ error: 'O campo idvistoriador é obrigatório.' });
  }

  try {
    const [novoVistoriador] = await db`
      INSERT INTO vistoriador (idvistoriador)
      VALUES (${idvistoriador})
      RETURNING *
    `;
    res.status(201).json(novoVistoriador);
  } catch (err) {
    console.error('Erro ao cadastrar vistoriador:', err);
    res.status(500).json({ error: 'Erro ao cadastrar vistoriador.' });
  }
});

// DELETE: Excluir vistoriador por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db`
      DELETE FROM vistoriador WHERE idvistoriador = ${Number(id)}
    `;
    res.status(200).json({ message: 'Vistoriador excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir vistoriador:', err);
    res.status(500).json({ error: 'Erro ao excluir vistoriador.' });
  }
});

module.exports = router;
