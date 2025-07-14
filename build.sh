#!/bin/bash

# Build script for AI Agent Studio Extension
echo "🚀 Building AI Agent Studio Extension..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -rf dist/
rm -f *.vsix

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Lint the code
echo "🔍 Linting code..."
npm run lint

# Compile TypeScript
echo "⚙️ Compiling TypeScript..."
npm run compile

# Run tests
echo "🧪 Running tests..."
npm run test

# Package the extension
echo "📦 Packaging extension..."
npm run package

echo "✅ Build completed successfully!"
echo "📦 Extension packaged as: ai-agent-studio-1.0.0.vsix"
echo ""
echo "🎉 To install the extension:"
echo "   code --install-extension ai-agent-studio-1.0.0.vsix"
echo ""
echo "🔧 To publish the extension:"
echo "   vsce publish"