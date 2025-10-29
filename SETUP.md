# Cunca - Card Games Platform Frontend

## 📖 Guia Rápido de Início

### 1. Instalar Dependências

```bash
pnpm install
```

Ou use o script de setup automático:

```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env.local` existe e contém as URLs corretas:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Estrutura do Projeto

```
src/
├── app/                      # Rotas Next.js (App Router)
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Página inicial (redireciona)
│   ├── providers.tsx        # Providers globais
│   ├── login/               # Página de login
│   ├── register/            # Página de registro
│   ├── lobby/               # Lobby principal
│   └── room/[id]/           # Sala de jogo dinâmica
│
├── components/              # Componentes React
│   ├── ui/                  # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── header.tsx           # Cabeçalho da aplicação
│   ├── room-card.tsx        # Card de sala no lobby
│   ├── chat.tsx             # Componente de chat
│   └── player-list.tsx      # Lista de jogadores
│
├── lib/                     # Bibliotecas e utilitários
│   ├── api.ts              # Cliente REST API
│   ├── socket.ts           # Cliente WebSocket
│   └── utils.ts            # Funções auxiliares
│
└── store/                   # Estado global (Zustand)
    └── user-store.ts       # Store do usuário
```

---

## 🔌 Integração com Backend

### REST API Endpoints

O frontend espera os seguintes endpoints:

- `POST /api/auth/register` - Registro de usuário
  - Body: `{ name: string, email: string, password: string }`
  - Response: `{ token: string, user: { id, name, email } }`

- `POST /api/auth/login` - Login de usuário
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id, name, email } }`

- `GET /api/rooms` - Lista de salas
  - Response: `Room[]`

- `POST /api/rooms` - Criar sala
  - Body: `{ name: string, maxPlayers: number }`
  - Response: `Room`

- `GET /api/rooms/:id` - Detalhes da sala
  - Response: `Room`

### WebSocket Events

**Client → Server:**
- `join_room(roomId)` - Entra em uma sala
- `leave_room(roomId)` - Sai de uma sala
- `send_message({ roomId, message })` - Envia mensagem

**Server → Client:**
- `room_update(rooms)` - Lista de salas atualizada
- `player_joined(player)` - Jogador entrou
- `player_left(player)` - Jogador saiu
- `message(chatMessage)` - Nova mensagem do chat
- `game_state(state)` - Estado do jogo atualizado

---

## 🎨 Personalização

### Adicionar Componentes shadcn/ui

```bash
npx shadcn-ui@latest add <component-name>
```

Exemplo:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### Modificar Tema

Edite as variáveis CSS em `src/app/globals.css` na seção `:root` e `.dark`.

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

### Iniciar em Produção

```bash
npm start
```

### Deploy na Vercel

O projeto está pronto para deploy na Vercel:

```bash
vercel
```

Ou conecte o repositório Git à Vercel para deploy automático.

---

## 📝 Checklist de Funcionalidades

### ✅ Implementado

- [x] Sistema de autenticação (login/registro)
- [x] Persistência de sessão (JWT no localStorage)
- [x] Store global de usuário (Zustand)
- [x] Lobby com lista de salas
- [x] Atualização em tempo real via WebSocket
- [x] Criação de salas
- [x] Entrada em salas
- [x] Sala de jogo com layout preparado
- [x] Lista de jogadores conectados
- [x] Chat em tempo real
- [x] Design responsivo
- [x] Tema escuro

### 🔜 Próximos Passos (para expandir)

- [ ] Implementar lógica de jogo de cartas
- [ ] Renderização de mesa e cartas
- [ ] Animações de jogadas
- [ ] Sistema de pontuação
- [ ] Notificações em tempo real
- [ ] Perfil de usuário
- [ ] Histórico de partidas
- [ ] Rankings/leaderboards
- [ ] Convites para amigos
- [ ] Partidas privadas

---

## 🐛 Troubleshooting

### Erro ao conectar com o backend

Verifique se:
1. O backend está rodando
2. As URLs em `.env.local` estão corretas
3. O CORS está configurado no backend

### WebSocket não conecta

Certifique-se de que:
1. A URL do WebSocket está correta
2. O token JWT é válido
3. O backend aceita conexões WebSocket

### Erros de TypeScript

Execute:
```bash
npm run lint
```

---

## 📄 Licença

Projeto privado e proprietário.

