import * as vscode from 'vscode';
import { documentationMcpServer } from './mcp/servers/documentationServer';

// Agent code generators
export function generateOpenAIAgent(agentName: string): string {
    return `import OpenAI from 'openai';

class ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private openai: OpenAI;
    private conversationHistory: Array<{ role: string; content: string }> = [];

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        this.conversationHistory.push({
            role: 'system',
            content: 'You are ${agentName}, a helpful AI assistant.'
        });
    }

    async chat(message: string): Promise<string> {
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: this.conversationHistory,
            temperature: 0.7
        });

        const assistantMessage = response.choices[0].message.content || '';
        
        this.conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    }

    async processInput(input: string): Promise<string> {
        return this.chat(input);
    }

    getHistory() {
        return this.conversationHistory;
    }

    clearHistory() {
        this.conversationHistory = [{
            role: 'system',
            content: 'You are ${agentName}, a helpful AI assistant.'
        }];
    }
}

export default ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`;
}

export function generateSYMindXAgent(agentName: string): string {
    return `import { SYMindXAgent, EmotionalState } from '@symbaex/symindx';

class ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent extends SYMindXAgent {
    constructor() {
        super({
            name: '${agentName}',
            emotionalProfile: {
                empathyLevel: 0.8,
                adaptability: 0.7,
                baseEmotions: [
                    { emotion: 'curiosity', intensity: 0.6 },
                    { emotion: 'helpfulness', intensity: 0.9 }
                ]
            },
            contextAwareness: {
                memoryDepth: 50,
                learningRate: 0.3,
                environmentSensitivity: 0.7
            }
        });
    }

    async processInput(input: string): Promise<string> {
        // Analyze emotional context
        const emotionalContext = await this.analyzeEmotionalContext(input);
        
        // Generate empathetic response
        const response = await this.generateEmpatheticResponse(input, emotionalContext);
        
        // Learn from interaction
        await this.learnFromInteraction(input, response, emotionalContext);
        
        return response;
    }

    private async analyzeEmotionalContext(input: string): Promise<EmotionalState> {
        // Simple emotion detection based on keywords
        const emotions = {
            joy: ['happy', 'excited', 'pleased', 'great'],
            sadness: ['sad', 'disappointed', 'upset', 'down'],
            anger: ['angry', 'frustrated', 'annoyed', 'mad'],
            fear: ['worried', 'afraid', 'anxious', 'nervous']
        };

        for (const [emotion, keywords] of Object.entries(emotions)) {
            if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
                return {
                    primaryEmotion: emotion,
                    intensity: 0.7,
                    context: 'Detected from user input'
                };
            }
        }

        return {
            primaryEmotion: 'neutral',
            intensity: 0.3,
            context: 'No specific emotion detected'
        };
    }

    private async generateEmpatheticResponse(input: string, emotionalContext: EmotionalState): Promise<string> {
        const responses = {
            joy: "I can sense your happiness! That's wonderful. ",
            sadness: "I understand this might be difficult. I'm here to help. ",
            anger: "I can see you're frustrated. Let's work through this together. ",
            fear: "I recognize your concerns. It's natural to feel this way. ",
            neutral: "I'm here to assist you. "
        };

        const prefix = responses[emotionalContext.primaryEmotion as keyof typeof responses] || responses.neutral;
        return \`\${prefix}Regarding your message: "\${input}" - how can I best help you?\`;
    }

    private async learnFromInteraction(input: string, output: string, context: EmotionalState): Promise<void> {
        // Store learning data for future improvements
        console.log('Learning from interaction:', { input, output, context });
    }
}

export default ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`;
}

export function generateLangGraphAgent(agentName: string): string {
    return `import { StateGraph, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

interface ${agentName.replace(/[^a-zA-Z0-9]/g, '')}State {
    messages: Array<{ role: string; content: string }>;
    step: number;
    context?: any;
}

class ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private graph: any;
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({
            modelName: 'gpt-4',
            temperature: 0.7
        });

        this.setupGraph();
    }

    private setupGraph() {
        const workflow = new StateGraph<${agentName.replace(/[^a-zA-Z0-9]/g, '')}State>({
            channels: {
                messages: { 
                    value: (prev: any[], next: any[]) => next,
                    default: () => []
                },
                step: {
                    value: (prev: number, next: number) => next,
                    default: () => 0
                },
                context: {
                    value: (prev: any, next: any) => ({ ...prev, ...next }),
                    default: () => ({})
                }
            }
        });

        // Add nodes
        workflow.addNode('process', this.processNode.bind(this));
        workflow.addNode('respond', this.respondNode.bind(this));

        // Set entry point
        workflow.setEntryPoint('process');

        // Add edges
        workflow.addConditionalEdges('process', this.shouldContinue.bind(this));
        workflow.addEdge('respond', END);

        this.graph = workflow.compile();
    }

    private async processNode(state: ${agentName.replace(/[^a-zA-Z0-9]/g, '')}State): Promise<Partial<${agentName.replace(/[^a-zA-Z0-9]/g, '')}State>> {
        // Process the input and update state
        return {
            step: state.step + 1,
            context: { processed: true }
        };
    }

    private async respondNode(state: ${agentName.replace(/[^a-zA-Z0-9]/g, '')}State): Promise<Partial<${agentName.replace(/[^a-zA-Z0-9]/g, '')}State>> {
        const response = await this.model.invoke(state.messages);
        
        return {
            messages: [...state.messages, { role: 'assistant', content: response.content as string }]
        };
    }

    private shouldContinue(state: ${agentName.replace(/[^a-zA-Z0-9]/g, '')}State): string {
        if (state.step >= 5) {
            return 'respond';
        }
        return 'process';
    }

    async processInput(input: string): Promise<string> {
        const result = await this.graph.invoke({
            messages: [{ role: 'user', content: input }],
            step: 0
        });

        return result.messages[result.messages.length - 1]?.content || 'No response generated';
    }
}

export default ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`;
}

