# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Agent Studio is a VS Code extension that provides comprehensive development tools for 12+ AI agent frameworks including OpenAI Agents SDK, ElizaOS, LangGraph, CrewAI, AutoGen, SYMindX, and more.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Compile TypeScript (required before running)
npm run compile

# Watch mode for development
npm run watch

# Run linting
npm run lint

# Run tests
npm test
```

### Building and Publishing
```bash
# Full build (use platform-specific script)
./build.sh    # Linux/Mac
build.bat     # Windows

# Package as VSIX
npm run package

# Publish to marketplace
npm run publish
```

## Architecture Overview

The extension follows a modular architecture with these key components:

1. **Framework Management** (`src/framework/`): Handles detection, installation, and management of AI agent frameworks
   - `frameworkManager.ts`: Central orchestrator for all framework operations
   - `frameworkDetector.ts`: Auto-detects frameworks in user workspace
   - `frameworkInstaller.ts`: Handles framework installation

2. **VS Code Integration**:
   - Commands: All features exposed through `agent.` prefixed commands
   - Tree Views: Custom providers for project navigation, monitoring, and documentation
   - Webviews: Dashboard and monitoring interfaces

3. **Context7 Integration** (`src/context7/`): Provides real-time documentation fetching
   - Uses WebSocket connections for live updates
   - Tree view provider for documentation navigation

4. **Project Templates** (`src/templates/`): Manages 25+ project templates across frameworks
   - Templates stored in `examples/` directory by framework

## Key Development Patterns

1. **Command Registration**: All commands registered in `extension.ts` with `agent.` prefix
2. **Tree Data Providers**: Extend `vscode.TreeDataProvider` for custom views
3. **Configuration**: Access via `vscode.workspace.getConfiguration('agentStudio')`
4. **Error Handling**: Use VS Code's output channels and error messages
5. **Activation Events**: Extension activates on specific file types and commands

## Testing Approach

- Unit tests in `src/test/` directory
- Use VS Code's test runner via `npm test`
- Mock VS Code API for unit testing
- Integration tests run in VS Code instance

## Important Files

- `package.json`: Extension manifest with all commands, configurations, and contributions
- `src/extension.ts`: Main entry point and command registration
- `src/framework/frameworkManager.ts`: Core framework management logic
- `snippets/*.json`: Language-specific code snippets
- `examples/`: Framework-specific example projects and templates

## Latest Additions

### SYMindX Framework Integration
- Full SYMindX framework support with emotional intelligence features
- SYMindX-specific code snippets and templates
- Project template in `examples/symindx/` with emotional assistant example
- Configuration support for emotional states, personality traits, and multi-platform deployment

### UI/UX Improvements
- Status bar integration showing framework and agent counts
- Intelligent framework detection and installation suggestions
- Enhanced context menus and keyboard shortcuts (Ctrl+Alt+A + secondary key)
- Better progress notifications and error handling
- Improved tree view icons and contextual actions