#!/bin/bash

echo "🚀 Setting up your Whop Next.js App..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created! Please edit it with your Whop credentials."
else
    echo "✅ .env file already exists."
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Whop credentials"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your app"
echo ""
echo "For help, check the README.md file or visit https://dev.whop.com"