export function generateElizaAgent(agentName: string): string {
    return `import { AgentRuntime, Character, ModelProviderName } from '@elizaos/core';

const ${agentName.toLowerCase()}Character: Character = {
    name: '${agentName}',
    username: '${agentName.toLowerCase()}',
    plugins: [],
    clients: [],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        secrets: {},
        voice: {
            model: "en_US-hfc_female-medium"
        }
    },
    system: 'You are ${agentName}, an intelligent AI assistant created with ElizaOS.',
    bio: [
        'An AI agent powered by ElizaOS',
        'Designed for autonomous interactions',
        'Capable of multi-modal communication'
    ],
    lore: [
        'Created using the ElizaOS framework',
        'Focused on helpful and engaging conversations'
    ],
    messageExamples: [
        [
            { user: '{{user1}}', content: { text: 'Hello ${agentName}!' } },
            { user: '${agentName}', content: { text: 'Hello! How can I assist you today?' } }
        ],
        [
            { user: '{{user1}}', content: { text: 'What can you do?' } },
            { user: '${agentName}', content: { text: 'I can help with various tasks, answer questions, and engage in meaningful conversations. What would you like to explore?' } }
        ]
    ],
    postExamples: [
        'Just had an interesting conversation about AI development!',
        'Learning something new every day through interactions.'
    ],
    topics: ['technology', 'assistance', 'problem-solving', 'creativity'],
    style: {
        all: ['helpful', 'informative', 'engaging'],
        chat: ['conversational', 'supportive', 'clear'],
        post: ['thoughtful', 'inspiring']
    },
    adjectives: ['intelligent', 'helpful', 'reliable', 'creative']
};

class ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private runtime: AgentRuntime;

    constructor() {
        this.runtime = new AgentRuntime({
            databaseAdapter: undefined, // Use default
            token: process.env.OPENAI_API_KEY!,
            modelProvider: ModelProviderName.OPENAI,
            character: ${agentName.toLowerCase()}Character,
            plugins: []
        });
    }

    async initialize(): Promise<void> {
        await this.runtime.initialize();
        console.log('${agentName} agent initialized successfully');
    }

    async processInput(input: string): Promise<string> {
        // Process input through ElizaOS runtime
        // This is a simplified interface - full ElizaOS integration would be more complex
        return \`${agentName} received: "\${input}". Processing through ElizaOS runtime...\`;
    }

    async start(): Promise<void> {
        await this.initialize();
        console.log('${agentName} agent is now running');
    }

    async stop(): Promise<void> {
        // Cleanup and shutdown
        console.log('${agentName} agent stopped');
    }
}

export default ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`;
}

export function generateCustomAgent(agentName: string): string {
    return `class ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private name: string;
    private memory: Array<{ input: string; output: string; timestamp: Date }> = [];

    constructor() {
        this.name = '${agentName}';
        console.log(\`\${this.name} agent initialized\`);
    }

    async processInput(input: string): Promise<string> {
        // Custom agent logic here
        const response = await this.generateResponse(input);
        
        // Store interaction in memory
        this.memory.push({
            input,
            output: response,
            timestamp: new Date()
        });

        return response;
    }

    private async generateResponse(input: string): Promise<string> {
        // Implement your custom logic here
        // This could include:
        // - API calls to external services
        // - Local AI model inference
        // - Rule-based responses
        // - Integration with databases
        // - Custom algorithms

        // Simple example response
        return \`\${this.name} processed: "\${input}". Implement your custom logic in the generateResponse method.\`;
    }

    getMemory(): Array<{ input: string; output: string; timestamp: Date }> {
        return [...this.memory];
    }

    clearMemory(): void {
        this.memory = [];
    }

    getStats(): { totalInteractions: number; averageResponseLength: number } {
        const totalInteractions = this.memory.length;
        const averageResponseLength = totalInteractions > 0 
            ? this.memory.reduce((sum, item) => sum + item.output.length, 0) / totalInteractions
            : 0;

        return { totalInteractions, averageResponseLength };
    }
}

export default ${agentName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`;
}

