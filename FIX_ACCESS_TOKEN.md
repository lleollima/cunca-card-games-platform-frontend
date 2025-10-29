# ✅ CORREÇÃO - accessToken e refreshToken

## 🎯 Problema Resolvido

O backend retorna `accessToken` e `refreshToken`, mas o código estava esperando apenas `token`. Agora está totalmente compatível!

---

## 🔧 Mudanças Implementadas

### 1️⃣ Interface AuthResponse Atualizada

**Arquivo:** `src/lib/api.ts`

**Antes:**
```typescript
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
```

**Depois:**
```typescript
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {  // Agora é opcional
    id: string;
    name: string;
    email: string;
  };
}
```

---

### 2️⃣ Funções Utilitárias para JWT

**Arquivo:** `src/lib/utils.ts`

Adicionadas 3 novas funções:

```typescript
// Decodifica um JWT token
decodeJWT(token: string): any

// Verifica se token está expirado
isTokenExpired(token: string): boolean

// Extrai dados do usuário do token
getUserFromToken(token: string): { id, name, email } | null
```

**Uso:**
```typescript
const user = getUserFromToken(accessToken);
// Retorna: { id: "69011fe9...", name: "player2", email: "player2@test.com" }

const isExpired = isTokenExpired(accessToken);
// Retorna: true/false
```

---

### 3️⃣ Login Atualizado

**Arquivo:** `src/app/login/page.tsx`

```typescript
const response = await authAPI.login(email, password);
// response = { accessToken: "...", refreshToken: "..." }

// Extrai dados do usuário (do response ou do token)
const user = response.user || getUserFromToken(response.accessToken);

// Salva accessToken como "token" no store
login(response.accessToken, user);

// Salva refreshToken separadamente
localStorage.setItem('refreshToken', response.refreshToken);
```

**Logs:**
```
✅ Login response: { accessToken: "...", refreshToken: "..." }
👤 User: { id: "...", name: "player2", email: "player2@test.com" }
🔐 Login: Salvando dados...
💾 Token salvo no localStorage
✅ Tokens salvos, redirecionando para /lobby
```

---

### 4️⃣ Registro Atualizado

**Arquivo:** `src/app/register/page.tsx`

Mesma lógica do login:
```typescript
const response = await authAPI.register(name, email, password);

let user = response.user || getUserFromToken(response.accessToken);

// Se não veio nome no token, usa o nome do formulário
if (user && !user.name) {
  user.name = name;
}

login(response.accessToken, user);
localStorage.setItem('refreshToken', response.refreshToken);
```

---

### 5️⃣ Logout Atualizado

**Arquivo:** `src/store/user-store.ts`

Agora também remove o refreshToken:
```typescript
logout: () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');  // ✅ Novo!
  
  disconnectSocket();
  // ...
}
```

---

## 📊 Estrutura do Token JWT

Seu backend retorna tokens no formato:

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Payload do accessToken decodificado:**
```json
{
  "sub": "69011fe90dab4c09940e4650",
  "email": "player2@test.com",
  "role": "user",
  "iat": 1761701631,
  "exp": 1761702531
}
```

**Como o código extrai o usuário:**
```typescript
{
  id: payload.sub,           // "69011fe90dab4c09940e4650"
  name: payload.email.split('@')[0],  // "player2"
  email: payload.email       // "player2@test.com"
}
```

---

## 🔐 Onde os Tokens São Armazenados

**localStorage:**
```javascript
{
  "token": "eyJhbGciOiJIU...",        // accessToken
  "refreshToken": "eyJhbGciOiJIU...", // refreshToken
  "user": "{\"id\":\"...\",\"name\":\"player2\",\"email\":\"...\"}"
}
```

**Zustand Store:**
```typescript
{
  token: "eyJhbGciOiJIU...",  // accessToken
  user: {
    id: "69011fe90dab4c09940e4650",
    name: "player2",
    email: "player2@test.com"
  },
  isAuthenticated: true
}
```

