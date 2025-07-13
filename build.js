#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building AI Agent Studio Extension...\n');

// Build steps
const buildSteps = [
    {
        name: 'Clean previous build',
        command: process.platform === 'win32' ? 'rmdir /s /q out 2>nul' : 'rm -rf out',
        optional: true
    },
    {
        name: 'Install dependencies',
        command: 'npm install'
    },
    {
        name: 'Lint code',
        command: 'npm run lint'
    },
    {
        name: 'Compile TypeScript',
        command: 'npm run compile'
    },
    {
        name: 'Run tests',
        command: 'npm test',
        optional: true
    },
    {
        name: 'Package extension',
        command: 'npm run package'
    }
];

// Execute build steps
let success = true;
for (const step of buildSteps) {
    try {
        console.log(`📦 ${step.name}...`);
        execSync(step.command, { stdio: 'inherit' });
        console.log(`✅ ${step.name} completed\n`);
    } catch (error) {
        if (step.optional) {
            console.log(`⚠️  ${step.name} failed (optional step)\n`);
        } else {
            console.error(`❌ ${step.name} failed:`, error.message);
            success = false;
            break;
        }
    }
}

if (success) {
    console.log('🎉 Build completed successfully!');
    console.log('📦 Extension package created: ai-agent-studio-1.0.0.vsix');
    console.log('\nTo install:');
    console.log('code --install-extension ai-agent-studio-1.0.0.vsix');
} else {
    console.error('💥 Build failed!');
    process.exit(1);
}