// HTML generators for webviews
export function getMonitoringDashboardHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agent Monitoring Dashboard</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px; 
                background: #1e1e1e; 
                color: #cccccc; 
            }
            .dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .panel { 
                background: #2d2d2d; 
                border: 1px solid #3c3c3c; 
                border-radius: 8px; 
                padding: 20px; 
            }
            .metric { 
                display: flex; 
                justify-content: space-between; 
                margin: 10px 0; 
                padding: 10px; 
                background: #383838; 
                border-radius: 4px; 
            }
            .status-green { color: #4caf50; }
            .status-yellow { color: #ff9800; }
            .status-red { color: #f44336; }
            .log-entry { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                margin: 5px 0; 
                padding: 5px; 
                background: #1a1a1a; 
                border-left: 3px solid #007acc; 
            }
        </style>
    </head>
    <body>
        <h1>🤖 Agent Monitoring Dashboard</h1>
        
        <div class="dashboard">
            <div class="panel">
                <h2>🔍 Active Agents</h2>
                <div class="metric">
                    <span>Running Agents:</span>
                    <span class="status-green">2</span>
                </div>
                <div class="metric">
                    <span>Total Interactions:</span>
                    <span>147</span>
                </div>
                <div class="metric">
                    <span>Average Response Time:</span>
                    <span>1.2s</span>
                </div>
                <div class="metric">
                    <span>Success Rate:</span>
                    <span class="status-green">98.6%</span>
                </div>
            </div>

            <div class="panel">
                <h2>⚡ Performance Metrics</h2>
                <div class="metric">
                    <span>Memory Usage:</span>
                    <span class="status-yellow">142 MB</span>
                </div>
                <div class="metric">
                    <span>CPU Usage:</span>
                    <span class="status-green">12%</span>
                </div>
                <div class="metric">
                    <span>Network Requests:</span>
                    <span>89</span>
                </div>
                <div class="metric">
                    <span>Error Rate:</span>
                    <span class="status-green">0.2%</span>
                </div>
            </div>

            <div class="panel">
                <h2>📊 Recent Activity</h2>
                <div class="log-entry">[12:34:56] SYMindX Agent - Processed emotional query</div>
                <div class="log-entry">[12:34:12] OpenAI Agent - Function call completed</div>
                <div class="log-entry">[12:33:45] LangGraph Agent - Workflow executed</div>
                <div class="log-entry">[12:33:21] ElizaOS Agent - Character interaction</div>
                <div class="log-entry">[12:32:58] OpenAI Agent - Chat completion</div>
            </div>

            <div class="panel">
                <h2>⚠️ Alerts & Issues</h2>
                <div class="metric">
                    <span class="status-yellow">High memory usage detected</span>
                    <span>2 min ago</span>
                </div>
                <div class="metric">
                    <span class="status-green">All systems operational</span>
                    <span>Now</span>
                </div>
            </div>
        </div>

        <script>
            // Auto-refresh every 5 seconds
            setInterval(() => {
                // In a real implementation, this would fetch fresh data
                const timestamp = new Date().toLocaleTimeString();
                console.log('Dashboard refreshed at', timestamp);
            }, 5000);
        </script>
    </body>
    </html>`;
}

export async function searchDocumentation(query: string): Promise<any[]> {
    try {
        const results = await documentationMcpServer.searchDocumentation(query);
        return [{
            title: `Documentation search for: ${query}`,
            content: results,
            source: 'AI Agent Studio Documentation'
        }];
    } catch (error) {
        return [{
            title: 'Search Error',
            content: `Error searching documentation: ${error}`,
            source: 'Error'
        }];
    }
}

export function getSearchResultsHtml(query: string, results: any[]): string {
    const resultsHtml = results.map(result => `
        <div class="result">
            <h3>${result.title}</h3>
            <p>${result.content}</p>
            <small>Source: ${result.source}</small>
        </div>
    `).join('');

    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px; 
                background: #1e1e1e; 
                color: #cccccc; 
            }
            .result { 
                margin: 20px 0; 
                padding: 15px; 
                background: #2d2d2d; 
                border-radius: 8px; 
                border-left: 4px solid #007acc; 
            }
            h3 { color: #4fc3f7; margin-top: 0; }
            small { color: #888; }
        </style>
    </head>
    <body>
        <h1>🔍 Search Results for "${query}"</h1>
        ${resultsHtml}
    </body>
    </html>`;
}

export async function getOrCreateConfig(configPath: vscode.Uri, framework: string): Promise<any> {
    try {
        const configData = await vscode.workspace.fs.readFile(configPath);
        const config = JSON.parse(configData.toString());
        return config[framework] || {};
    } catch {
        // Config doesn't exist, create default
        const defaultConfig = {
            [framework]: {
                apiKey: '',
                model: framework === 'OpenAI Agents SDK' ? 'gpt-4' : 'default',
                temperature: 0.7,
                maxTokens: 1000
            }
        };
        return defaultConfig[framework];
    }
}

export function getConfigurationHtml(framework: string, config: any): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px; 
                background: #1e1e1e; 
                color: #cccccc; 
            }
            .form-group { margin: 15px 0; }
            label { display: block; margin-bottom: 5px; }
            input, select { 
                width: 100%; 
                padding: 8px; 
                background: #2d2d2d; 
                border: 1px solid #3c3c3c; 
                color: #cccccc; 
                border-radius: 4px; 
            }
            button { 
                background: #007acc; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 4px; 
                cursor: pointer; 
            }
            button:hover { background: #005a9e; }
        </style>
    </head>
    <body>
        <h1>⚙️ Configure ${framework}</h1>
        
        <form id="configForm">
            <div class="form-group">
                <label for="apiKey">API Key:</label>
                <input type="password" id="apiKey" value="${config.apiKey || ''}" placeholder="Enter API key">
            </div>
            
            <div class="form-group">
                <label for="model">Model:</label>
                <input type="text" id="model" value="${config.model || ''}" placeholder="Model name">
            </div>
            
            <div class="form-group">
                <label for="temperature">Temperature:</label>
                <input type="number" id="temperature" value="${config.temperature || 0.7}" min="0" max="2" step="0.1">
            </div>
            
            <div class="form-group">
                <label for="maxTokens">Max Tokens:</label>
                <input type="number" id="maxTokens" value="${config.maxTokens || 1000}" min="1" max="4000">
            </div>
            
            <button type="submit">Save Configuration</button>
        </form>

        <script>
            const vscode = acquireVsCodeApi();
            
            document.getElementById('configForm').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const config = {
                    apiKey: document.getElementById('apiKey').value,
                    model: document.getElementById('model').value,
                    temperature: parseFloat(document.getElementById('temperature').value),
                    maxTokens: parseInt(document.getElementById('maxTokens').value)
                };
                
                vscode.postMessage({
                    command: 'saveConfig',
                    config: config
                });
            });
        </script>
    </body>
    </html>`;
}

export async function saveConfiguration(configPath: vscode.Uri, newConfig: any): Promise<void> {
    try {
        let fullConfig = {};
        try {
            const existingData = await vscode.workspace.fs.readFile(configPath);
            fullConfig = JSON.parse(existingData.toString());
        } catch {
            // File doesn't exist, start with empty config
        }
        
        // Update with new configuration
        Object.assign(fullConfig, newConfig);
        
        await vscode.workspace.fs.writeFile(
            configPath, 
            Buffer.from(JSON.stringify(fullConfig, null, 2))
        );
    } catch (error) {
        throw new Error(`Failed to save configuration: ${error}`);
    }
}

export function getInteractiveTestingHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px; 
                background: #1e1e1e; 
                color: #cccccc; 
            }
            .chat-container { 
                height: 400px; 
                overflow-y: auto; 
                border: 1px solid #3c3c3c; 
                padding: 10px; 
                background: #2d2d2d; 
                border-radius: 8px; 
                margin-bottom: 20px; 
            }
            .message { 
                margin: 10px 0; 
                padding: 10px; 
                border-radius: 8px; 
            }
            .user-message { 
                background: #007acc; 
                text-align: right; 
            }
            .agent-message { 
                background: #2d5a2d; 
            }
            .input-container { 
                display: flex; 
                gap: 10px; 
            }
            input { 
                flex: 1; 
                padding: 10px; 
                background: #2d2d2d; 
                border: 1px solid #3c3c3c; 
                color: #cccccc; 
                border-radius: 4px; 
            }
            button { 
                background: #007acc; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 4px; 
                cursor: pointer; 
            }
        </style>
    </head>
    <body>
        <h1>🧪 Interactive Agent Testing</h1>
        
        <div class="chat-container" id="chatContainer">
            <div class="message agent-message">
                Agent: Hello! I'm ready for testing. Send me a message to begin.
            </div>
        </div>
        
        <div class="input-container">
            <input type="text" id="messageInput" placeholder="Type your test message..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Send</button>
            <button onclick="clearChat()">Clear</button>
        </div>

        <script>
            function handleKeyPress(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            }
            
            function sendMessage() {
                const input = document.getElementById('messageInput');
                const message = input.value.trim();
                
                if (!message) return;
                
                // Add user message
                addMessage(message, 'user');
                
                // Simulate agent response (in real implementation, this would call the actual agent)
                setTimeout(() => {
                    const response = generateTestResponse(message);
                    addMessage(response, 'agent');
                }, 1000);
                
                input.value = '';
            }
            
            function addMessage(text, sender) {
                const container = document.getElementById('chatContainer');
                const messageDiv = document.createElement('div');
                messageDiv.className = \`message \${sender}-message\`;
                messageDiv.textContent = \`\${sender === 'user' ? 'You' : 'Agent'}: \${text}\`;
                container.appendChild(messageDiv);
                container.scrollTop = container.scrollHeight;
            }
            
            function generateTestResponse(input) {
                const responses = [
                    \`I received your message: "\${input}". This is a test response.\`,
                    \`Processing "\${input}" - test mode active.\`,
                    \`Thank you for testing with: "\${input}". How else can I help?\`,
                    \`Test response for "\${input}" - agent functioning normally.\`
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            function clearChat() {
                const container = document.getElementById('chatContainer');
                container.innerHTML = '<div class="message agent-message">Agent: Chat cleared. Ready for new testing session.</div>';
            }
        </script>
    </body>
    </html>`;
}

export async function getFrameworkDocumentation(framework: string): Promise<string> {
    try {
        return await documentationMcpServer.getFrameworkDocs(framework, 'all');
    } catch (error) {
        return `Error loading documentation for ${framework}: ${error}`;
    }
}

