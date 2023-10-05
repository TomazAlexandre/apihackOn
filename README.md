# apihackOn
apihackon


para criar um usuário, envie uma solicitação POST com um corpo JSON contendo nome, rg e email para http://localhost:3000/api/usuarios.

Para listar todos os usuários, faça uma solicitação GET para http://localhost:3000/api/usuarios.

Para atualizar um usuário existente, envie uma solicitação PUT para http://localhost:3000/api/usuarios/:id com o corpo JSON contendo as atualizações e o ID do usuário que você deseja atualizar.

Para excluir um usuário, envie uma solicitação DELETE para http://localhost:3000/api/usuarios/:id com o ID do usuário que você deseja excluir.