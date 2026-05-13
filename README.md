<<<<<<<HEAD

seja bem vindo ao projeto MULTI CARROS

========================


# Multicarros

## Sobre o projeto

Sistema de gestão de veículos, clientes e funcionários, utilizando Node.js, Express, TypeScript e Supabase como banco de dados. O front-end é servido via arquivos estáticos (HTML, CSS, JS) na pasta `public`.

## Estrutura

- `src/` — Código fonte do backend (TypeScript)
- `public/` — Front-end estático (HTML, CSS, JS, imagens)
- `.env` — Credenciais do Supabase

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` na raiz do projeto:
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-do-supabase
   ```
3. Compile o backend:
   ```bash
   npm run dist
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```
5. Acesse o sistema no navegador:
   ```
   http://localhost:3000/
   ```

## Credenciais de acesso (Admin)

Estas são as credenciais de administrador criadas para testes no sistema:

- **Usuário (email):** admin@multicarros.com
- **Senha:** 333dev

Faça login com essas credenciais na tela de login para acessar o painel administrativo.

## Observações

- O front-end está na pasta `public/HTML`.
- O backend serve os arquivos estáticos e responde às requisições da API.
- Para subir alterações no GitHub, faça o commit e o push após ser adicionado como colaborador.
>>>>>>>>>