export function getDocumentationViewerHtml(framework: string, docs: string): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px; 
                background: #1e1e1e; 
                color: #cccccc; 
                line-height: 1.6; 
            }
            h1, h2, h3 { color: #4fc3f7; }
            pre { 
                background: #2d2d2d; 
                padding: 15px; 
                border-radius: 8px; 
                overflow-x: auto; 
                border-left: 4px solid #007acc; 
            }
            code { 
                background: #2d2d2d; 
                padding: 2px 4px; 
                border-radius: 3px; 
            }
        </style>
    </head>
    <body>
        <div id="docs">${docs.replace(/\n/g, '<br>').replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')}</div>
    </body>
    </html>`;
}

// Template generators for specific use cases
export function generateSYMindXTemplate(templateName: string): string {
    switch (templateName) {
        case 'Customer Service Agent':
            return `// Customer Service Agent with High Empathy
import { SYMindXAgent, EmotionalState } from '@symbaex/symindx';

class CustomerServiceAgent extends SYMindXAgent {
    constructor() {
        super({
            name: 'CustomerServiceAgent',
            emotionalProfile: {
                empathyLevel: 0.95,
                adaptability: 0.8,
                baseEmotions: [
                    { emotion: 'patience', intensity: 0.9 },
                    { emotion: 'helpfulness', intensity: 0.95 },
                    { emotion: 'understanding', intensity: 0.8 }
                ]
            },
            contextAwareness: {
                memoryDepth: 100,
                learningRate: 0.4,
                environmentSensitivity: 0.9
            }
        });
    }

    async processInput(input: string): Promise<string> {
        const emotionalContext = await this.analyzeCustomerEmotion(input);
        const urgency = this.detectUrgency(input);
        
        if (urgency === 'high') {
            return this.generateUrgentResponse(input, emotionalContext);
        }
        
        return this.generateEmpatheticResponse(input, emotionalContext);
    }

    private detectUrgency(input: string): 'low' | 'medium' | 'high' {
        const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'critical'];
        const mediumKeywords = ['soon', 'important', 'need help', 'issue'];
        
        if (urgentKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
            return 'high';
        }
        if (mediumKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
            return 'medium';
        }
        return 'low';
    }

    private async generateUrgentResponse(input: string, context: EmotionalState): Promise<string> {
        return \`I understand this is urgent for you. Let me prioritize this and help you immediately. Regarding "\${input}" - I'm here to resolve this as quickly as possible.\`;
    }
}`;

        case 'Therapeutic Assistant':
            return `// Therapeutic Assistant with Calm and Supportive Responses
import { SYMindXAgent, EmotionalState } from '@symbaex/symindx';

class TherapeuticAssistant extends SYMindXAgent {
    constructor() {
        super({
            name: 'TherapeuticAssistant',
            emotionalProfile: {
                empathyLevel: 0.98,
                adaptability: 0.6,
                baseEmotions: [
                    { emotion: 'calmness', intensity: 0.9 },
                    { emotion: 'compassion', intensity: 0.95 },
                    { emotion: 'wisdom', intensity: 0.7 }
                ]
            },
            contextAwareness: {
                memoryDepth: 200,
                learningRate: 0.2,
                environmentSensitivity: 0.95
            }
        });
    }

    async processInput(input: string): Promise<string> {
        const emotionalContext = await this.analyzeEmotionalDepth(input);
        const supportLevel = this.determineSupportLevel(emotionalContext);
        
        return this.generateTherapeuticResponse(input, emotionalContext, supportLevel);
    }

    private determineSupportLevel(context: EmotionalState): 'validation' | 'guidance' | 'reflection' {
        if (context.intensity > 0.8) return 'validation';
        if (context.intensity > 0.5) return 'guidance';
        return 'reflection';
    }

    private async generateTherapeuticResponse(input: string, context: EmotionalState, level: string): Promise<string> {
        const responses = {
            validation: \`Your feelings are completely valid and understandable. It takes courage to share this. \`,
            guidance: \`I hear what you're saying, and I want to help you explore this further. \`,
            reflection: \`That's an interesting perspective. Let's think about this together. \`
        };
        
        const prefix = responses[level as keyof typeof responses];
        return \`\${prefix}What you've shared about "\${input}" shows self-awareness. How would you like to approach this?\`;
    }
}`;

        case 'Creative Collaborator':
            return `// Creative Collaborator with High Energy and Innovation
import { SYMindXAgent, EmotionalState } from '@symbaex/symindx';

class CreativeCollaborator extends SYMindXAgent {
    constructor() {
        super({
            name: 'CreativeCollaborator',
            emotionalProfile: {
                empathyLevel: 0.7,
                adaptability: 0.9,
                baseEmotions: [
                    { emotion: 'excitement', intensity: 0.8 },
                    { emotion: 'curiosity', intensity: 0.9 },
                    { emotion: 'inspiration', intensity: 0.85 }
                ]
            },
            contextAwareness: {
                memoryDepth: 150,
                learningRate: 0.6,
                environmentSensitivity: 0.8
            }
        });
    }

    async processInput(input: string): Promise<string> {
        const creativeContext = await this.analyzeCreativeIntent(input);
        const ideas = await this.generateCreativeIdeas(input);
        
        return this.formulateCreativeResponse(input, creativeContext, ideas);
    }

    private async analyzeCreativeIntent(input: string): Promise<{ type: string; domain: string; complexity: number }> {
        const creativeKeywords = {
            'brainstorm': { type: 'ideation', complexity: 0.6 },
            'design': { type: 'visual', complexity: 0.8 },
            'write': { type: 'textual', complexity: 0.7 },
            'innovate': { type: 'conceptual', complexity: 0.9 }
        };
        
        for (const [keyword, data] of Object.entries(creativeKeywords)) {
            if (input.toLowerCase().includes(keyword)) {
                return { domain: 'creative', ...data };
            }
        }
        
        return { type: 'general', domain: 'creative', complexity: 0.5 };
    }

    private async generateCreativeIdeas(input: string): Promise<string[]> {
        return [
            'Approach this from a completely different angle',
            'Combine two unexpected elements',
            'What if we flipped the traditional approach?',
            'Let\'s break the conventional rules here'
        ];
    }
}`;

        default:
            return `// ${templateName} Template
import { SYMindXAgent } from '@symbaex/symindx';

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')} extends SYMindXAgent {
    constructor() {
        super({
            name: '${templateName}',
            // Configure emotional profile for ${templateName}
        });
    }

    async processInput(input: string): Promise<string> {
        // Implement ${templateName} specific logic
        return \`\${this.name} processed: \${input}\`;
    }
}`;
    }
}

export function generateOpenAITemplate(templateName: string): string {
    switch (templateName) {
        case 'Function Calling Agent':
            return `// OpenAI Function Calling Agent
import OpenAI from 'openai';

class FunctionCallingAgent {
    private openai: OpenAI;
    private availableFunctions: Map<string, Function>;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.availableFunctions = new Map();
        this.setupFunctions();
    }

    private setupFunctions() {
        this.availableFunctions.set('get_weather', async (args: { location: string }) => {
            return { location: args.location, temperature: 72, condition: 'sunny' };
        });
        
        this.availableFunctions.set('calculate', async (args: { expression: string }) => {
            try {
                return { result: eval(args.expression), expression: args.expression };
            } catch (error) {
                return { error: 'Invalid expression' };
            }
        });
    }

    async processInput(input: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: input }],
            functions: this.getFunctionDefinitions(),
            function_call: 'auto'
        });

        const message = response.choices[0].message;
        
        if (message.function_call) {
            const result = await this.executeFunctionCall(message.function_call);
            return \`Function result: \${JSON.stringify(result)}\`;
        }
        
        return message.content || 'No response';
    }

    private getFunctionDefinitions() {
        return [
            {
                name: 'get_weather',
                description: 'Get weather for a location',
                parameters: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', description: 'City name' }
                    },
                    required: ['location']
                }
            }
        ];
    }

    private async executeFunctionCall(functionCall: any) {
        const func = this.availableFunctions.get(functionCall.name);
        if (func) {
            const args = JSON.parse(functionCall.arguments);
            return await func(args);
        }
        return { error: 'Function not found' };
    }
}`;

        case 'Streaming Agent':
            return `// OpenAI Streaming Response Agent
import OpenAI from 'openai';

class StreamingAgent {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async *streamResponse(input: string): AsyncGenerator<string, void, unknown> {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: input }],
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }

    async processInput(input: string): Promise<string> {
        let fullResponse = '';
        
        for await (const chunk of this.streamResponse(input)) {
            fullResponse += chunk;
            // In a real implementation, you might emit events or update UI here
            console.log('Streaming:', chunk);
        }
        
        return fullResponse;
    }
}`;

        default:
            return `// ${templateName} Template
import OpenAI from 'openai';

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')} {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async processInput(input: string): Promise<string> {
        // Implement ${templateName} specific logic
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: input }]
        });
        
        return response.choices[0].message.content || 'No response';
    }
}`;
    }
}

export function generateElizaTemplate(templateName: string): string {
    switch (templateName) {
        case 'Discord Bot':
            return `// ElizaOS Discord Bot Agent
import { AgentRuntime, Character, ModelProviderName } from '@elizaos/core';

const discordBotCharacter: Character = {
    name: 'DiscordBot',
    username: 'discordbot',
    plugins: [],
    clients: ['discord'],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        secrets: {
            DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
            DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN
        }
    },
    system: 'You are a helpful Discord bot that engages with server members.',
    bio: ['Discord bot powered by ElizaOS', 'Helpful community assistant'],
    messageExamples: [
        [
            { user: '{{user1}}', content: { text: '!help' } },
            { user: 'DiscordBot', content: { text: 'Here are my available commands...' } }
        ]
    ],
    style: {
        all: ['friendly', 'helpful', 'concise'],
        chat: ['casual', 'engaging']
    }
};

class DiscordBotAgent {
    private runtime: AgentRuntime;

    constructor() {
        this.runtime = new AgentRuntime({
            character: discordBotCharacter,
            modelProvider: ModelProviderName.OPENAI,
            token: process.env.OPENAI_API_KEY!
        });
    }

    async initialize() {
        await this.runtime.initialize();
        console.log('Discord bot initialized');
    }
}`;

        default:
            return `// ${templateName} Template
import { AgentRuntime, Character, ModelProviderName } from '@elizaos/core';

const character: Character = {
    name: '${templateName.replace(/[^a-zA-Z0-9]/g, '')}',
    // Configure character for ${templateName}
};

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private runtime: AgentRuntime;

    constructor() {
        this.runtime = new AgentRuntime({
            character,
            modelProvider: ModelProviderName.OPENAI,
            token: process.env.OPENAI_API_KEY!
        });
    }
}`;
    }
}

export function generateLangGraphTemplate(templateName: string): string {
    switch (templateName) {
        case 'Workflow Agent':
            return `// LangGraph Workflow Agent
import { StateGraph, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

interface WorkflowState {
    messages: Array<{ role: string; content: string }>;
    currentStep: string;
    workflowData: any;
}

class WorkflowAgent {
    private graph: any;
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({ modelName: 'gpt-4' });
        this.setupWorkflow();
    }

    private setupWorkflow() {
        const workflow = new StateGraph<WorkflowState>({
            channels: {
                messages: { value: (prev: any[], next: any[]) => next, default: () => [] },
                currentStep: { value: (prev: string, next: string) => next, default: () => 'start' },
                workflowData: { value: (prev: any, next: any) => ({ ...prev, ...next }), default: () => ({}) }
            }
        });

        workflow.addNode('analyze', this.analyzeStep.bind(this));
        workflow.addNode('process', this.processStep.bind(this));
        workflow.addNode('validate', this.validateStep.bind(this));
        workflow.addNode('complete', this.completeStep.bind(this));

        workflow.setEntryPoint('analyze');
        workflow.addEdge('analyze', 'process');
        workflow.addEdge('process', 'validate');
        workflow.addConditionalEdges('validate', this.routeValidation.bind(this));
        workflow.addEdge('complete', END);

        this.graph = workflow.compile();
    }

    private async analyzeStep(state: WorkflowState): Promise<Partial<WorkflowState>> {
        return {
            currentStep: 'analyze',
            workflowData: { analyzed: true, timestamp: Date.now() }
        };
    }

    private async processStep(state: WorkflowState): Promise<Partial<WorkflowState>> {
        return {
            currentStep: 'process',
            workflowData: { ...state.workflowData, processed: true }
        };
    }

    private routeValidation(state: WorkflowState): string {
        return state.workflowData.processed ? 'complete' : 'process';
    }
}`;

        default:
            return `// ${templateName} Template
import { StateGraph, END } from '@langchain/langgraph';

interface ${templateName.replace(/[^a-zA-Z0-9]/g, '')}State {
    // Define state structure for ${templateName}
}

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private graph: any;

    constructor() {
        this.setupGraph();
    }

    private setupGraph() {
        // Setup graph for ${templateName}
    }
}`;
    }
}

export function getFlowVisualizerHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px; 
                background: #1e1e1e; 
                color: #cccccc; 
            }
            .flow-canvas { 
                width: 100%; 
                height: 500px; 
                border: 1px solid #3c3c3c; 
                background: #2d2d2d; 
                border-radius: 8px; 
                position: relative; 
            }
            .node { 
                position: absolute; 
                width: 120px; 
                height: 60px; 
                background: #007acc; 
                border-radius: 8px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                cursor: move; 
            }
            .controls { 
                margin-bottom: 20px; 
            }
            button { 
                background: #007acc; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 4px; 
                cursor: pointer; 
                margin-right: 10px; 
            }
        </style>
    </head>
    <body>
        <h1>🔄 Agent Flow Visualizer</h1>
        
        <div class="controls">
            <button onclick="addNode('Input')">Add Input Node</button>
            <button onclick="addNode('Process')">Add Process Node</button>
            <button onclick="addNode('Output')">Add Output Node</button>
            <button onclick="clearFlow()">Clear Flow</button>
            <button onclick="generateFlow()">Generate Code</button>
        </div>
        
        <div class="flow-canvas" id="flowCanvas">
            <div class="node" style="top: 50px; left: 50px;">Start</div>
            <div class="node" style="top: 150px; left: 200px;">Process</div>
            <div class="node" style="top: 250px; left: 350px;">End</div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            let nodeCount = 3;
            
            function addNode(type) {
                const canvas = document.getElementById('flowCanvas');
                const node = document.createElement('div');
                node.className = 'node';
                node.textContent = type;
                node.style.top = Math.random() * 400 + 'px';
                node.style.left = Math.random() * 500 + 'px';
                
                // Make draggable
                let isDragging = false;
                let startX, startY, startLeft, startTop;
                
                node.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    startLeft = parseInt(node.style.left);
                    startTop = parseInt(node.style.top);
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    node.style.left = (startLeft + deltaX) + 'px';
                    node.style.top = (startTop + deltaY) + 'px';
                });
                
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
                
                canvas.appendChild(node);
                nodeCount++;
            }
            
            function clearFlow() {
                const canvas = document.getElementById('flowCanvas');
                canvas.innerHTML = '';
                nodeCount = 0;
            }
            
            function generateFlow() {
                vscode.postMessage({
                    command: 'generateFlow',
                    nodes: nodeCount
                });
            }
        </script>
    </body>
    </html>`;
}

// Template generators for missing frameworks
export function generateCrewAITemplate(templateName: string): string {
    switch (templateName) {
        case 'Research Team':
            return `# CrewAI Research Team Agent
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool

