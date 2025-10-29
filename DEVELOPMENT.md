# Guia de Desenvolvimento - Cunca

Este guia contém informações úteis para desenvolvedores trabalhando no projeto Cunca.

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em modo produção
npm start

# Lint do código
npm run lint
```

### Adicionar Componentes shadcn/ui

```bash
# Adicionar um componente específico
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast

# Listar componentes disponíveis
npx shadcn-ui@latest add
```

---

## 📝 Convenções de Código

### Nomenclatura

- **Arquivos**: kebab-case (`room-card.tsx`, `user-store.ts`)
- **Componentes**: PascalCase (`RoomCard`, `PlayerList`)
- **Funções**: camelCase (`handleSubmit`, `loadRooms`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `MAX_PLAYERS`)
- **Interfaces**: PascalCase com prefixo I opcional (`User` ou `IUser`)

### Estrutura de Componentes

```typescript
'use client'; // Se usar hooks/estado

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  optional?: boolean;
}

/**
 * Descrição do componente
 */
export function MyComponent({ title, optional = false }: MyComponentProps) {
  const [state, setState] = useState();

  const handleClick = () => {
    // Lógica
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Organização de Imports

```typescript
// 1. Imports do React
import { useState, useEffect } from 'react';

// 2. Imports de bibliotecas externas
import { useRouter } from 'next/navigation';

// 3. Imports de componentes UI
import { Button } from '@/components/ui/button';

// 4. Imports de componentes internos
import { Header } from '@/components/header';

// 5. Imports de utilitários
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api';

// 6. Imports de stores
import { useUserStore } from '@/store/user-store';

// 7. Imports de tipos
import type { User, Room } from '@/types';
```

---

## 🎨 Guia de Estilo

### Tailwind CSS

#### Ordem de Classes Recomendada

```tsx
<div className={cn(
  // Layout
  "flex items-center justify-between",
  // Espaçamento
  "p-4 gap-2",
  // Tamanho
  "w-full h-10",
  // Tipografia
  "text-sm font-medium",
  // Cores
  "bg-primary text-primary-foreground",
  // Bordas
  "border border-input rounded-md",
  // Efeitos
  "shadow-sm hover:shadow-md",
  // Transições
  "transition-all duration-200",
  // Estados
  "disabled:opacity-50",
  // Responsividade
  "md:flex-row lg:gap-4"
)}>
```

#### Cores do Tema

```tsx
// Cores primárias
bg-background text-foreground
bg-primary text-primary-foreground
bg-secondary text-secondary-foreground

// Cores de destaque
bg-accent text-accent-foreground
bg-muted text-muted-foreground

// Estados
bg-destructive text-destructive-foreground

// Bordas e inputs
border-border bg-input ring-ring
```

#### Responsividade

```tsx
// Mobile first
<div className="
  grid grid-cols-1    // Mobile
  md:grid-cols-2      // Tablet
  lg:grid-cols-3      // Desktop
  xl:grid-cols-4      // Large desktop
">

// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1400px
```

---

## 🔌 Trabalhando com WebSocket

### Padrão de Uso em Componentes

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getSocket, socketEmit, ChatMessage } from '@/lib/socket';

export function MyComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = getSocket();
    
    if (!socket) return;

    // Escutar evento
    socket.on('message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    // Cleanup
    return () => {
      socket.off('message');
    };
  }, []);

  const handleSend = (text: string) => {
    socketEmit.sendMessage(roomId, text);
  };

  return <div>{/* ... */}</div>;
}
```

### Debug do WebSocket

```typescript
// Em qualquer componente
useEffect(() => {
  const socket = getSocket();
  
  if (socket) {
    // Log de todos os eventos
    socket.onAny((eventName, ...args) => {
      console.log(`[Socket] ${eventName}:`, args);
    });

    return () => {
      socket.offAny();
    };
  }
}, []);
```

---

## 🗃️ Trabalhando com Stores

### Criar um Novo Store

```typescript
// src/store/game-store.ts
import { create } from 'zustand';

interface GameState {
  cards: Card[];
  currentPlayer: string | null;
  
  // Actions
  setCards: (cards: Card[]) => void;
  playCard: (cardId: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  cards: [],
  currentPlayer: null,
  
  setCards: (cards) => set({ cards }),
  
  playCard: (cardId) => set((state) => ({
    cards: state.cards.filter(c => c.id !== cardId)
  })),
}));
```

### Usar em Componentes

```typescript
// Selecionar estado específico (recomendado)
const cards = useGameStore(state => state.cards);
const playCard = useGameStore(state => state.playCard);

