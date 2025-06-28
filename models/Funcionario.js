const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Lista todos os funcionários
router.get('/', async (req, res) => {
  try {
    const funcionarios = await db`SELECT * FROM funcionario`;
    res.json(funcionarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Cadastra um novo funcionário
router.post('/', async (req, res) => {
  const { cpf, email, nome, senha, telefone } = req.body;
  try {
    const [funcionario] = await db`
      INSERT INTO funcionario (cpf, email, nome, senha, telefone)
      VALUES (${cpf}, ${email}, ${nome}, ${senha}, ${telefone})
      RETURNING *`;
    res.status(201).json(funcionario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