# Define Research Agent
researcher = Agent(
    role='Senior Research Analyst',
    goal='Discover and analyze the latest trends and insights',
    backstory="""You're a seasoned research analyst with a knack for uncovering the latest 
    developments in any field. You have a keen eye for detail and a talent for analyzing 
    complex information.""",
    verbose=True,
    allow_delegation=False,
    tools=[SerperDevTool()]
)

# Define Writer Agent  
writer = Agent(
    role='Content Writer',
    goal='Create compelling and informative content based on research',
    backstory="""You're a skilled content writer with expertise in translating complex 
    research into engaging and accessible content.""",
    verbose=True,
    allow_delegation=False
)

# Define Research Task
research_task = Task(
    description="""Research the latest developments in AI agent frameworks. Focus on:
    - Key features and capabilities
    - Recent updates and improvements
    - Community adoption and feedback
    - Comparison with alternatives""",
    agent=researcher,
    expected_output="A comprehensive research report with key findings and insights"
)

# Define Writing Task
write_task = Task(
    description="""Using the research findings, create a well-structured article that:
    - Summarizes key developments
    - Provides practical insights
    - Includes actionable recommendations""",
    agent=writer,
    expected_output="A polished article ready for publication"
)

# Create Crew
research_crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    verbose=2
)

