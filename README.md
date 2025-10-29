# Cunca - Card Games Platform Frontend

Plataforma web para jogos de cartas em tempo real, construída com Next.js, TypeScript, e Socket.IO.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI reutilizáveis
- **Socket.IO Client** - Comunicação WebSocket em tempo real
- **Zustand** - Gerenciamento de estado global
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend da plataforma Cunca rodando

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd cunca-card-games-platform-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com as URLs corretas do backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

## 🏃 Como Rodar

### Modo de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build para produção:
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
cunca-card-games-platform-frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicial
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registro
│   │   ├── lobby/             # Lobby principal
│   │   └── room/[id]/         # Sala de jogo dinâmica
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── header.tsx        # Cabeçalho da aplicação
│   │   ├── room-card.tsx     # Card de sala no lobby
│   │   ├── chat.tsx          # Componente de chat
│   │   └── player-list.tsx   # Lista de jogadores
│   ├── lib/                   # Utilitários e configurações
│   │   ├── socket.ts         # Configuração WebSocket
│   │   ├── api.ts            # Cliente API REST
│   │   └── utils.ts          # Funções auxiliares
│   └── store/                 # Gerenciamento de estado
│       └── user-store.ts     # Store do usuário (Zustand)
├── public/                    # Arquivos estáticos
├── .env.local                # Variáveis de ambiente (não commitado)
├── .env.example              # Exemplo de variáveis de ambiente
├── tailwind.config.ts        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
└── package.json              # Dependências
```

## 🎮 Funcionalidades

### ✅ Autenticação
- Login e registro de usuários
- JWT armazenado no localStorage
- Redirecionamento automático após login
- Store global com dados do jogador

### ✅ Lobby
- Lista de salas disponíveis
- Atualização em tempo real via WebSocket
- Criação de novas salas
- Entrada em salas existentes

### ✅ Sala de Jogo
- Conexão WebSocket dedicada
- Lista de jogadores conectados
- Chat em tempo real
- Layout preparado para renderização de mesa/cartas

### ✅ WebSocket
- Eventos implementados:
  - `connect` / `disconnect`
  - `room_update` (atualização de salas)
  - `player_joined` / `player_left`
  - `message` (chat)
- Reconexão automática
- Funções auxiliares para emissão de eventos

## 🎨 Design

- Tema escuro por padrão
- Layout responsivo (desktop e mobile)
- Componentes reutilizáveis do shadcn/ui
- Paleta de cores consistente
- Ícones do Lucide React

## 🔌 Integração com Backend

O frontend espera que o backend forneça os seguintes endpoints:

### REST API
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/rooms` - Lista de salas disponíveis
- `POST /api/rooms` - Criar nova sala

### WebSocket Events
- **Client → Server:**
  - `join_room` - Entrar em uma sala
  - `leave_room` - Sair de uma sala
  - `send_message` - Enviar mensagem no chat

- **Server → Client:**
  - `room_update` - Atualização de salas
  - `player_joined` - Jogador entrou na sala
  - `player_left` - Jogador saiu da sala
  - `message` - Mensagem do chat
  - `game_state` - Estado do jogo atualizado

## 🛠️ Desenvolvimento

### Adicionar novos componentes shadcn/ui:
```bash
npx shadcn-ui@latest add <component-name>
```

### Padrões de código:
- Use TypeScript para todos os arquivos
- Componentes funcionais com hooks
- Nomenclatura de arquivos em kebab-case
- Componentes em PascalCase

## 📝 Licença

Este projeto é privado e proprietário.

## 👥 Contribuindo

Entre em contato com a equipe de desenvolvimento para diretrizes de contribuição.