// Selecionar múltiplos valores
const { cards, currentPlayer } = useGameStore(state => ({
  cards: state.cards,
  currentPlayer: state.currentPlayer,
}));
```

---

## 🧪 Debugging

### React DevTools

```bash
# Instalar extensão no navegador
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
```

### Logs Úteis

```typescript
// Ver props do componente
useEffect(() => {
  console.log('Props:', { prop1, prop2 });
}, [prop1, prop2]);

// Ver rerenderizações
useEffect(() => {
  console.log('Component rendered');
});

// Ver estado do Zustand
const state = useUserStore.getState();
console.log('Store state:', state);
```

### Network Debug

```typescript
// Ver todas as requisições API
// Em src/lib/api.ts, adicione:

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`);
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  console.log(`[API] Response:`, response.status);
  
  const data = await response.json();
  console.log(`[API] Data:`, data);
  
  return data;
}
```

---

## 🚀 Produção

### Checklist Pré-Deploy

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Build local funciona sem erros (`npm run build`)
- [ ] Lint passa sem erros (`npm run lint`)
- [ ] URLs do backend apontam para produção
- [ ] CORS está configurado no backend
- [ ] WebSocket está funcionando em produção

### Variáveis de Ambiente para Produção

```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.cunca.com
NEXT_PUBLIC_WS_URL=https://api.cunca.com
```

### Deploy na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

---

## 📦 Adicionar Novas Funcionalidades

### Exemplo: Adicionar Sistema de Notificações

1. **Instalar biblioteca (se necessário)**
```bash
npm install react-hot-toast
```

2. **Criar store**
```typescript
// src/store/notification-store.ts
import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notification, id: crypto.randomUUID() }
    ]
  })),
}));
```

3. **Criar componente**
```typescript
// src/components/notifications.tsx
'use client';

import { useNotificationStore } from '@/store/notification-store';

export function Notifications() {
  const notifications = useNotificationStore(state => state.notifications);
  
  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map(notif => (
        <div key={notif.id} className="p-4 bg-card rounded-lg shadow-lg">
          {notif.message}
        </div>
      ))}
    </div>
  );
}
```

4. **Integrar no layout**
```typescript
// src/app/layout.tsx
import { Notifications } from '@/components/notifications';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Notifications />
      </body>
    </html>
  );
}
```

---

## 🎯 Próximas Funcionalidades Sugeridas

### Curto Prazo
- [ ] Sistema de notificações toast
- [ ] Avatar de jogadores
- [ ] Status online/offline
- [ ] Indicador de digitação no chat
- [ ] Sons de notificação

### Médio Prazo
- [ ] Perfil de usuário editável
- [ ] Upload de avatar
- [ ] Configurações de preferências
- [ ] Histórico de partidas
- [ ] Sistema de amizades

### Longo Prazo
- [ ] Sistema de ranking
- [ ] Torneios
- [ ] Replays de partidas
- [ ] Estatísticas avançadas
- [ ] Sistema de conquistas

---

## 📚 Recursos de Aprendizado

### Next.js
- [Documentação oficial](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Documentação](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)

### Socket.IO
- [Client API](https://socket.io/docs/v4/client-api/)
- [Emit cheatsheet](https://socket.io/docs/v4/emit-cheatsheet/)

---

## 🤝 Contribuindo

### Workflow Git

```bash
# Criar branch para feature
git checkout -b feature/nome-da-feature

# Fazer commits atômicos
git commit -m "feat: adiciona componente de notificação"

# Push para remote
git push origin feature/nome-da-feature

# Criar Pull Request no GitHub
```

### Mensagens de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas de build, CI, etc

Exemplos:
```
feat: adiciona sistema de notificações
fix: corrige erro ao enviar mensagem no chat
docs: atualiza README com instruções de deploy
style: formata código com prettier
refactor: reorganiza estrutura de pastas
```

---

## ❓ FAQ

**Q: Como adicionar uma nova rota?**
A: Crie uma pasta em `src/app/` com um arquivo `page.tsx`.

**Q: Como proteger uma rota?**
A: Use `useUserStore` para verificar `isAuthenticated` e redirecione se necessário.

**Q: Como acessar o token JWT?**
A: `const token = useUserStore(state => state.token)`

**Q: Como fazer requisição autenticada?**
A: Use as funções de `src/lib/api.ts` que já adicionam o token automaticamente.

**Q: Como escutar evento do WebSocket?**
A: Use `getSocket()?.on('event_name', callback)` em um `useEffect`.

---

Feito com ❤️ para a plataforma Cunca