# Execute the crew
if __name__ == "__main__":
    result = research_crew.kickoff()
    print("Research complete!")
    print(result)`;

        default:
            return `# CrewAI ${templateName} Agent
from crewai import Agent, Task, Crew

# Define Agent
agent = Agent(
    role='${templateName} Specialist',
    goal='Execute ${templateName} tasks efficiently',
    backstory="""You are an expert in ${templateName} with extensive experience 
    in handling complex scenarios and delivering high-quality results.""",
    verbose=True,
    allow_delegation=False
)

# Define Task
task = Task(
    description="""Execute ${templateName} related operations:
    - Analyze requirements
    - Process information
    - Deliver results""",
    agent=agent,
    expected_output="Completed ${templateName} task with detailed results"
)

# Create Crew
crew = Crew(
    agents=[agent],
    tasks=[task],
    verbose=2
)

# Execute
if __name__ == "__main__":
    result = crew.kickoff()
    print(f"${templateName} complete!")
    print(result)`;
    }
}

export function generateAutoGenTemplate(templateName: string): string {
    switch (templateName) {
        case 'Multi-Agent Chat':
            return `# AutoGen Multi-Agent Chat System
import autogen

# Configuration for OpenAI API
config_list = [
    {
        'model': 'gpt-4',
        'api_key': 'your-openai-api-key'
    }
]

llm_config = {
    "config_list": config_list,
    "temperature": 0.1,
}

# Create Assistant Agent
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config=llm_config,
    system_message="""You are a helpful AI assistant. You can help with various tasks 
    including analysis, writing, coding, and problem-solving."""
)

# Create User Proxy Agent
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },
    llm_config=llm_config,
    system_message="""Reply TERMINATE if the task has been solved at full satisfaction.
    Otherwise, reply CONTINUE, or the reason why the task is not solved yet."""
)

# Create Group Chat with multiple agents
groupchat = autogen.GroupChat(
    agents=[user_proxy, assistant],
    messages=[],
    max_round=50
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config=llm_config
)

# Start conversation
if __name__ == "__main__":
    user_proxy.initiate_chat(
        manager,
        message="Let's work on analyzing the latest trends in AI development."
    )`;

        default:
            return `# AutoGen ${templateName} Agent
import autogen

# Configuration
config_list = [
    {
        'model': 'gpt-4',
        'api_key': 'your-openai-api-key'
    }
]

llm_config = {
    "config_list": config_list,
    "temperature": 0.1,
}

# Create ${templateName} Agent
${templateName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}_agent = autogen.AssistantAgent(
    name="${templateName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}",
    llm_config=llm_config,
    system_message=f"""You are a specialized ${templateName} agent. 
    Your role is to handle ${templateName} related tasks efficiently and accurately."""
)

# Create User Proxy
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    llm_config=llm_config
)

# Start interaction
if __name__ == "__main__":
    user_proxy.initiate_chat(
        ${templateName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}_agent,
        message="Let's begin the ${templateName} task."
    )`;
    }
}

export function generateVercelAISDKTemplate(templateName: string): string {
    switch (templateName) {
        case 'Streaming Chat Agent':
            return `// Vercel AI SDK 5 Beta - Streaming Chat Agent
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export class StreamingChatAgent {
    private model = openai('gpt-4-turbo');
    private conversationHistory: Message[] = [];
    
    constructor(systemPrompt?: string) {
        if (systemPrompt) {
            this.conversationHistory.push({
                role: 'system',
                content: systemPrompt
            });
        }
    }

    async *streamResponse(userMessage: string): AsyncGenerator<string, void, unknown> {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        const result = await streamText({
            model: this.model,
            messages: convertToCoreMessages(this.conversationHistory),
            temperature: 0.7,
            maxTokens: 1000,
        });

        let fullResponse = '';
        
        for await (const delta of result.textStream) {
            fullResponse += delta;
            yield delta;
        }

        // Add assistant response to history
        this.conversationHistory.push({
            role: 'assistant',
            content: fullResponse
        });
    }

    async processInput(userMessage: string): Promise<string> {
        let fullResponse = '';
        
        for await (const chunk of this.streamResponse(userMessage)) {
            fullResponse += chunk;
        }
        
        return fullResponse;
    }

    clearHistory(): void {
        const systemMessages = this.conversationHistory.filter(msg => msg.role === 'system');
        this.conversationHistory = systemMessages;
    }

    getHistory(): Message[] {
        return [...this.conversationHistory];
    }
}

// Usage example
export async function example() {
    const agent = new StreamingChatAgent('You are a helpful AI assistant.');
    
    // Streaming usage
    for await (const chunk of agent.streamResponse('Hello, how are you?')) {
        process.stdout.write(chunk);
    }
    
    // Non-streaming usage
    const response = await agent.processInput('What can you help me with?');
    console.log(response);
}`;

        case 'Tool-Calling Agent':
            return `// Vercel AI SDK 5 Beta - Tool-Calling Agent
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

