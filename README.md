# 🚀 API REST - Usuários e Posts

API REST desenvolvida com Node.js, TypeScript, Fastify e Prisma ORM para gerenciamento de usuários e posts.

## 📋 Funcionalidades

### Usuários
- ✅ Criar usuário
- ✅ Listar todos os usuários
- ✅ Buscar usuário específico
- ✅ Atualizar usuário
- ✅ Deletar usuário
- ✅ Listar posts de um usuário

### Posts
- ✅ Criar post
- ✅ Listar todos os posts
- ✅ Buscar post específico
- ✅ Atualizar post
- ✅ Deletar post

### Segurança
- 🔒 Senhas criptografadas com bcryptjs
- 🌐 CORS habilitado
- ✅ Validação de dados com Zod

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript
- **Fastify** - Framework web rápido e eficiente
- **Prisma ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do PostgreSQL
- **Zod** - Validação de schemas
- **bcryptjs** - Criptografia de senhas

## 📁 Estrutura do Projeto

```
tarefa-node-api/
├── prisma/
│   ├── migrations/          # Migrações do banco
│   └── schema.prisma        # Schema do banco
├── src/
│   ├── env/
│   │   └── index.ts         # Validação de variáveis de ambiente
│   ├── lib/
│   │   └── prisma.ts        # Cliente do Prisma
│   ├── routes/
│   │   ├── users.routes.ts  # Rotas de usuários
│   │   └── posts.routes.ts  # Rotas de posts
│   ├── app.ts               # Configuração do Fastify
│   └── server.ts            # Inicialização do servidor
├── .env                     # Variáveis de ambiente
├── docker-compose.yml       # PostgreSQL no Docker
├── package.json
└── tsconfig.json
```

## ⚙️ Instalação

### Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/TaINaS20/tarefa-node-api.git
cd tarefa-node-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
PORT=3333
HOST="0.0.0.0"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_aqui
POSTGRES_DB=postgres
POSTGRES_PORT=5432

DATABASE_URL="postgresql://postgres:sua_senha_aqui@127.0.0.1:5432/postgres"
```

4. **Suba o banco de dados com Docker**
```bash
docker compose up -d
```

5. **Execute as migrações do Prisma**
```bash
npx prisma migrate dev
```

6. **Gere o Prisma Client**
```bash
npx prisma generate
```

7. **Inicie o servidor**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

## 🔗 Endpoints da API

### **Usuários**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/users` | Criar usuário |
| GET | `/users` | Listar todos os usuários |
| GET | `/users/:id` | Buscar usuário por ID |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Deletar usuário |
| GET | `/users/:id/posts` | Listar posts do usuário |

### **Posts**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/posts` | Criar post |
| GET | `/posts` | Listar todos os posts |
| GET | `/posts/:id` | Buscar post por ID |
| PUT | `/posts/:id` | Atualizar post |
| DELETE | `/posts/:id` | Deletar post |

## 📝 Exemplos de Uso

### Criar Usuário

```http
POST http://localhost:3333/users
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "foto": "https://avatar.com/joao.jpg"
}
```

### Criar Post

```http
POST http://localhost:3333/posts
Content-Type: application/json

{
  "titulo": "Meu primeiro post",
  "conteudo": "Conteúdo do post aqui",
  "userId": 1
}
```

### Listar Posts de um Usuário

```http
GET http://localhost:3333/users/1/posts
```

## 🗄️ Modelo de Dados

### User

```prisma
model User {
  id        Int      @id @default(autoincrement())
  publicId  String   @unique @default(uuid())
  nome      String
  email     String   @unique
  senha     String
  foto      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Post

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  publicId  String   @unique @default(uuid())
  titulo    String
  conteudo  String
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor em desenvolvimento
npm run build    # Compila o projeto
npm start        # Inicia servidor em produção
```

## 📦 Dependências Principais

```json
{
  "@fastify/cors": "^11.2.0",
  "@prisma/client": "^5.22.0",
  "bcryptjs": "^3.0.3",
  "fastify": "^5.7.4",
  "zod": "^4.3.6"
}
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

ISC

## 👨‍💻 Autor

[TaINaS20](https://github.com/TaINaS20)
