import * as vscode from 'vscode';

interface ServerMetadata {
    id: string;
    name: string;
    description: string;
    definition: vscode.McpServerDefinition;
}

export class SimpleMCPProvider {
    private servers: Map<string, ServerMetadata> = new Map();

    constructor(private context: vscode.ExtensionContext) {
        this.initializeServers();
    }

    private initializeServers() {
        // Documentation MCP Server
        this.servers.set('ai-agent-studio-docs', {
            id: 'ai-agent-studio-docs',
            name: 'AI Agent Studio Documentation',
            description: 'Access documentation for all AI agent frameworks',
            definition: {
                command: 'node',
                args: [this.context.asAbsolutePath('out/mcp/servers/documentationServer.js')]
            } as any
        });

        // SYMindX MCP Server
        this.servers.set('ai-agent-studio-symindx', {
            id: 'ai-agent-studio-symindx',
            name: 'SYMindX MCP Server',
            description: 'Tools for building emotionally intelligent AI agents',
            definition: {
                command: 'node',
                args: [this.context.asAbsolutePath('out/mcp/servers/symindxServer.js')]
            } as any
        });
    }

    async getAvailableServers(): Promise<ServerMetadata[]> {
        return Array.from(this.servers.values());
    }

    getServer(id: string): ServerMetadata | undefined {
        return this.servers.get(id);
    }
}