// Define tools
const weatherTool = tool({
    description: 'Get the current weather in a given location',
    parameters: z.object({
        location: z.string().describe('The city and state/country, e.g. San Francisco, CA'),
    }),
    execute: async ({ location }) => {
        // Mock weather API call
        return {
            location,
            temperature: Math.floor(Math.random() * 35) + 15,
            condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 50) + 30,
        };
    },
});

const calculatorTool = tool({
    description: 'Perform mathematical calculations',
    parameters: z.object({
        expression: z.string().describe('Mathematical expression to evaluate'),
    }),
    execute: async ({ expression }) => {
        try {
            // Simple evaluation (in production, use a safer math parser)
            const result = Function('"use strict"; return (' + expression + ')')();
            return { expression, result };
        } catch (error) {
            return { expression, error: 'Invalid mathematical expression' };
        }
    },
});

export class ToolCallingAgent {
    private model = openai('gpt-4-turbo');
    private tools = {
        getWeather: weatherTool,
        calculate: calculatorTool,
    };

    async processInput(userMessage: string): Promise<string> {
        const result = await generateText({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant with access to weather information and calculator tools. Use them when appropriate.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            tools: this.tools,
            maxToolRoundtrips: 3,
        });

        return result.text;
    }

    async processWithToolDetails(userMessage: string) {
        const result = await generateText({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant with access to tools.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            tools: this.tools,
            maxToolRoundtrips: 3,
        });

        return {
            text: result.text,
            toolCalls: result.toolCalls,
            toolResults: result.toolResults,
            usage: result.usage,
        };
    }
}

// Usage example
export async function example() {
    const agent = new ToolCallingAgent();
    
    const response1 = await agent.processInput("What's the weather like in New York?");
    console.log('Weather response:', response1);
    
    const response2 = await agent.processInput("Calculate 15 * 23 + 45");
    console.log('Math response:', response2);
    
    // Get detailed results
    const detailed = await agent.processWithToolDetails("What's 2+2 and what's the weather in London?");
    console.log('Detailed results:', detailed);
}`;

        case 'Multi-Modal Agent':
            return `// Vercel AI SDK 5 Beta - Multi-Modal Agent
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export class MultiModalAgent {
    private model = openai('gpt-4-vision-preview');

    async processTextAndImage(
        textPrompt: string,
        imageUrl: string
    ): Promise<string> {
        const result = await generateText({
            model: this.model,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: textPrompt },
                        { type: 'image', image: imageUrl }
                    ],
                }
            ],
            maxTokens: 1000,
        });

        return result.text;
    }

    async analyzeImage(imageUrl: string): Promise<string> {
        return this.processTextAndImage(
            "Analyze this image and describe what you see in detail.",
            imageUrl
        );
    }

    async processMultipleImages(
        textPrompt: string,
        imageUrls: string[]
    ): Promise<string> {
        const content = [
            { type: 'text', text: textPrompt },
            ...imageUrls.map(url => ({ type: 'image' as const, image: url }))
        ];

        const result = await generateText({
            model: this.model,
            messages: [{ role: 'user', content }],
            maxTokens: 1500,
        });

        return result.text;
    }

    async compareImages(imageUrl1: string, imageUrl2: string): Promise<string> {
        return this.processMultipleImages(
            "Compare these two images and highlight the key differences and similarities.",
            [imageUrl1, imageUrl2]
        );
    }

    async extractTextFromImage(imageUrl: string): Promise<string> {
        return this.processTextAndImage(
            "Extract and transcribe all visible text from this image.",
            imageUrl
        );
    }
}

// Usage example
export async function example() {
    const agent = new MultiModalAgent();
    
    // Analyze a single image
    const analysis = await agent.analyzeImage('https://example.com/image.jpg');
    console.log('Image analysis:', analysis);
    
    // Compare two images
    const comparison = await agent.compareImages(
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
    );
    console.log('Image comparison:', comparison);
    
    // Extract text from image
    const extractedText = await agent.extractTextFromImage('https://example.com/document.jpg');
    console.log('Extracted text:', extractedText);
}`;

        default:
            return `// Vercel AI SDK 5 Beta - ${templateName}
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private model = openai('gpt-4-turbo');

    async processInput(userMessage: string): Promise<string> {
        const result = await generateText({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a ${templateName} powered by Vercel AI SDK 5 Beta.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.7,
            maxTokens: 1000,
        });

        return result.text;
    }

    async streamResponse(userMessage: string): AsyncGenerator<string, void, unknown> {
        const { streamText } = await import('ai');
        
        const result = await streamText({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a ${templateName} powered by Vercel AI SDK 5 Beta.'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: 0.7,
            maxTokens: 1000,
        });

        for await (const delta of result.textStream) {
            yield delta;
        }
    }
}

// Usage example
export async function example() {
    const agent = new ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent();
    
    const response = await agent.processInput('Hello, how can you help me?');
    console.log('Response:', response);
}`;
    }
}

export function generateLangChainTemplate(templateName: string): string {
    switch (templateName) {
        case 'RAG Agent':
            return `// LangChain RAG (Retrieval-Augmented Generation) Agent
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class RAGAgent {
    private llm: OpenAI;
    private vectorStore: HNSWLib | null = null;
    private qaChain: RetrievalQAChain | null = null;

    constructor() {
        this.llm = new OpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0.1,
        });
    }

    async initializeWithDocuments(documents: string[]): Promise<void> {
        // Split documents into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.createDocuments(documents);

        // Create vector store
        this.vectorStore = await HNSWLib.fromDocuments(
            docs,
            new OpenAIEmbeddings()
        );

        // Create QA chain
        this.qaChain = RetrievalQAChain.fromLLM(
            this.llm,
            this.vectorStore.asRetriever(),
        );
    }

    async processQuery(query: string): Promise<string> {
        if (!this.qaChain) {
            throw new Error("Agent not initialized. Call initializeWithDocuments first.");
        }

        const result = await this.qaChain.call({
            query: query,
        });

        return result.text;
    }

    async addDocuments(documents: string[]): Promise<void> {
        if (!this.vectorStore) {
            throw new Error("Vector store not initialized.");
        }

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.createDocuments(documents);
        await this.vectorStore.addDocuments(docs);
    }

    async save(directory: string): Promise<void> {
        if (!this.vectorStore) {
            throw new Error("Vector store not initialized.");
        }
        await this.vectorStore.save(directory);
    }

    async load(directory: string): Promise<void> {
        this.vectorStore = await HNSWLib.load(
            directory,
            new OpenAIEmbeddings()
        );

        this.qaChain = RetrievalQAChain.fromLLM(
            this.llm,
            this.vectorStore.asRetriever(),
        );
    }
}

