const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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

// Configuração do Swagger JSDoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      version: '1.0.0',
      description: 'API para gerenciar usuários com nome, rg e email.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./server.js'], // Especifique o caminho para o arquivo com as rotas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Defina suas rotas CRUD e documente-as com Swagger

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Erro ao criar o usuário.
 */
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = new User(req.body);
    await usuario.save();
    res.status(201).send(usuario);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários.
 *     tags:
 *       - Usuários
 *     responses:
 *       200:
 *         description: Lista de usuários recuperada com sucesso.
 *       500:
 *         description: Erro ao listar os usuários.
 */
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(200).send(usuarios);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário existente por ID.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao atualizar o usuário.
 */
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

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário por ID.
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário excluído com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao excluir o usuário.
 */
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
