const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/api_example', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB: ' + err);
  });

const User = mongoose.model('User', {
  nome: String,
  rg: String,
  email: String,
});

// Rotas para CRUD

// Create (Cadastrar usuário)
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = new User(req.body);
    await usuario.save();
    res.status(201).send(usuario);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read (Listar todos os usuários)
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(200).send(usuarios);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update (Atualizar usuário por ID)
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado.');
    }
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete (Excluir usuário por ID)
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado.');
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
