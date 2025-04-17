# API Games

API RESTful desenvolvida com NestJS para gerenciamento de jogos, integrando com a API externa RAWG.

## Tecnologias Utilizadas

- NestJS
- PostgreSQL
- Prisma ORM
- Redis
- Docker

## Pré-requisitos

- Node.js (v14 ou superior)
- Yarn
- Docker e Docker Compose

## Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd api-games
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no arquivo `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário, principalmente:

```
PORT=3333

RAWG_API_URL=https://api.rawg.io/api/
RAWG_API_KEY=e011d1e3cf764d6fa95760ac2595bd75  # Use sua própria chave API, se necessário

DATABASE_URL="postgresql://api_games:api_games@localhost:5432/api_games?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Inicie os serviços com Docker

```bash
docker compose up -d
```

Este comando iniciará o PostgreSQL e o Redis em containers Docker.

### 5. Sincronize o banco de dados com Prisma

```bash
npx prisma db push
```

## Executando a aplicação

### Ambiente de desenvolvimento

```bash
yarn start:dev
```

## Testando a API

A API estará disponível em `http://localhost:3333`.

### Utilizando arquivos de request com Rest Client

O projeto inclui arquivos de request na pasta `requests/` que podem ser executados diretamente no VSCode utilizando a extensão **Rest Client**.

1. Instale a extensão **Rest Client** no VSCode
   - Pesquise por "Rest Client" na aba de extensões do VSCode ou acesse [Rest Client no VS Marketplace](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

2. Abra qualquer arquivo .http da pasta `requests/`

3. Clique em "Send Request" que aparece acima de cada request ou use o atalho `Ctrl+Alt+R` (ou `Cmd+Alt+R` no macOS)

4. Os resultados serão exibidos em uma nova aba no VSCode

Arquivos de request disponíveis:

- `all-games.http` - Lista todos os jogos
  ```http
  GET http://localhost:3333/games/
  ```

- `get-game-by-id.http` - Busca um jogo específico pelo ID
  ```http
  GET http://localhost:3333/games/cm9lul0870000vyto622llvfz
  ```

- `search-games.http` - Busca jogos por título
  ```http
  GET http://localhost:3333/games/search?title=Europa Universalis
  ```

### Visualizar esquema do banco de dados

```bash
npx prisma studio
```