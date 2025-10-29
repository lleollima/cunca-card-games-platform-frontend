# Arquitetura da Aplicação Cunca

## 📐 Visão Geral

Este documento descreve a arquitetura e os padrões utilizados na plataforma Cunca.

---

## 🏛️ Arquitetura

### Diagrama de Camadas

```
┌─────────────────────────────────────────────┐
│           Componentes de UI                  │
│  (Pages, Components, shadcn/ui)              │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│          Gerenciamento de Estado             │
│           (Zustand Stores)                   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         Camada de Comunicação                │
│      (REST API + WebSocket)                  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│            Backend API                       │
│    (Express + Socket.IO Server)              │
└─────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas Detalhada

### `/src/app`
Contém todas as rotas da aplicação usando o App Router do Next.js 14.

- **`layout.tsx`**: Layout raiz da aplicação
- **`page.tsx`**: Página inicial (redireciona para login ou lobby)
- **`providers.tsx`**: Providers globais e inicialização
- **`login/`**: Página de autenticação
- **`register/`**: Página de criação de conta
- **`lobby/`**: Lobby principal com lista de salas
- **`room/[id]/`**: Sala de jogo com parâmetro dinâmico

### `/src/components`
Componentes React reutilizáveis.

#### `/src/components/ui`
Componentes base do shadcn/ui:
- `button.tsx` - Botões com variantes
- `card.tsx` - Cards e containers
- `input.tsx` - Campos de entrada
- `textarea.tsx` - Áreas de texto

#### Componentes de Negócio
- `header.tsx` - Cabeçalho global com navegação
- `room-card.tsx` - Card de sala no lobby
- `chat.tsx` - Chat em tempo real
- `player-list.tsx` - Lista de jogadores

### `/src/lib`
Bibliotecas e utilitários.

- **`api.ts`**: Cliente REST API
  - Funções para autenticação
  - CRUD de salas
  - Gestão de token JWT

- **`socket.ts`**: Cliente WebSocket
  - Inicialização do Socket.IO
  - Eventos tipados
  - Funções auxiliares de emissão

- **`utils.ts`**: Utilitários gerais
  - `cn()` - Merge de classes Tailwind

### `/src/store`
Gerenciamento de estado global com Zustand.

- **`user-store.ts`**: Estado do usuário
  - Dados do usuário autenticado
  - Token JWT
  - Funções de login/logout
  - Persistência no localStorage

---

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Preenche credenciais
   ↓
3. POST /api/auth/login → Backend
   ↓
4. Backend valida e retorna JWT + dados do usuário
   ↓
5. Frontend salva no localStorage e Zustand store
   ↓
6. Inicializa conexão WebSocket com token
   ↓
7. Redireciona para /lobby
```

### Persistência de Sessão

```typescript
// user-store.ts
loadFromStorage() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    initSocket(token);
    // Restaura estado
  }
}
```

---

## 🔌 Comunicação com Backend

### REST API

Todas as requisições REST passam por `src/lib/api.ts`:

```typescript
// Exemplo de uso
import { authAPI, roomsAPI } from '@/lib/api';

// Login
const { token, user } = await authAPI.login(email, password);

// Listar salas
const rooms = await roomsAPI.list();

// Criar sala
const room = await roomsAPI.create('Sala de Truco', 4);
```

#### Autenticação Automática

O cliente API adiciona automaticamente o header `Authorization`:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### WebSocket

Gerenciado por `src/lib/socket.ts`:

```typescript
// Inicialização
import { initSocket, getSocket, socketEmit } from '@/lib/socket';

// Inicializa (feito automaticamente no login)
initSocket(token);

// Emitir eventos
socketEmit.joinRoom(roomId);
socketEmit.sendMessage(roomId, message);

// Escutar eventos
const socket = getSocket();
socket?.on('message', (msg) => {
  // Processa mensagem
});
```

#### Eventos Disponíveis

**Emitidos pelo Cliente:**
- `join_room(roomId: string)`
- `leave_room(roomId: string)`
- `send_message({ roomId: string, message: string })`

**Recebidos do Servidor:**
- `room_update(rooms: Room[])`
- `player_joined(player: Player)`
- `player_left(player: Player)`
- `message(msg: ChatMessage)`
- `game_state(state: any)`

---

## 🎨 Sistema de Design

### Tema e Cores

Definido em `src/app/globals.css` usando variáveis CSS:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Componentes shadcn/ui

Configurados via `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

### Tailwind CSS

Classes utilitárias para layout responsivo:

```tsx
// Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Espaçamento adaptativo
<div className="p-4 lg:p-8">

// Esconder em mobile
<span className="hidden md:inline">Desktop only</span>
```

---

## 🔐 Segurança

### Token JWT

- Armazenado no `localStorage`
- Enviado em todas as requisições autenticadas
- Usado para autenticar WebSocket

### Proteção de Rotas

```typescript
// Exemplo em page.tsx
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, router]);
```

### Limpeza ao Logout

```typescript
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  disconnectSocket();
}
```

---

## 🧩 Padrões de Código

### Componentes

- **Sempre client components** quando usar hooks ou estado
- Adicionar `'use client'` no topo do arquivo
- Props tipadas com TypeScript

```typescript
'use client';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  // ...
}
```

### Hooks Customizados

```typescript
// Exemplo: useRoom.ts
export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  
  useEffect(() => {
    // Lógica de carregamento
  }, [roomId]);
  
  return { room };
}
```

### Stores Zustand

```typescript
interface MyStore {
  data: any;
  setData: (data: any) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
```

---

## 🧪 Testes (para futuro)

### Estrutura Sugerida

```
src/
├── __tests__/
│   ├── components/
│   ├── lib/
│   └── store/
```

### Ferramentas Recomendadas

- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes
- **MSW** - Mock de API
- **Cypress** - Testes E2E

---

## 🚀 Performance

### Otimizações Implementadas

1. **Code Splitting**: Rotas automaticamente separadas pelo Next.js
2. **Image Optimization**: Próximo passo - usar `next/image`
3. **Font Optimization**: Inter carregado via `next/font`
4. **CSS-in-JS**: Tailwind com purge automático

### Próximas Otimizações

- [ ] Lazy loading de componentes pesados
- [ ] Virtualização de listas grandes
- [ ] Caching de requisições API
- [ ] Service Worker para offline

---

## 📊 Monitoramento (para produção)

### Métricas Recomendadas

- **Vercel Analytics** - Performance e Web Vitals
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Mixpanel/Amplitude** - Analytics de uso

---

## 🔧 Troubleshooting

### WebSocket não conecta

```typescript
// Verificar no console
const socket = getSocket();
console.log('Socket conectado?', socket?.connected);
console.log('Socket ID:', socket?.id);
```

### Store não persiste

```typescript
// Verificar localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### Componente não renderiza

```typescript
// Adicionar logs
useEffect(() => {
  console.log('Component mounted', props);
}, []);
```

---

## 📚 Recursos Adicionais

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Tailwind CSS](https://tailwindcss.com/docs)

