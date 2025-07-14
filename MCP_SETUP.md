# Model Context Protocol (MCP) Integration

AI Agent Studio now includes Model Context Protocol (MCP) integration to provide standardized access to AI tools and documentation.

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables AI applications to securely connect to local and remote data sources. It provides:

- **Tools**: Execute actions (like creating projects, installing dependencies)
- **Resources**: Access data (like documentation, examples)
- **Prompts**: Dynamic, context-aware workflows
- **Sampling**: Servers can make their own LLM requests

## Available MCP Servers

### 1. Documentation Server (`ai-agent-studio-docs`)
- Search documentation across all AI agent frameworks
- Get framework information and comparisons
- Access quick references and best practices

**Tools:**
- `search-docs`: Search documentation with query and optional framework filter
- `get-framework-info`: Get detailed information about a specific framework
- `compare-frameworks`: Compare multiple frameworks

**Resources:**
- `frameworks/list`: List of all supported frameworks
- `quick-reference`: Quick reference for AI agent development
- `best-practices`: Best practices guide

### 2. SYMindX Server (`ai-agent-studio-symindx`)
- Tools for building emotionally intelligent AI agents
- Personality configuration and emotional analysis
- Context management capabilities

**Tools:**
- `configure-personality`: Configure agent personality traits
- `manage-context`: Set up context awareness
- `analyze-emotion`: Analyze emotional context of text

**Resources:**
- `symindx/personality-templates`: Pre-configured personality templates
- `symindx/emotional-responses`: Examples of emotionally aware responses

## How to Use MCP Servers

### Method 1: VS Code Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "AI Agent Studio: Manage MCP Servers"
3. Choose "Add MCP Server to Workspace"
4. Select the server you want to add

### Method 2: Manual Configuration
Create a `.vscode/mcp.json` file in your workspace:

```json
{
  "servers": {
    "ai-agent-studio-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/ai-agent-studio/out/mcp/servers/documentationServer.js"],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "ai-agent-studio-symindx": {
      "type": "stdio", 
      "command": "node",
      "args": ["./node_modules/ai-agent-studio/out/mcp/servers/symindxServer.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Method 3: Dashboard Integration
1. Open AI Agent Studio Dashboard
2. Click "Manage MCP Servers" in the MCP Integration section
3. Follow the prompts to add servers

## Using with GitHub Copilot Agent Mode

Once MCP servers are configured, they become available in GitHub Copilot's agent mode:

1. Enable Agent mode in GitHub Copilot
2. Your MCP tools will appear in the tools list
3. Use `#` to reference specific tools in prompts

Example prompts:
- "Use #search-docs to find LangGraph examples"
- "Help me configure a SYMindX agent personality using #configure-personality"
- "Compare CrewAI and AutoGen using #compare-frameworks"

## Prompts Available

### Documentation Server Prompts
- `/select-framework`: Get recommendations for framework selection
- `/migration-guide`: Help migrating between frameworks

### SYMindX Server Prompts
- `/create-emotional-agent`: Guide for creating emotionally intelligent agents
- `/train-emotional-intelligence`: Training guide for emotional awareness

## Extending MCP Integration

The extension provides a base framework for creating additional MCP servers:

1. Extend `BaseFrameworkServer` class
2. Implement framework-specific tools, resources, and prompts
3. Register the server in `SimpleMCPProvider`

See `src/mcp/servers/symindxServer.ts` for a complete example.

## Troubleshooting

### MCP Server Not Starting
- Check that Node.js is installed and accessible
- Verify the server paths in mcp.json are correct
- Check VS Code's Output panel for error messages

### Tools Not Appearing in Agent Mode
- Ensure the MCP server is properly configured
- Restart VS Code after adding servers
- Check that agent mode is enabled in GitHub Copilot

### Performance Issues
- MCP servers include caching for documentation searches
- Consider limiting the number of active servers
- Use specific framework filters to reduce search scope

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [VS Code MCP Integration Guide](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [AI Agent Studio Documentation](https://github.com/ai-agent-studio/vscode-extension)