#!/bin/bash

# Script de setup do projeto Cunca
# Este script instala todas as dependências e configura o projeto

echo "🎴 Cunca - Configurando projeto..."
echo ""

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo ""

# Instala dependências
echo "📦 Instalando dependências..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "✅ Dependências instaladas com sucesso!"
echo ""

# Verifica se .env.local existe
if [ ! -f .env.local ]; then
    echo "⚠️  Arquivo .env.local não encontrado"
    echo "Copiando .env.example para .env.local..."
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado"
    echo ""
    echo "📝 Não se esqueça de configurar as URLs do backend em .env.local"
else
    echo "✅ Arquivo .env.local já existe"
fi

echo ""
echo "✨ Setup concluído com sucesso!"
echo ""
echo "Para iniciar o projeto em modo de desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Para fazer o build para produção:"
echo "  npm run build"
echo "  npm start"
echo ""
echo "O projeto estará disponível em: http://localhost:3000"
echo ""

