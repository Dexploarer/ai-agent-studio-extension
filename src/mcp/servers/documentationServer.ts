// Documentation MCP Server Implementation
// This provides access to AI agent framework documentation

export class DocumentationServer {
    private frameworkData = {
        'OpenAI Agents SDK': {
            name: 'OpenAI Agents SDK',
            url: 'https://github.com/openai/agents-sdk',
            description: 'Official OpenAI SDK for building AI agents',
            installation: 'npm install openai',
            quickStart: `import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello!" }]
});`
        },
        'SYMindX': {
            name: 'SYMindX',
            url: 'https://github.com/SYMBaiEX/SYMindX',
            description: 'Emotionally intelligent AI agent framework',
            installation: 'npm install @symbaex/symindx',
            quickStart: `import { SYMindXAgent } from '@symbaex/symindx';

const agent = new SYMindXAgent({
    emotionalProfile: { empathyLevel: 0.8 }
});

const response = await agent.processInput('I need help');`
        },
        'ElizaOS': {
            name: 'ElizaOS',
            url: 'https://github.com/elizaos/eliza',
            description: 'Multi-agent simulation framework',
            installation: 'npm install @elizaos/core',
            quickStart: `import { AgentRuntime, Character } from '@elizaos/core';

const character: Character = {
    name: 'MyAgent',
    // ... character configuration
};

const runtime = new AgentRuntime({ character });`
        },
        'LangGraph': {
            name: 'LangGraph',
            url: 'https://langchain-ai.github.io/langgraph/',
            description: 'Stateful multi-actor applications with LLMs',
            installation: 'npm install @langchain/langgraph',
            quickStart: `import { StateGraph } from '@langchain/langgraph';

const graph = new StateGraph({
    // Define nodes and edges
});

const app = graph.compile();`
        }
    };

    async getFrameworkDocs(framework: string, section: 'overview' | 'installation' | 'quickstart' | 'all' = 'all'): Promise<string> {
        const data = this.frameworkData[framework as keyof typeof this.frameworkData];
        
        if (!data) {
            return `Framework "${framework}" not found. Available frameworks: ${Object.keys(this.frameworkData).join(', ')}`;
        }

        let content = '';
        
        if (section === 'overview' || section === 'all') {
            content += `# ${data.name}\n\n${data.description}\n\n**Documentation:** ${data.url}\n\n`;
        }
        
        if (section === 'installation' || section === 'all') {
            content += `## Installation\n\n\`\`\`bash\n${data.installation}\n\`\`\`\n\n`;
        }
        
        if (section === 'quickstart' || section === 'all') {
            content += `## Quick Start\n\n\`\`\`typescript\n${data.quickStart}\n\`\`\`\n\n`;
        }

        return content.trim();
    }

    async searchDocumentation(query: string): Promise<string> {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [key, data] of Object.entries(this.frameworkData)) {
            const searchableText = `${data.name} ${data.description} ${data.quickStart}`.toLowerCase();
            
            if (searchableText.includes(queryLower)) {
                results.push({
                    framework: data.name,
                    key,
                    description: data.description,
                    url: data.url
                });
            }
        }
        
        if (results.length === 0) {
            return `No documentation found for query: "${query}"`;
        }
        
        return results.map(result => 
            `**${result.framework}** (${result.key})\n${result.description}\n📖 ${result.url}`
        ).join('\n\n');
    }

    async compareFrameworks(frameworks: string[]): Promise<string> {
        const validFrameworks = frameworks.filter(f => this.frameworkData[f as keyof typeof this.frameworkData]);
        
        if (validFrameworks.length < 2) {
            return `Need at least 2 valid frameworks. Available: ${Object.keys(this.frameworkData).join(', ')}`;
        }
        
        let comparison = `# Framework Comparison\n\n`;
        
        for (const framework of validFrameworks) {
            const data = this.frameworkData[framework as keyof typeof this.frameworkData];
            comparison += `## ${data.name}\n`;
            comparison += `**Description:** ${data.description}\n`;
            comparison += `**Installation:** \`${data.installation}\`\n`;
            comparison += `**Documentation:** ${data.url}\n\n`;
        }
        
        return comparison;
    }

    async getAvailableFrameworks(): Promise<any[]> {
        return Object.entries(this.frameworkData).map(([key, data]) => ({
            key,
            name: data.name,
            description: data.description,
            url: data.url
        }));
    }

    start(): void {
        console.log('[Documentation Server] Started successfully');
    }
}

export const documentationMcpServer = new DocumentationServer();