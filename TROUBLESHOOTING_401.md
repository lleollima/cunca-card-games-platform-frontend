# 🔧 Troubleshooting - Token 401 Error

## ❌ Problema: Erro 401 ao carregar lista de jogos

Se você está recebendo erro 401 (Unauthorized) ao tentar carregar a lista de jogos em `/api/games`, siga este guia.

---

## 🔍 Diagnóstico

### Passo 1: Verificar Console do Navegador

Abra o DevTools (F12) e vá para a aba **Console**. Procure por logs como:

```
🔐 Login: Salvando dados...
💾 Token salvo no localStorage
✅ Login completo: isAuthenticated = true

🔄 loadFromStorage: Carregando dados do localStorage...
🔍 Token encontrado: eyJhbGciOiJIUzI1NiI...
✅ Dados carregados com sucesso

🔄 Carregando lista de jogos...
[API] GET /api/games { hasToken: true, headers: ... }
```

### Passo 2: Verificar localStorage

No DevTools, vá para **Application** → **Local Storage** → `http://localhost:3000`

Você deve ver:
- `token`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `user`: {"id":"...","name":"...","email":"..."}

**Se não houver token:**
- Faça logout e login novamente
- Verifique se o backend está retornando o token no `/api/auth/login`

### Passo 3: Verificar Headers da Requisição

No DevTools, vá para **Network** → Filtre por `/api/games` → Clique na requisição

Em **Request Headers**, procure por:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Se o header não estiver presente:**
- O token não foi salvo no localStorage
- Ou há um problema no código de API

### Passo 4: Testar Token Manualmente

Abra o console do navegador e execute:

```javascript
// Verificar se há token
console.log('Token:', localStorage.getItem('token'));

// Testar requisição manual
const token = localStorage.getItem('token');
fetch('http://localhost:8000/api/games', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Resposta:', data))
.catch(err => console.error('Erro:', err));
```

---

## ✅ Soluções

### Solução 1: Token Não Está Sendo Salvo

**Sintoma:** Depois do login, não há token no localStorage

**Correção:**

1. Verifique se o backend está retornando o token:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"senha123"}'
  
# Deve retornar:
# {"token":"eyJ...","user":{"id":"...","name":"...","email":"..."}}
```

2. Se o backend está retornando, mas não está salvando, force um novo login:
   - Limpe o localStorage manualmente
   - Faça logout completo
   - Faça login novamente

### Solução 2: Token Está Salvo Mas Não É Enviado

**Sintoma:** Token está no localStorage, mas não aparece nos headers

**Correção:**

Execute no console:
```javascript
// Forçar reload do store
window.location.reload();
```

Ou limpe e refaça login:
```javascript
localStorage.clear();
window.location.href = '/login';
```

### Solução 3: Token Inválido ou Expirado

**Sintoma:** Token está sendo enviado, mas backend retorna 401

**Correção:**

1. Verifique se o token não expirou (JWT geralmente tem validade)
2. Faça logout e login novamente para obter novo token
3. Verifique se o backend está validando o token corretamente

**Teste do token:**
```javascript
// Decodificar token (apenas para debug, não use em produção)
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Expira em:', new Date(payload.exp * 1000));
}
```

### Solução 4: CORS ou Backend Não Aceita Token

**Sintoma:** Token é enviado mas backend não reconhece

**Verificações no Backend:**

1. CORS configurado corretamente:
```javascript
// Express exemplo
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

2. Middleware de autenticação está ativo:
```javascript
// Express exemplo
app.get('/api/games', authenticateToken, (req, res) => {
  // ...
});
```

3. Backend lê o header Authorization:
```javascript
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
```

---

## 🧪 Teste Completo do Fluxo

Execute este script no console para testar todo o fluxo:

```javascript
// 1. Limpar tudo
localStorage.clear();
console.log('✅ localStorage limpo');

// 2. Fazer login
fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'seu@email.com',
    password: 'senha123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login OK:', data);
  
  // 3. Salvar token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  console.log('✅ Token salvo');
  
  // 4. Buscar jogos
  return fetch('http://localhost:8000/api/games', {
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json'
    }
  });
})
.then(r => r.json())
.then(games => {
  console.log('✅ Jogos carregados:', games);
})
.catch(err => {
  console.error('❌ Erro:', err);
});
```

---

## 🔧 Logs Adicionados no Código

Com as últimas alterações, você verá logs detalhados:

### No Login:
```
🔐 Login: Salvando dados... { userId: "...", userName: "...", tokenLength: xxx }
💾 Token salvo no localStorage
✅ Login completo: isAuthenticated = true
```

### Ao Carregar Página:
```
🔄 loadFromStorage: Carregando dados do localStorage...
🔍 Token encontrado: eyJhbGciOiJIU...
🔍 User encontrado: SIM
✅ Dados carregados com sucesso: { userId: "...", userName: "...", hasToken: true }
✅ Store atualizado: isAuthenticated = true
```

### Ao Carregar Jogos:
```
🔄 Carregando lista de jogos...
[API] GET /api/games { hasToken: true, headers: { Authorization: "Bearer ***" } }
✅ Jogos carregados: 5
```

### Em Caso de Erro:
```
❌ Erro ao carregar salas: Error: HTTP error! status: 401
⚠️ Sessão expirada. Por favor, faça login novamente.
```

---

## 📋 Checklist Rápido

- [ ] Backend está rodando em `http://localhost:8000`?
- [ ] Endpoint `/api/auth/login` retorna `token` e `user`?
- [ ] Endpoint `/api/games` requer autenticação (401 sem token)?
- [ ] Token está salvo no localStorage após login?
- [ ] Requisição para `/api/games` tem header `Authorization`?
- [ ] CORS está configurado no backend?
- [ ] Token não está expirado?

---

## 🆘 Ainda Com Problemas?

1. **Limpe tudo e comece do zero:**
```javascript
localStorage.clear();
window.location.href = '/login';
```

2. **Verifique os logs do backend:**
   - O backend está recebendo o header Authorization?
   - O token está sendo validado corretamente?
   - Há algum erro de CORS?

3. **Teste o endpoint diretamente:**
```bash
# Faça login e pegue o token
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"senha"}' \
  | jq -r '.token')

# Teste o endpoint de jogos
curl http://localhost:8000/api/games \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Código Atualizado

Os seguintes arquivos foram atualizados com melhor tratamento de erros e logs:

1. **`src/lib/api.ts`** - Logs detalhados de requisições
2. **`src/store/user-store.ts`** - Logs de login e loadFromStorage
3. **`src/app/lobby/page.tsx`** - Tratamento de erro 401 específico

Recarregue a aplicação e verifique os logs no console!