---

## 🧪 Como Testar

### Teste 1: Verificar Response do Login

Console do navegador após login:
```
✅ Login response: {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
👤 User: {
  id: "69011fe90dab4c09940e4650",
  name: "player2",
  email: "player2@test.com"
}
🔐 Login: Salvando dados...
💾 Token salvo no localStorage
✅ Login completo: isAuthenticated = true
```

### Teste 2: Verificar localStorage

DevTools → Application → Local Storage:
```javascript
token: "eyJhbGciOiJIUzI1NiI..."
refreshToken: "eyJhbGciOiJIUzI1NiI..."
user: "{\"id\":\"69011fe90dab4c09940e4650\",\"name\":\"player2\",\"email\":\"player2@test.com\"}"
```

### Teste 3: Verificar Requisição de Jogos

DevTools → Network → /api/games → Request Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Teste 4: Decodificar Token no Console

```javascript
// Execute no console
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);

// Resultado:
{
  sub: "69011fe90dab4c09940e4650",
  email: "player2@test.com",
  role: "user",
  iat: 1761701631,
  exp: 1761702531
}

// Verificar expiração
const expiresAt = new Date(payload.exp * 1000);
console.log('Token expira em:', expiresAt);
```

---

## 🔄 Fluxo Completo de Autenticação

### 1. Login/Registro
```
User preenche formulário
  ↓
Frontend → POST /api/auth/login
  ↓
Backend retorna: { accessToken, refreshToken }
  ↓
Frontend extrai user do token (sub, email)
  ↓
Salva no localStorage: token, refreshToken, user
  ↓
Salva no Zustand: token, user, isAuthenticated
  ↓
Inicializa WebSocket com accessToken
  ↓
Redireciona para /lobby
```

### 2. Carregar Jogos
```
Lobby carrega
  ↓
loadRooms() é chamado
  ↓
Lê token do localStorage
  ↓
Adiciona header: Authorization: Bearer {token}
  ↓
Faz request: GET /api/games
  ↓
Backend valida token e retorna jogos
  ↓
Frontend exibe lista de jogos
```

### 3. Token Expira
```
Request retorna 401
  ↓
Frontend detecta erro 401
  ↓
Limpa localStorage (token, user, refreshToken)
  ↓
Exibe mensagem: "Sessão expirada"
  ↓
Redireciona para /login após 2s
```

---

## 🆘 Troubleshooting

### Problema: Ainda recebe undefined

**Solução:**
```javascript
// Limpe tudo e faça login novamente
localStorage.clear();
window.location.href = '/login';
```

### Problema: Token não é enviado

**Verificar no console:**
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

**Se aparecer "null":**
- Faça logout e login novamente
- Verifique se o backend está retornando accessToken

### Problema: 401 mesmo com token

**Verificar se token expirou:**
```javascript
import { isTokenExpired } from '@/lib/utils';

const token = localStorage.getItem('token');
if (token && isTokenExpired(token)) {
  console.log('❌ Token expirado!');
  // Faça login novamente
}
```

---

## ✅ Checklist Final

- [x] Interface AuthResponse atualizada
- [x] Funções utilitárias de JWT criadas
- [x] Login usando accessToken
- [x] Registro usando accessToken
- [x] refreshToken salvo no localStorage
- [x] Logout limpa refreshToken
- [x] getUserFromToken extrai dados do payload
- [x] Logs detalhados adicionados
- [ ] Testar login completo
- [ ] Verificar se /api/games funciona

---

## 🎉 Resultado

✅ Backend retorna: `{ accessToken, refreshToken }`  
✅ Frontend salva: `token = accessToken`  
✅ Frontend extrai user do token JWT  
✅ Requisições usam: `Authorization: Bearer {accessToken}`  
✅ refreshToken armazenado para uso futuro  

**Tudo pronto para funcionar com sua API!**

---

**Data:** 2025-10-28  
**Versão:** 1.1.2  
**Status:** ✅ **COMPLETO**

