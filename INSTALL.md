# AI Agent Studio Extension Installation & Usage Guide

## 📋 Prerequisites

Before installing the AI Agent Studio extension, ensure you have:

- **VS Code** 1.85.0 or later
- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Git** for version control
- **Context7 MCP** (optional, for real-time documentation)

## 🛠 Installation Methods

### Method 1: From VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "AI Agent Studio"
4. Click Install

### Method 2: From VSIX File
1. Download the latest `ai-agent-studio-1.0.0.vsix` file
2. Open VS Code
3. Run command: `code --install-extension ai-agent-studio-1.0.0.vsix`

### Method 3: Development Installation
1. Clone the repository
2. Run the build script:
   ```bash
   # Linux/Mac
   chmod +x build.sh
   ./build.sh
   
   # Windows
   build.bat
   ```
3. Install the generated VSIX file

## 🚀 Quick Start Guide

### 1. First Time Setup
1. Open VS Code
2. Press `Ctrl+Shift+P` to open Command Palette
3. Type "AI Agent Studio: Open Agent Dashboard"
4. Follow the welcome wizard

### 2. Create Your First Agent
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `AI Agent Studio: Create New Agent Project`
3. Select a framework (OpenAI Agents SDK, ElizaOS, etc.)
4. Choose a template
5. Enter project details
6. Start coding!

### 3. Use Framework-Specific Snippets
- **TypeScript/JavaScript**: Type `openai-agent`, `eliza-character`, etc.
- **Python**: Type `crew-agent`, `autogen-group`, etc.
- **JSON**: Type `openai-config`, `eliza-config`, etc.

## 🔧 Framework-Specific Setup

### OpenAI Agents SDK
```bash
npm install @openai/agents-sdk
```

### ElizaOS
```bash
npm install @elizaos/core
```

### CrewAI
```bash
pip install crewai crewai-tools
```

### LangGraph
```bash
pip install langgraph langchain
```

### AutoGen
```bash
pip install ag2
```

### SmolAgents
```bash
pip install smolagents
```

## 🌐 Context7 Integration Setup

### Automatic Setup (Recommended)
The extension automatically detects and uses Context7 if available.

### Manual Setup
1. Install Context7 MCP:
   ```bash
   npm install -g @upstash/context7-mcp
   ```

2. Configure in VS Code settings:
   ```json
   {
     "aiAgentStudio.context7.enabled": true,
     "aiAgentStudio.context7.apiKey": "your-api-key"
   }
   ```

### Alternative: Remote Context7
```json
{
  "mcp.servers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

## 📝 Usage Examples

### Creating an OpenAI Agent
1. Create new file: `my-agent.ts`
2. Type: `openai-agent`
3. Press Tab to expand snippet
4. Customize the agent

### Creating a CrewAI Team
1. Create new file: `my-crew.py`
2. Type: `crew-team`
3. Press Tab to expand snippet
4. Configure agents and tasks

### Searching Documentation
1. Right-click in editor
2. Select "Search Context7 Documentation"
3. Enter search query
4. View results in sidebar

## 🎛 Configuration Options

### Extension Settings
```json
{
  "aiAgentStudio.defaultFramework": "openai-agents-sdk",
  "aiAgentStudio.context7.enabled": true,
  "aiAgentStudio.monitoring.enabled": true,
  "aiAgentStudio.autoCompleteEnabled": true,
  "aiAgentStudio.templatePath": "/path/to/custom/templates"
}
```

### Framework-Specific Settings
```json
{
  "aiAgentStudio.frameworks": {
    "openai-agents-sdk": {
      "apiKey": "your-openai-key",
      "model": "gpt-4o",
      "temperature": 0.7
    },
    "elizaos": {
      "character": "path/to/character.json",
      "providers": ["openai", "anthropic"]
    }
  }
}
```

## 🔧 Advanced Features

### Custom Templates
1. Create template directory
2. Add framework-specific templates
3. Configure path in settings
4. Use in project creation

### Agent Monitoring
1. Enable monitoring in settings
2. Use "Start Agent Monitoring" command
3. View metrics in dashboard
4. Debug agent behavior

### Multi-Agent Orchestration
1. Create multi-agent project
2. Define agent roles
3. Configure communication
4. Monitor system performance

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Check VS Code version (1.85.0+)
- Restart VS Code
- Check error console

**Context7 not working:**
- Verify MCP installation
- Check network connection
- Review configuration

**Snippets not appearing:**
- Check file extension
- Verify language mode
- Restart VS Code

**Framework not detected:**
- Check package.json
- Install dependencies
- Refresh framework status

### Support Channels
- GitHub Issues: [ai-agent-studio/vscode-extension](https://github.com/ai-agent-studio/vscode-extension/issues)
- Discord: [AI Agent Studio Community](https://discord.gg/ai-agent-studio)
- Documentation: [ai-agent-studio.github.io](https://ai-agent-studio.github.io)

## 🔄 Updates

### Automatic Updates
- Extension updates automatically via VS Code
- Check for updates in Extensions tab

### Manual Updates
- Download latest VSIX
- Install using `code --install-extension`

## 📊 Performance Tips

1. **Disable unused features** in settings
2. **Use specific snippets** instead of general ones
3. **Configure Context7 caching** for better performance
4. **Limit monitoring scope** to active projects

## 🤝 Contributing

Want to contribute? See our [Contributing Guide](CONTRIBUTING.md) for:
- Development setup
- Code standards
- Pull request process
- Issue reporting

## 📄 License

This extension is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

🎉 **Happy Agent Development!** 🤖