#!/bin/bash

echo "========================================"
echo "  Soori Academy - Firebase Deploy"
echo "========================================"

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not installed!"
    echo "Run: npm install -g firebase-tools"
    exit 1
fi

# Install functions dependencies
echo ""
echo "📦 Installing Functions dependencies..."
cd functions
npm install
cd ..

# Install web dependencies
echo ""
echo "📦 Installing Web dependencies..."
cd web
npm install

# Build web
echo ""
echo "🔨 Building Web..."
npm run build
cd ..

# Deploy
echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy

echo ""
echo "========================================"
echo "  ✅ Deployment Complete!"
echo "========================================"
echo ""
echo "Website: https://soori-academy.web.app/"
echo "Admin:   https://soori-academy.web.app/admin"
echo ""
echo "Password: soori2024"
echo ""