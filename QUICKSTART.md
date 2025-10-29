# 🚀 Quick Start Guide - Cunca

## Instalação Rápida

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com suas URLs
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

### 4. Acessar aplicação

Abra [http://localhost:3000](http://localhost:3000)

---

## Ou use o script automático:

```bash
chmod +x start.sh
./start.sh
```

---

## 📱 Primeiros Passos

1. **Criar conta**: Acesse `/register` e crie uma conta
2. **Fazer login**: Use suas credenciais em `/login`
3. **Lobby**: Você será redirecionado para `/lobby`
4. **Criar sala**: Clique em "Criar Nova Sala"
5. **Entrar na sala**: Clique em "Entrar" em qualquer sala
6. **Chat**: Envie mensagens no chat da sala

---

## 🔧 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint
```

---

## 📚 Documentação

- **README.md** - Visão geral do projeto
- **SETUP.md** - Guia completo de instalação
- **DEVELOPMENT.md** - Guia para desenvolvedores
- **ARCHITECTURE.md** - Arquitetura do projeto
- **API_CONTRACT.md** - Contrato de API
- **PROJECT_SUMMARY.md** - Resumo completo

---

## 🐛 Problemas Comuns

### Porta 3000 já em uso

```bash
# Use outra porta
PORT=3001 npm run dev
```

### Erro ao conectar com backend

1. Certifique-se de que o backend está rodando
2. Verifique as URLs em `.env.local`
3. Verifique CORS no backend

### Erros de TypeScript

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json .next
npm install
```

---

## ✨ Próximos Passos

Após testar o básico:

1. Leia **DEVELOPMENT.md** para convenções de código
2. Leia **ARCHITECTURE.md** para entender a estrutura
3. Comece a implementar a lógica do seu jogo de cartas
4. Adicione novos componentes conforme necessário

---

**Boa sorte! 🎴**

