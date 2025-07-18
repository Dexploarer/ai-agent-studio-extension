import * as vscode from 'vscode';
import * as path from 'path';
import { symindxProjectTemplate } from './templates/symindxTemplate';
import { openaiProjectTemplate } from './templates/openaiTemplate';
import { vercelAiProjectTemplate } from './templates/vercelAiTemplate';

interface ProjectTemplate {
    packageJson: (projectName: string) => any;
    indexTs: (projectName: string) => string;
    envExample: () => string;
    readme: (projectName: string) => string;
    tsconfigJson?: () => any;
    jestConfig?: () => any;
    testExample?: (projectName: string) => string;
}

interface ProjectCreationOptions {
    framework: string;
    projectName: string;
    projectPath: vscode.Uri;
    includeTests?: boolean;
    includeExamples?: boolean;
}

export class ProjectManager {
    private templates: Map<string, ProjectTemplate> = new Map();

    constructor() {
        this.initializeTemplates();
    }

    private initializeTemplates() {
        this.templates.set('SYMindX', symindxProjectTemplate);
        this.templates.set('OpenAI Agents SDK', openaiProjectTemplate);
        this.templates.set('Vercel AI SDK 5 Beta', vercelAiProjectTemplate);
        
        // Add more templates as they're created
        this.templates.set('ElizaOS', {
            packageJson: (projectName: string) => ({
                name: projectName,
                version: "1.0.0",
                description: "ElizaOS Multi-Agent Project",
                type: "module",
                scripts: {
                    build: "tsc",
                    start: "node dist/index.js",
                    dev: "tsx src/index.ts"
                },
                dependencies: {
                    "@elizaos/core": "latest",
                    "@elizaos/plugin-node": "latest"
                },
                devDependencies: {
                    "typescript": "^5.0.0",
                    "tsx": "^4.0.0"
                }
            }),
            indexTs: (projectName: string) => `import { AgentRuntime, Character, ModelProviderName } from "@elizaos/core";

const character: Character = {
    name: "${projectName}",
    username: "${projectName.toLowerCase()}",
    plugins: [],
    clients: [],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        secrets: {},
        voice: {
            model: "en_US-hfc_female-medium"
        }
    },
    system: "You are ${projectName}, a helpful AI assistant.",
    bio: [
        "An AI agent created using ElizaOS",
        "Designed to assist users with various tasks",
        "Built with multi-agent capabilities"
    ],
    lore: [
        "Created to demonstrate ElizaOS capabilities",
        "Focuses on helpful and accurate responses"
    ],
    messageExamples: [
        [
            { user: "{{user1}}", content: { text: "Hello!" } },
            { user: "${projectName}", content: { text: "Hello! How can I help you today?" } }
        ]
    ],
    postExamples: [
        "Just helped a user solve a complex problem!",
        "Learning new things every day through interactions."
    ],
    topics: ["technology", "assistance", "problem-solving"],
    style: {
        all: ["helpful", "informative", "friendly"],
        chat: ["conversational", "supportive"],
        post: ["engaging", "positive"]
    },
    adjectives: ["helpful", "intelligent", "reliable", "friendly"]
};

async function startAgent() {
    try {
        const runtime = new AgentRuntime({
            databaseAdapter: undefined, // Use default
            token: process.env.OPENAI_API_KEY!,
            modelProvider: ModelProviderName.OPENAI,
            character,
            plugins: []
        });

        await runtime.initialize();
        console.log("${projectName} agent started successfully!");
        
        // Keep the process running
        process.on('SIGINT', () => {
            console.log("Shutting down ${projectName} agent...");
            process.exit(0);
        });
        
    } catch (error) {
        console.error("Failed to start agent:", error);
        process.exit(1);
    }
}

startAgent();`,
            envExample: () => `OPENAI_API_KEY=your_openai_api_key_here
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
DISCORD_APPLICATION_ID=your_discord_app_id
DISCORD_API_TOKEN=your_discord_token`,
            readme: (projectName: string) => `# ${projectName}

An ElizaOS-powered multi-agent system for autonomous AI interactions.

## Features

- Multi-agent simulation capabilities
- Social media integration (Twitter, Discord)
- Autonomous decision making
- Character-based personalities
- Plugin system for extensibility

## Setup

1. Install dependencies: \`npm install\`
2. Configure environment variables in \`.env\`
3. Run: \`npm run dev\`

## Learn More

- [ElizaOS Documentation](https://github.com/elizaos/eliza)
- [Character Configuration](https://elizaos.github.io/eliza/docs/core/characterfile)`
        });

        this.templates.set('LangGraph', {
            packageJson: (projectName: string) => ({
                name: projectName,
                version: "1.0.0",
                description: "LangGraph Stateful Agent Project",
                type: "module",
                scripts: {
                    build: "tsc",
                    start: "node dist/index.js",
                    dev: "tsx src/index.ts"
                },
                dependencies: {
                    "@langchain/langgraph": "latest",
                    "@langchain/core": "latest",
                    "@langchain/openai": "latest"
                },
                devDependencies: {
                    "typescript": "^5.0.0",
                    "tsx": "^4.0.0"
                }
            }),
            indexTs: (projectName: string) => `import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

interface AgentState {
    messages: Array<{ role: string; content: string }>;
    step: number;
}

const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7
});

async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
    const response = await model.invoke(state.messages);
    return {
        messages: [...state.messages, { role: "assistant", content: response.content as string }],
        step: state.step + 1
    };
}

function shouldContinue(state: AgentState): "agent" | typeof END {
    if (state.step >= 10) {
        return END;
    }
    return "agent";
}

// Create the graph
const workflow = new StateGraph<AgentState>({
    channels: {
        messages: { 
            value: (prev: any[], next: any[]) => next,
            default: () => []
        },
        step: {
            value: (prev: number, next: number) => next,
            default: () => 0
        }
    }
});

workflow.addNode("agent", agentNode);
workflow.setEntryPoint("agent");
workflow.addConditionalEdges("agent", shouldContinue);

export const ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Graph = workflow.compile();

// Example usage
async function main() {
    const result = await ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Graph.invoke({
        messages: [{ role: "user", content: "Hello, I need help with planning a project." }],
        step: 0
    });
    
    console.log("Final result:", result);
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
    main().catch(console.error);
}`,
            envExample: () => `OPENAI_API_KEY=your_openai_api_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_api_key`,
            readme: (projectName: string) => `# ${projectName}

A LangGraph-powered stateful agent with workflow management.

## Features

- Stateful conversation management
- Graph-based workflow execution
- Conditional flow control
- Integration with LangChain ecosystem

## Setup

1. Install: \`npm install\`
2. Configure \`.env\`
3. Run: \`npm run dev\`

## Learn More

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)`
        });
    }

