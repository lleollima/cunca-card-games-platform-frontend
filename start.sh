#!/bin/bash

# Quick Start - Cunca Frontend
# Este script ajuda a iniciar o projeto rapidamente

echo "🎴 Cunca - Quick Start"
echo "======================"
echo ""

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Dependências não encontradas. Instalando..."
    npm install

    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi

    echo "✅ Dependências instaladas!"
    echo ""
fi

# Verifica .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local não encontrado. Criando..."
    cp .env.example .env.local
    echo "✅ .env.local criado!"
    echo ""
    echo "⚙️  Configure as URLs do backend em .env.local antes de continuar."
    echo ""
    read -p "Pressione ENTER para continuar..."
fi

echo "🚀 Iniciando servidor de desenvolvimento..."
echo ""
echo "📍 Aplicação estará disponível em: http://localhost:3000"
echo ""
echo "✨ Dicas:"
echo "  - Login/Registro: http://localhost:3000/login"
echo "  - Lobby: http://localhost:3000/lobby"
echo "  - Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev

