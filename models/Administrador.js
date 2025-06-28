const express = require('express');
const router = express.Router();
const db = require('../db');  // Conexão usando postgres.js

// GET: Listar todos os administradores
router.get('/', async (req, res) => {
  try {
    const administradores = await db`
      SELECT * FROM administrador
    `;
    res.status(200).json(administradores);
  } catch (err) {
    console.error('Erro ao listar administradores:', err);
    res.status(500).json({ error: 'Erro ao listar administradores.' });
  }
});

// POST: Criar novo administrador
router.post('/', async (req, res) => {
  const { cpf, email, nome, senha, telefone } = req.body;

  if (!cpf || !email || !nome || !senha || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [administrador] = await db`
      INSERT INTO administrador (cpf, email, nome, senha, telefone)
      VALUES (${cpf}, ${email}, ${nome}, ${senha}, ${telefone})
      RETURNING *
    `;
    res.status(201).json(administrador);
  } catch (err) {
    console.error('Erro ao cadastrar administrador:', err);
    res.status(500).json({ error: 'Erro ao cadastrar administrador.' });
  }
});

module.exports = router;