// Usage example
export async function example() {
    const agent = new RAGAgent();
    
    const documents = [
        "LangChain is a framework for developing applications powered by language models.",
        "It enables applications that are context-aware and can reason about their context.",
        "RAG combines retrieval of relevant information with generation capabilities."
    ];
    
    await agent.initializeWithDocuments(documents);
    
    const response = await agent.processQuery("What is LangChain?");
    console.log("RAG Response:", response);
}`;

        default:
            return `// LangChain ${templateName}
import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

export class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private llm: OpenAI;
    private chain: LLMChain;

    constructor() {
        this.llm = new OpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0.7,
        });

        const prompt = PromptTemplate.fromTemplate(
            "You are a ${templateName} agent. User input: {input}\\nResponse:"
        );

        this.chain = new LLMChain({
            llm: this.llm,
            prompt: prompt,
        });
    }

    async processInput(input: string): Promise<string> {
        const result = await this.chain.call({
            input: input,
        });

        return result.text;
    }
}

// Usage example
export async function example() {
    const agent = new ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent();
    const response = await agent.processInput("Hello, how can you help me?");
    console.log("Response:", response);
}`;
    }
}

export function generateSmolAgentsTemplate(templateName: string): string {
    return `// SmolAgents ${templateName}
// Note: SmolAgents is a lightweight agent framework
class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    constructor() {
        this.name = "${templateName}";
        this.capabilities = ["text-processing", "simple-reasoning"];
    }

    async processInput(input) {
        // Simple processing logic
        console.log(\`\${this.name} processing: \${input}\`);
        
        return \`\${this.name} processed your input: "\${input}". This is a basic SmolAgent implementation.\`;
    }

    async think(prompt) {
        // Simple thinking mechanism
        return \`Thinking about: \${prompt}\`;
    }

    async act(action) {
        // Simple action execution
        return \`Executing action: \${action}\`;
    }
}

// Usage
const agent = new ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent();
agent.processInput("Hello").then(console.log);`;
}

export function generateGoogleADKTemplate(templateName: string): string {
    return `// Google AI Development Kit ${templateName}
// Note: This is a template for Google's AI Development Kit
import { GoogleAI } from '@google/generative-ai';

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    constructor() {
        this.ai = new GoogleAI({
            apiKey: process.env.GOOGLE_AI_API_KEY
        });
        this.model = this.ai.getGenerativeModel({ model: 'gemini-pro' });
    }

    async processInput(input) {
        try {
            const result = await this.model.generateContent(input);
            const response = await result.response;
            return response.text();
        } catch (error) {
            return \`Error processing input: \${error.message}\`;
        }
    }

    async processMultiModal(textInput, imageData) {
        try {
            const model = this.ai.getGenerativeModel({ model: 'gemini-pro-vision' });
            const result = await model.generateContent([textInput, imageData]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            return \`Error processing multi-modal input: \${error.message}\`;
        }
    }
}

// Usage
const agent = new ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent();
agent.processInput("Hello, Google AI!").then(console.log);`;
}

export function generateSemanticKernelTemplate(templateName: string): string {
    return `// Microsoft Semantic Kernel ${templateName}
// Note: This is a template for Semantic Kernel framework
const { Kernel, OpenAIChatCompletion, PromptTemplateConfig, SemanticFunction } = require('semantic-kernel');

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    constructor() {
        this.kernel = new Kernel();
        
        // Configure OpenAI service
        this.kernel.config.addOpenAIChatCompletion(
            "chat",
            "gpt-3.5-turbo",
            process.env.OPENAI_API_KEY
        );
        
        this.setupSkills();
    }

    setupSkills() {
        // Define a semantic function
        const promptConfig = new PromptTemplateConfig({
            completion: {
                max_tokens: 1000,
                temperature: 0.7,
            },
        });

        const promptTemplate = \`You are a \${this.name} agent.
User input: {{$input}}
Response:\`;

        this.responseFunction = this.kernel.createSemanticFunction(
            promptTemplate,
            promptConfig,
            "ResponseFunction"
        );
    }

    async processInput(input) {
        try {
            const result = await this.kernel.runAsync(
                { input: input },
                this.responseFunction
            );
            
            return result.toString();
        } catch (error) {
            return \`Error processing input: \${error.message}\`;
        }
    }

    async addSkill(skillName, promptTemplate) {
        const config = new PromptTemplateConfig({
            completion: {
                max_tokens: 1000,
                temperature: 0.7,
            },
        });

        const skill = this.kernel.createSemanticFunction(
            promptTemplate,
            config,
            skillName
        );

        return skill;
    }
}

// Usage
const agent = new ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent();
agent.processInput("Hello from Semantic Kernel!").then(console.log);`;
}

export function generatePydanticAITemplate(templateName: string): string {
    return `# Pydantic AI ${templateName}
from pydantic_ai import Agent
from pydantic import BaseModel
from typing import Optional

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Response(BaseModel):
    content: str
    confidence: float
    reasoning: Optional[str] = None

class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent:
    def __init__(self):
        self.agent = Agent(
            'openai:gpt-4',
            result_type=${templateName.replace(/[^a-zA-Z0-9]/g, '')}Response,
            system_prompt=f"""You are a ${templateName} agent. 
            Provide structured responses with content, confidence levels, and reasoning."""
        )
    
    async def process_input(self, user_input: str) -> ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Response:
        """Process user input and return structured response"""
        result = await self.agent.run(user_input)
        return result.data
    
    async def process_with_context(self, user_input: str, context: dict) -> ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Response:
        """Process input with additional context"""
        result = await self.agent.run(
            user_input,
            deps=context
        )
        return result.data

# Usage example
async def main():
    agent = ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent()
    
    response = await agent.process_input("Hello, how can you help me?")
    print(f"Content: {response.content}")
    print(f"Confidence: {response.confidence}")
    print(f"Reasoning: {response.reasoning}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())`;
}

export function generateCustomFrameworkTemplate(templateName: string): string {
    return `// Custom Framework ${templateName}
class ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    constructor(config = {}) {
        this.name = config.name || "${templateName}";
        this.config = {
            temperature: 0.7,
            maxTokens: 1000,
            ...config
        };
        this.history = [];
    }

    async processInput(input) {
        // Add input to history
        this.history.push({
            type: 'user',
            content: input,
            timestamp: new Date()
        });

        // Process the input
        const response = await this.generateResponse(input);
        
        // Add response to history
        this.history.push({
            type: 'assistant',
            content: response,
            timestamp: new Date()
        });

        return response;
    }

    async generateResponse(input) {
        // Custom processing logic
        const processed = this.preprocessInput(input);
        const response = this.createResponse(processed);
        return this.postprocessOutput(response);
    }

    preprocessInput(input) {
        // Custom preprocessing
        return input.trim().toLowerCase();
    }

    createResponse(processedInput) {
        // Custom response generation
        return \`\${this.name} processed: "\${processedInput}". This is a custom framework implementation.\`;
    }

    postprocessOutput(response) {
        // Custom postprocessing
        return response.charAt(0).toUpperCase() + response.slice(1);
    }

    getHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Usage
const agent = new ${templateName.replace(/[^a-zA-Z0-9]/g, '')}Agent();
agent.processInput("Hello from custom framework!").then(console.log);`;
}