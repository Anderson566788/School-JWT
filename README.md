# 📚 Sistema de Gerenciamento Escolar (Node.js + MySQL)

Este é um sistema completo de gerenciamento escolar construído com **Node.js**, **Express**, **MySQL** e **JWT**. Ele permite o registro e login de usuários, criação de matérias por professores e admins, matrícula de alunos em matérias, e visualização de dados com controle de acesso por `roles` (`admin`, `professor`, `aluno`).

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- JWT (Json Web Token)
- Bcrypt
- Dotenv

---

## 📁 Estrutura do Projeto
```
.
├── config/
│   └── database.js              # Configuração da conexão com o banco de dados MySQL
│
├── controllers/                 # Controladores responsáveis pela lógica de negócio
│   ├── enrollmentController.js  # Lida com matrículas de alunos
│   ├── matterController.js      # Lida com criação, atualização e listagem de matérias
│   └── userController.js        # Lida com autenticação, cadastro e gerenciamento de usuários
│
├── middlewares/                # Middlewares para autenticação e autorização
│   └── userMiddlewares.js       # Middleware de verificação de token e role (JWT)
│
├── routes/                      # Definição das rotas da API
│   ├── enrollmentRoutes.js      # Rotas relacionadas a matrículas
│   ├── matterRoutes.js          # Rotas relacionadas às matérias
│   └── userRoutes.js            # Rotas relacionadas aos usuários (login, registro, etc.)
│
├── .env                         # Variáveis de ambiente (não versionado)
├── .env.example                 # Exemplo de configuração .env
├── .gitignore                   # Arquivos e pastas ignorados pelo Git
├── package.json                 # Dependências e scripts do projeto
├── package-lock.json            # Lockfile para instalação determinística
├── README.md                    # Documentação do projeto
└── server.js                    # Arquivo principal que inicializa o servidor Express
```

## 🔐 Autenticação & Autorização

- **Autenticação** via `JWT`.
- **Middleware `authenticate`**: Verifica se o token é válido e se está na blacklist.
- **Middleware `authorizeRole`**: Restringe rotas para `admin`, `professor` ou `aluno`.

---

## 🗃️ Banco de Dados

### 🧑 Tabela `users`

| Campo     | Tipo        | Notas                    |
|-----------|-------------|--------------------------|
| id        | INT         | PK, AI                   |
| name      | VARCHAR     |                          |
| email     | VARCHAR     | Único                    |
| password  | VARCHAR     | Criptografado (bcrypt)   |
| role      | ENUM        | `admin`, `professor`, `aluno` |

### 📚 Tabela `matters`

| Campo        | Tipo      | Notas                        |
|--------------|-----------|------------------------------|
| id           | INT       | PK, AI                       |
| name         | VARCHAR   | Nome da matéria              |
| code         | VARCHAR   | Código único da matéria      |
| description  | TEXT      |                              |
| workloud     | INT       | Carga horária                |
| professor_id | INT       | FK para `users.id`           |

### 📝 Tabela `enrollments`

| Campo       | Tipo     | Notas                   |
|-------------|----------|-------------------------|
| id          | INT      | PK, AI                  |
| student_id  | INT      | FK para `users.id`      |
| matter_id   | INT      | FK para `matters.id`    |

### ⛔ Tabela `token_blacklist`

| Campo       | Tipo      | Notas                   |
|-------------|-----------|-------------------------|
| id          | INT       | PK, AI                  |
| token       | TEXT      | JWT inválido            |
| expires_at  | DATETIME  | Data de expiração       |

---

## 🧪 Rotas principais

### 🧑‍🎓 Autenticação

| Método | Rota           | Ação                 |
|--------|----------------|----------------------|
| POST   | `/register`    | Cadastra um usuário  |
| POST   | `/login`       | Retorna um token JWT |
| POST   | `/logout`      | Blacklista o token   |

### 📘 Matérias

| Método | Rota                    | Ação                                     |
|--------|-------------------------|------------------------------------------|
| POST   | `/materias`             | Criar matéria (admin/professor)          |
| GET    | `/materias`             | Ver todas as matérias                    |
| GET    | `/materias/:id`         | Ver uma matéria                          |
| PUT    | `/materias/:id`         | Atualizar matéria                        |
| DELETE | `/materias/:id`         | Deletar matéria                          |

### 📝 Matrículas

| Método | Rota                   | Ação                                  |
|--------|------------------------|---------------------------------------|
| POST   | `/matricula`           | Aluno se matricula em uma matéria     |
| GET    | `/matricula`           | Aluno vê suas matrículas              |

### 🧑‍🏫 Professor

| Método | Rota                             | Ação                                                |
|--------|----------------------------------|-----------------------------------------------------|
| GET    | `/professor/alunos`              | Professor vê alunos matriculados nas suas matérias  |
| GET    | `/professor/:professorId`        | Qualquer um pode ver matérias de um professor       |

---

## 📲 Testando com Postman

1. Faça `register` com um `admin`, `professor` e `aluno`.
2. Use o `token` retornado do `login` para autenticar (`Bearer token`).
3. Teste os endpoints conforme o `role`:
   - `admin`: cria e deleta matérias e usuários.
   - `professor`: cria e vê alunos matriculados.
   - `aluno`: se matricula e vê suas matérias.

---

## ⚙️ Configuração `.env`

Crie um arquivo `.env` com:

```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=suasenha
MYSQL_DATABASE=school
JWT_SECRET=suachavesecreta
```

---
Desenvolvido por Anderson Freire. 🚀
