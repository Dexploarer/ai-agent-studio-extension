import * as vscode from 'vscode';

export interface AIFramework {
    id: string;
    name: string;
    displayName: string;
    description: string;
    languages: string[];
    documentationUrl: string;
    packageName?: string;
    isPython?: boolean;
}

export interface ServerMetadata {
    id: string;
    name: string;
    description: string;
    definition: vscode.McpServerDefinition;
}

export interface DocSearchResult {
    title: string;
    url: string;
    snippet: string;
    framework?: string;
}

export interface AgentTemplate {
    id: string;
    name: string;
    description: string;
    framework: string;
    language: 'typescript' | 'javascript' | 'python';
    files: {
        path: string;
        content: string;
    }[];
}