    public async createProject(options: ProjectCreationOptions): Promise<void> {
        const template = this.templates.get(options.framework);
        if (!template) {
            throw new Error(`Template for framework "${options.framework}" not found`);
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Creating ${options.framework} project: ${options.projectName}`,
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 10, message: 'Creating project structure...' });
                
                // Create main project directory
                await vscode.workspace.fs.createDirectory(options.projectPath);
                
                progress.report({ increment: 20, message: 'Generating package.json...' });
                
                // Create package.json
                const packageJson = template.packageJson(options.projectName);
                await this.writeJsonFile(
                    vscode.Uri.joinPath(options.projectPath, 'package.json'),
                    packageJson
                );

                progress.report({ increment: 30, message: 'Creating source files...' });
                
                // Create src directory
                const srcPath = vscode.Uri.joinPath(options.projectPath, 'src');
                await vscode.workspace.fs.createDirectory(srcPath);
                
                // Create main TypeScript file
                const indexTs = template.indexTs(options.projectName);
                await this.writeTextFile(
                    vscode.Uri.joinPath(srcPath, 'index.ts'),
                    indexTs
                );

                progress.report({ increment: 50, message: 'Setting up configuration...' });
                
                // Create .env.example
                const envExample = template.envExample();
                await this.writeTextFile(
                    vscode.Uri.joinPath(options.projectPath, '.env.example'),
                    envExample
                );

                // Create tsconfig.json if template provides it
                if (template.tsconfigJson) {
                    const tsconfigJson = template.tsconfigJson();
                    await this.writeJsonFile(
                        vscode.Uri.joinPath(options.projectPath, 'tsconfig.json'),
                        tsconfigJson
                    );
                }

                progress.report({ increment: 70, message: 'Creating documentation...' });
                
                // Create README.md
                const readme = template.readme(options.projectName);
                await this.writeTextFile(
                    vscode.Uri.joinPath(options.projectPath, 'README.md'),
                    readme
                );

                // Create .gitignore
                const gitignore = `node_modules/
dist/
.env
.DS_Store
*.log
coverage/
.nyc_output/`;
                await this.writeTextFile(
                    vscode.Uri.joinPath(options.projectPath, '.gitignore'),
                    gitignore
                );

                if (options.includeTests && template.jestConfig && template.testExample) {
                    progress.report({ increment: 80, message: 'Setting up tests...' });
                    
                    // Create jest.config.js
                    const jestConfig = template.jestConfig();
                    await this.writeJsonFile(
                        vscode.Uri.joinPath(options.projectPath, 'jest.config.json'),
                        jestConfig
                    );

                    // Create test directory and example test
                    const testPath = vscode.Uri.joinPath(srcPath, '__tests__');
                    await vscode.workspace.fs.createDirectory(testPath);
                    
                    const testExample = template.testExample(options.projectName);
                    await this.writeTextFile(
                        vscode.Uri.joinPath(testPath, 'index.test.ts'),
                        testExample
                    );
                }

                progress.report({ increment: 90, message: 'Finalizing...' });
                
                // Create additional directories
                await vscode.workspace.fs.createDirectory(
                    vscode.Uri.joinPath(options.projectPath, 'dist')
                );

                progress.report({ increment: 100, message: 'Project created successfully!' });
                
                // Show success message with next steps
                const action = await vscode.window.showInformationMessage(
                    `✅ ${options.framework} project "${options.projectName}" created successfully!`,
                    'Open Project',
                    'Install Dependencies',
                    'View README'
                );

                if (action === 'Open Project') {
                    await vscode.commands.executeCommand('vscode.openFolder', options.projectPath, true);
                } else if (action === 'Install Dependencies') {
                    const terminal = vscode.window.createTerminal({
                        name: `${options.projectName} Setup`,
                        cwd: options.projectPath.fsPath
                    });
                    terminal.show();
                    terminal.sendText('npm install');
                } else if (action === 'View README') {
                    const readmePath = vscode.Uri.joinPath(options.projectPath, 'README.md');
                    await vscode.window.showTextDocument(readmePath);
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                vscode.window.showErrorMessage(`Failed to create project: ${errorMessage}`);
                throw error;
            }
        });
    }

    public getAvailableFrameworks(): string[] {
        return Array.from(this.templates.keys());
    }

    public hasTemplate(framework: string): boolean {
        return this.templates.has(framework);
    }

    private async writeTextFile(uri: vscode.Uri, content: string): Promise<void> {
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
    }

    private async writeJsonFile(uri: vscode.Uri, content: any): Promise<void> {
        const jsonString = JSON.stringify(content, null, 2);
        await this.writeTextFile(uri, jsonString);
    }

    public async installFramework(frameworkName: string, projectPath?: string): Promise<void> {
        const packageMap: { [key: string]: { package: string, isPython: boolean } } = {
            'OpenAI Agents SDK': { package: 'openai', isPython: false },
            'ElizaOS': { package: '@elizaos/core @elizaos/plugin-node', isPython: false },
            'LangGraph': { package: '@langchain/langgraph @langchain/core @langchain/openai', isPython: false },
            'CrewAI': { package: 'crewai', isPython: true },
            'AutoGen': { package: 'ag2', isPython: true },
            'SYMindX': { package: '@symbaex/symindx', isPython: false },
            'LangChain': { package: 'langchain @langchain/openai', isPython: false },
            'Semantic Kernel': { package: '@microsoft/semantic-kernel', isPython: false },
            'Vercel AI SDK 5 Beta': { package: 'ai@beta @ai-sdk/openai @ai-sdk/anthropic zod', isPython: false },
            'SmolAgents': { package: 'smol-agents', isPython: false },
            'Google ADK': { package: '@google/generative-ai', isPython: false },
            'Pydantic AI': { package: 'pydantic-ai', isPython: true }
        };

        const framework = packageMap[frameworkName];
        if (!framework) {
            vscode.window.showErrorMessage(`Framework "${frameworkName}" not found in installation map`);
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('Please open a project folder first');
            return;
        }

        const targetPath = projectPath || workspaceFolders[0].uri.fsPath;
        
        const terminal = vscode.window.createTerminal({
            name: `Install ${frameworkName}`,
            cwd: targetPath
        });
        
        terminal.show();
        
        if (framework.isPython) {
            terminal.sendText(`pip install ${framework.package}`);
        } else {
            terminal.sendText(`npm install ${framework.package}`);
        }
        
        vscode.window.showInformationMessage(
            `Installing ${frameworkName}... Check the terminal for progress.`
        );
    }
}