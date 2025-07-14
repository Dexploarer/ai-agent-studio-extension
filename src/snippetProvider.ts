import * as vscode from 'vscode';

export class AIAgentSnippetProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const completionItems: vscode.CompletionItem[] = [];

        // SYMindX Snippets
        const symindxSnippets = this.createSYMindXSnippets();
        completionItems.push(...symindxSnippets);

        // OpenAI Snippets
        const openaiSnippets = this.createOpenAISnippets();
        completionItems.push(...openaiSnippets);

        // LangGraph Snippets
        const langgraphSnippets = this.createLangGraphSnippets();
        completionItems.push(...langgraphSnippets);

        // ElizaOS Snippets
        const elizaSnippets = this.createElizaSnippets();
        completionItems.push(...elizaSnippets);

        // Vercel AI SDK Snippets
        const vercelAiSnippets = this.createVercelAISDKSnippets();
        completionItems.push(...vercelAiSnippets);

        // Universal Agent Snippets
        const universalSnippets = this.createUniversalSnippets();
        completionItems.push(...universalSnippets);

        return completionItems;
    }

    private createSYMindXSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic SYMindX Agent
        const basicAgent = new vscode.CompletionItem('symindx-agent', vscode.CompletionItemKind.Snippet);
        basicAgent.insertText = new vscode.SnippetString(`import { SYMindXAgent, EmotionalState } from '@symbaex/symindx';

class \${1:MyAgent}Agent extends SYMindXAgent {
    constructor() {
        super({
            name: '\${1:MyAgent}',
            emotionalProfile: {
                empathyLevel: \${2:0.8},
                adaptability: \${3:0.7},
                baseEmotions: [
                    { emotion: '\${4:curiosity}', intensity: \${5:0.6} }
                ]
            },
            contextAwareness: {
                memoryDepth: \${6:50},
                learningRate: \${7:0.3},
                environmentSensitivity: \${8:0.7}
            }
        });
    }

    async processInput(input: string): Promise<string> {
        const emotionalContext = await this.analyzeEmotionalContext(input);
        const response = await this.generateEmpatheticResponse(input, emotionalContext);
        return response;
    }

    private async analyzeEmotionalContext(input: string): Promise<EmotionalState> {
        // Implement emotional analysis
        return {
            primaryEmotion: 'neutral',
            intensity: 0.5,
            context: 'User interaction'
        };
    }

    private async generateEmpatheticResponse(input: string, context: EmotionalState): Promise<string> {
        return \`I understand your message: "\${input}". I sense \${context.primaryEmotion} with intensity \${context.intensity}.\`;
    }
}`);
        basicAgent.documentation = new vscode.MarkdownString('Creates a basic SYMindX emotionally intelligent agent');
        snippets.push(basicAgent);

        // Emotion Analysis Function
        const emotionAnalysis = new vscode.CompletionItem('symindx-emotion-analysis', vscode.CompletionItemKind.Snippet);
        emotionAnalysis.insertText = new vscode.SnippetString(`async analyzeEmotionalContext(input: string): Promise<EmotionalState> {
    const emotions = {
        joy: ['happy', 'excited', 'pleased', 'delighted'],
        sadness: ['sad', 'upset', 'disappointed', 'down'],
        anger: ['angry', 'frustrated', 'annoyed', 'mad'],
        fear: ['worried', 'afraid', 'anxious', 'nervous']
    };

    for (const [emotion, keywords] of Object.entries(emotions)) {
        if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
            return {
                primaryEmotion: emotion,
                intensity: \${1:0.7},
                context: 'Detected from keywords',
                confidence: \${2:0.8}
            };
        }
    }

    return {
        primaryEmotion: 'neutral',
        intensity: 0.3,
        context: 'No specific emotion detected',
        confidence: 0.5
    };
}`);
        emotionAnalysis.documentation = new vscode.MarkdownString('Analyzes emotional context from text input');
        snippets.push(emotionAnalysis);

        return snippets;
    }

    private createOpenAISnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic OpenAI Agent
        const basicAgent = new vscode.CompletionItem('openai-agent', vscode.CompletionItemKind.Snippet);
        basicAgent.insertText = new vscode.SnippetString(`import OpenAI from 'openai';

class \${1:MyAgent}Agent {
    private openai: OpenAI;
    private conversationHistory: Array<{ role: string; content: string }> = [];

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        this.conversationHistory.push({
            role: 'system',
            content: '\${2:You are a helpful AI assistant.}'
        });
    }

    async processInput(input: string): Promise<string> {
        this.conversationHistory.push({
            role: 'user',
            content: input
        });

        const response = await this.openai.chat.completions.create({
            model: '\${3:gpt-4}',
            messages: this.conversationHistory,
            temperature: \${4:0.7},
            max_tokens: \${5:1000}
        });

        const assistantMessage = response.choices[0].message.content || '';
        
        this.conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    }

    getHistory() {
        return this.conversationHistory;
    }

    clearHistory() {
        this.conversationHistory = [{
            role: 'system',
            content: '\${2:You are a helpful AI assistant.}'
        }];
    }
}`);
        basicAgent.documentation = new vscode.MarkdownString('Creates a basic OpenAI chat agent with conversation memory');
        snippets.push(basicAgent);

        // Function Calling Setup
        const functionCalling = new vscode.CompletionItem('openai-function-calling', vscode.CompletionItemKind.Snippet);
        functionCalling.insertText = new vscode.SnippetString(`// Function calling setup
const functions = [
    {
        name: '\${1:get_weather}',
        description: '\${2:Get current weather for a location}',
        parameters: {
            type: 'object',
            properties: {
                \${3:location}: {
                    type: 'string',
                    description: '\${4:The city name}'
                }
            },
            required: ['\${3:location}']
        }
    }
];

const response = await this.openai.chat.completions.create({
    model: 'gpt-4',
    messages: this.conversationHistory,
    functions: functions,
    function_call: 'auto'
});

const message = response.choices[0].message;

if (message.function_call) {
    const functionName = message.function_call.name;
    const functionArgs = JSON.parse(message.function_call.arguments);
    
    // Execute the function
    const functionResult = await this.executeFunction(functionName, functionArgs);
    
    // Add function result to conversation
    this.conversationHistory.push({
        role: 'function',
        name: functionName,
        content: JSON.stringify(functionResult)
    });
}`);
        functionCalling.documentation = new vscode.MarkdownString('Sets up OpenAI function calling with proper schema');
        snippets.push(functionCalling);

        // Streaming Response
        const streaming = new vscode.CompletionItem('openai-streaming', vscode.CompletionItemKind.Snippet);
        streaming.insertText = new vscode.SnippetString(`async *streamResponse(input: string): AsyncGenerator<string, void, unknown> {
    const stream = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: input }],
        stream: true,
        temperature: \${1:0.7}
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            yield content;
        }
    }
}

// Usage:
async processStreamingInput(input: string): Promise<string> {
    let fullResponse = '';
    
    for await (const chunk of this.streamResponse(input)) {
        fullResponse += chunk;
        // Emit events or update UI here
        this.onTokenReceived?.(chunk);
    }
    
    return fullResponse;
}`);
        streaming.documentation = new vscode.MarkdownString('Creates streaming response functionality for real-time chat');
        snippets.push(streaming);

        return snippets;
    }

    private createLangGraphSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic LangGraph Workflow
        const basicWorkflow = new vscode.CompletionItem('langgraph-workflow', vscode.CompletionItemKind.Snippet);
        basicWorkflow.insertText = new vscode.SnippetString(`import { StateGraph, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

interface \${1:MyAgent}State {
    messages: Array<{ role: string; content: string }>;
    step: number;
    \${2:data}: any;
}

class \${1:MyAgent}Workflow {
    private graph: any;
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({
            modelName: '\${3:gpt-4}',
            temperature: \${4:0.7}
        });
        
        this.setupWorkflow();
    }

    private setupWorkflow() {
        const workflow = new StateGraph<\${1:MyAgent}State>({
            channels: {
                messages: { 
                    value: (prev: any[], next: any[]) => next,
                    default: () => []
                },
                step: {
                    value: (prev: number, next: number) => next,
                    default: () => 0
                },
                \${2:data}: {
                    value: (prev: any, next: any) => ({ ...prev, ...next }),
                    default: () => ({})
                }
            }
        });

        // Add nodes
        workflow.addNode('\${5:process}', this.\${5:process}Node.bind(this));
        workflow.addNode('\${6:validate}', this.\${6:validate}Node.bind(this));
        workflow.addNode('\${7:complete}', this.\${7:complete}Node.bind(this));

        // Set entry point
        workflow.setEntryPoint('\${5:process}');

        // Add edges
        workflow.addEdge('\${5:process}', '\${6:validate}');
        workflow.addConditionalEdges('\${6:validate}', this.shouldContinue.bind(this));
        workflow.addEdge('\${7:complete}', END);

        this.graph = workflow.compile();
    }

    private async \${5:process}Node(state: \${1:MyAgent}State): Promise<Partial<\${1:MyAgent}State>> {
        // Implement processing logic
        return {
            step: state.step + 1,
            \${2:data}: { processed: true }
        };
    }

    private async \${6:validate}Node(state: \${1:MyAgent}State): Promise<Partial<\${1:MyAgent}State>> {
        // Implement validation logic
        return {
            \${2:data}: { ...state.\${2:data}, validated: true }
        };
    }

    private async \${7:complete}Node(state: \${1:MyAgent}State): Promise<Partial<\${1:MyAgent}State>> {
        // Implement completion logic
        return {
            \${2:data}: { ...state.\${2:data}, completed: true }
        };
    }

    private shouldContinue(state: \${1:MyAgent}State): string {
        if (state.\${2:data}?.validated) {
            return '\${7:complete}';
        }
        return '\${5:process}';
    }

    async execute(input: string): Promise<any> {
        return await this.graph.invoke({
            messages: [{ role: 'user', content: input }],
            step: 0,
            \${2:data}: {}
        });
    }
}`);
        basicWorkflow.documentation = new vscode.MarkdownString('Creates a basic LangGraph workflow with state management');
        snippets.push(basicWorkflow);

        return snippets;
    }

    private createElizaSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic Eliza Character
        const basicCharacter = new vscode.CompletionItem('eliza-character', vscode.CompletionItemKind.Snippet);
        basicCharacter.insertText = new vscode.SnippetString(`import { AgentRuntime, Character, ModelProviderName } from '@elizaos/core';

const \${1:myAgent}Character: Character = {
    name: '\${2:MyAgent}',
    username: '\${3:myagent}',
    plugins: [],
    clients: [\${4:'discord'}],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        secrets: {
            \${5:DISCORD_APPLICATION_ID}: process.env.\${5:DISCORD_APPLICATION_ID},
            \${6:DISCORD_API_TOKEN}: process.env.\${6:DISCORD_API_TOKEN}
        },
        voice: {
            model: "en_US-hfc_female-medium"
        }
    },
    system: '\${7:You are a helpful AI assistant created with ElizaOS.}',
    bio: [
        '\${8:An AI agent powered by ElizaOS}',
        '\${9:Designed for autonomous interactions}'
    ],
    lore: [
        '\${10:Created using the ElizaOS framework}',
        '\${11:Focused on helpful and engaging conversations}'
    ],
    messageExamples: [
        [
            { user: '{{user1}}', content: { text: '\${12:Hello!}' } },
            { user: '\${2:MyAgent}', content: { text: '\${13:Hello! How can I help you today?}' } }
        ]
    ],
    postExamples: [
        '\${14:Just had an interesting conversation!}',
        '\${15:Learning something new every day.}'
    ],
    topics: [\${16:'technology', 'assistance', 'problem-solving'}],
    style: {
        all: [\${17:'helpful', 'informative', 'engaging'}],
        chat: [\${18:'conversational', 'supportive'}],
        post: [\${19:'thoughtful', 'inspiring'}]
    },
    adjectives: [\${20:'intelligent', 'helpful', 'reliable'}]
};

class \${1:MyAgent}Agent {
    private runtime: AgentRuntime;

    constructor() {
        this.runtime = new AgentRuntime({
            databaseAdapter: undefined,
            token: process.env.OPENAI_API_KEY!,
            modelProvider: ModelProviderName.OPENAI,
            character: \${1:myAgent}Character,
            plugins: []
        });
    }

    async initialize(): Promise<void> {
        await this.runtime.initialize();
        console.log('\${2:MyAgent} agent initialized successfully');
    }

    async start(): Promise<void> {
        await this.initialize();
        console.log('\${2:MyAgent} agent is now running');
    }
}`);
        basicCharacter.documentation = new vscode.MarkdownString('Creates a complete ElizaOS character configuration');
        snippets.push(basicCharacter);

        return snippets;
    }

    private createUniversalSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Error Handling
        const errorHandling = new vscode.CompletionItem('agent-error-handling', vscode.CompletionItemKind.Snippet);
        errorHandling.insertText = new vscode.SnippetString(`async processInput(input: string): Promise<string> {
    try {
        // Main processing logic
        \${1:// Implement your agent logic here}
        
        return response;
    } catch (error) {
        console.error('\${2:Agent processing error}:', error);
        
        // Graceful error handling
        if (error instanceof \${3:ValidationError}) {
            return 'I apologize, but I need more information to help you properly. Could you please rephrase your request?';
        }
        
        if (error instanceof \${4:NetworkError}) {
            return 'I\'m experiencing some connectivity issues. Please try again in a moment.';
        }
        
        // Generic error response
        return 'I apologize, but I encountered an unexpected issue. Let me try to help you in a different way.';
    }
}`);
        errorHandling.documentation = new vscode.MarkdownString('Adds comprehensive error handling to agent methods');
        snippets.push(errorHandling);

        // Logging System
        const loggingSystem = new vscode.CompletionItem('agent-logging', vscode.CompletionItemKind.Snippet);
        loggingSystem.insertText = new vscode.SnippetString(`class Logger {
    private static instance: Logger;
    private logs: Array<{ level: string; message: string; timestamp: Date; context?: any }> = [];

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    info(message: string, context?: any) {
        this.log('INFO', message, context);
    }

    warn(message: string, context?: any) {
        this.log('WARN', message, context);
    }

    error(message: string, context?: any) {
        this.log('ERROR', message, context);
    }

    debug(message: string, context?: any) {
        this.log('DEBUG', message, context);
    }

    private log(level: string, message: string, context?: any) {
        const logEntry = {
            level,
            message,
            timestamp: new Date(),
            context
        };
        
        this.logs.push(logEntry);
        console.log(\`[\${level}] \${message}\`, context || '');
        
        // Keep only last 1000 logs
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(-1000);
        }
    }

    getLogs(level?: string): Array<{ level: string; message: string; timestamp: Date; context?: any }> {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return [...this.logs];
    }
}

// Usage in agent:
private logger = Logger.getInstance();

async processInput(input: string): Promise<string> {
    this.logger.info('Processing input', { input: input.substring(0, 100) });
    
    try {
        // Processing logic
        const response = await this.generateResponse(input);
        this.logger.info('Response generated successfully');
        return response;
    } catch (error) {
        this.logger.error('Failed to process input', { error: error.message });
        throw error;
    }
}`);
        loggingSystem.documentation = new vscode.MarkdownString('Adds comprehensive logging system for agent debugging');
        snippets.push(loggingSystem);

        // Performance Monitoring
        const perfMonitoring = new vscode.CompletionItem('agent-performance', vscode.CompletionItemKind.Snippet);
        perfMonitoring.insertText = new vscode.SnippetString(`class PerformanceMonitor {
    private metrics: Map<string, Array<{ duration: number; timestamp: Date }>> = new Map();

    async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
        const start = Date.now();
        
        try {
            const result = await fn();
            const duration = Date.now() - start;
            this.recordMetric(operation, duration);
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            this.recordMetric(\`\${operation}_error\`, duration);
            throw error;
        }
    }

    private recordMetric(operation: string, duration: number) {
        if (!this.metrics.has(operation)) {
            this.metrics.set(operation, []);
        }
        
        const metrics = this.metrics.get(operation)!;
        metrics.push({ duration, timestamp: new Date() });
        
        // Keep only last 100 measurements
        if (metrics.length > 100) {
            metrics.splice(0, metrics.length - 100);
        }
    }

    getStats(operation: string) {
        const metrics = this.metrics.get(operation) || [];
        if (metrics.length === 0) return null;
        
        const durations = metrics.map(m => m.duration);
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        const min = Math.min(...durations);
        const max = Math.max(...durations);
        
        return { avg, min, max, count: metrics.length };
    }

    getAllStats() {
        const stats: Record<string, any> = {};
        for (const [operation] of this.metrics) {
            stats[operation] = this.getStats(operation);
        }
        return stats;
    }
}

// Usage in agent:
private perfMonitor = new PerformanceMonitor();

async processInput(input: string): Promise<string> {
    return await this.perfMonitor.measure('processInput', async () => {
        // Your processing logic here
        return await this.generateResponse(input);
    });
}`);
        perfMonitoring.documentation = new vscode.MarkdownString('Adds performance monitoring and metrics collection');
        snippets.push(perfMonitoring);

        return snippets;
    }

    private createVercelAISDKSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic Vercel AI SDK Agent
        const basicAgent = new vscode.CompletionItem('vercel-ai-agent', vscode.CompletionItemKind.Snippet);
        basicAgent.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

class \\${1:MyAgent}Agent {
    private model = openai('\\${2:gpt-4-turbo}');
    
    async processInput(userMessage: string): Promise<string> {
        const result = await generateText({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: '\\${3:You are a helpful AI assistant.}'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: \\${4:0.7},
            maxTokens: \\${5:1000},
        });

        return result.text;
    }
}`);
        basicAgent.documentation = new vscode.MarkdownString('Creates a basic Vercel AI SDK 5 Beta agent with generateText');
        snippets.push(basicAgent);

        // Streaming Agent
        const streamingAgent = new vscode.CompletionItem('vercel-ai-streaming', vscode.CompletionItemKind.Snippet);
        streamingAgent.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

async *streamResponse(userMessage: string): AsyncGenerator<string, void, unknown> {
    const result = await streamText({
        model: openai('\\${1:gpt-4-turbo}'),
        messages: [
            {
                role: 'system',
                content: '\\${2:You are a helpful AI assistant.}'
            },
            {
                role: 'user',
                content: userMessage
            }
        ],
        temperature: \\${3:0.7},
        maxTokens: \\${4:1000},
    });

    for await (const delta of result.textStream) {
        yield delta;
    }
}

// Usage example:
async function example() {
    for await (const chunk of streamResponse('Hello!')) {
        process.stdout.write(chunk);
    }
}`);
        streamingAgent.documentation = new vscode.MarkdownString('Creates streaming response functionality with Vercel AI SDK');
        snippets.push(streamingAgent);

        // Tool Calling Setup
        const toolCalling = new vscode.CompletionItem('vercel-ai-tools', vscode.CompletionItemKind.Snippet);
        toolCalling.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

// Define tools
const \\${1:myTool} = tool({
    description: '\\${2:Tool description}',
    parameters: z.object({
        \\${3:param}: z.string().describe('\\${4:Parameter description}'),
    }),
    execute: async ({ \\${3:param} }) => {
        // Tool implementation
        return { result: \\`Processing \\${\\${3:param}}\\` };
    },
});

// Use tools in agent
const result = await generateText({
    model: openai('gpt-4-turbo'),
    messages: [
        {
            role: 'user',
            content: '\\${5:Your message here}'
        }
    ],
    tools: {
        \\${1:myTool}: \\${1:myTool},
    },
    maxToolRoundtrips: \\${6:3},
});

console.log(result.text);`);
        toolCalling.documentation = new vscode.MarkdownString('Sets up tool calling with Vercel AI SDK 5 Beta');
        snippets.push(toolCalling);

        // Structured Output with generateObject
        const structuredOutput = new vscode.CompletionItem('vercel-ai-object', vscode.CompletionItemKind.Snippet);
        structuredOutput.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define output schema
const \\${1:outputSchema} = z.object({
    \\${2:field1}: z.string().describe('\\${3:Description of field1}'),
    \\${4:field2}: z.number().describe('\\${5:Description of field2}'),
    \\${6:field3}: z.array(z.string()).describe('\\${7:Description of field3}'),
});

// Generate structured output
const result = await generateObject({
    model: openai('gpt-4-turbo'),
    messages: [
        {
            role: 'user',
            content: '\\${8:Your prompt here}'
        }
    ],
    schema: \\${1:outputSchema},
    temperature: \\${9:0.3},
});

// result.object is now type-safe and matches your schema
console.log(result.object);`);
        structuredOutput.documentation = new vscode.MarkdownString('Generates structured output with type safety using generateObject');
        snippets.push(structuredOutput);

        // Multi-Provider Setup
        const multiProvider = new vscode.CompletionItem('vercel-ai-providers', vscode.CompletionItemKind.Snippet);
        multiProvider.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

type Provider = 'openai' | 'anthropic' | 'google';

function getModel(provider: Provider) {
    switch (provider) {
        case 'openai':
            return openai('\\${1:gpt-4-turbo}');
        case 'anthropic':
            return anthropic('\\${2:claude-3-haiku-20240307}');
        case 'google':
            return google('\\${3:gemini-pro}');
        default:
            throw new Error(\`Unknown provider: \\${provider}\`);
    }
}

async function generateWithProvider(
    provider: Provider,
    userMessage: string
): Promise<string> {
    const model = getModel(provider);
    
    const result = await generateText({
        model,
        messages: [
            {
                role: 'system',
                content: '\\${4:You are a helpful AI assistant.}'
            },
            {
                role: 'user',
                content: userMessage
            }
        ],
        temperature: \\${5:0.7},
    });

    return result.text;
}

// Usage
const response = await generateWithProvider('\\${6:openai}', 'Hello!');`);
        multiProvider.documentation = new vscode.MarkdownString('Sets up multi-provider support for OpenAI, Anthropic, and Google');
        snippets.push(multiProvider);

        // Multi-Modal Agent
        const multiModal = new vscode.CompletionItem('vercel-ai-multimodal', vscode.CompletionItemKind.Snippet);
        multiModal.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

async function processImageAndText(
    textPrompt: string,
    imageUrl: string
): Promise<string> {
    const result = await generateText({
        model: openai('\\${1:gpt-4-vision-preview}'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: textPrompt },
                    { type: 'image', image: imageUrl }
                ],
            }
        ],
        maxTokens: \\${2:1000},
    });

    return result.text;
}

// Usage examples
async function analyzeImage(imageUrl: string): Promise<string> {
    return processImageAndText(
        '\\${3:Analyze this image and describe what you see.}',
        imageUrl
    );
}

async function extractText(imageUrl: string): Promise<string> {
    return processImageAndText(
        '\\${4:Extract all visible text from this image.}',
        imageUrl
    );
}`);
        multiModal.documentation = new vscode.MarkdownString('Creates multi-modal agent for processing text and images');
        snippets.push(multiModal);

        // Conversation Memory
        const conversationMemory = new vscode.CompletionItem('vercel-ai-memory', vscode.CompletionItemKind.Snippet);
        conversationMemory.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

class ConversationAgent {
    private model = openai('\\${1:gpt-4-turbo}');
    private messages: Message[] = [];

    constructor(systemPrompt: string = '\\${2:You are a helpful AI assistant.}') {
        this.messages.push({
            role: 'system',
            content: systemPrompt
        });
    }

    async chat(userMessage: string): Promise<string> {
        // Add user message
        this.messages.push({
            role: 'user',
            content: userMessage
        });

        const result = await generateText({
            model: this.model,
            messages: this.messages,
            temperature: \\${3:0.7},
            maxTokens: \\${4:1000},
        });

        // Add assistant response
        this.messages.push({
            role: 'assistant',
            content: result.text
        });

        return result.text;
    }

    getHistory(): Message[] {
        return [...this.messages];
    }

    clearHistory(): void {
        // Keep only system message
        this.messages = this.messages.filter(msg => msg.role === 'system');
    }
}

// Usage
const agent = new ConversationAgent();
const response = await agent.chat('Hello!');`);
        conversationMemory.documentation = new vscode.MarkdownString('Implements conversation memory for persistent chat history');
        snippets.push(conversationMemory);

        // Error Handling
        const errorHandling = new vscode.CompletionItem('vercel-ai-error-handling', vscode.CompletionItemKind.Snippet);
        errorHandling.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

async function safeGenerate(userMessage: string): Promise<string> {
    try {
        const result = await generateText({
            model: openai('\\${1:gpt-4-turbo}'),
            messages: [
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            temperature: \\${2:0.7},
            maxTokens: \\${3:1000},
        });

        return result.text;

    } catch (error) {
        console.error('AI generation error:', error);

        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('rate limit')) {
                return 'I\\'m currently experiencing high demand. Please try again in a moment.';
            }
            
            if (error.message.includes('content filter')) {
                return 'I can\\'t process that request. Please try rephrasing your message.';
            }
            
            if (error.message.includes('timeout')) {
                return 'The request took too long to process. Please try a simpler query.';
            }
        }

        // Generic fallback
        return 'I\\'m sorry, I encountered an issue processing your request. Please try again.';
    }
}

// Usage with retry logic
async function generateWithRetry(
    userMessage: string,
    maxRetries: number = \\${4:3}
): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await safeGenerate(userMessage);
        } catch (error) {
            if (attempt === maxRetries) {
                return 'Unable to process request after multiple attempts.';
            }
            
            // Exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
        }
    }
    
    return 'Request failed.';
}`);
        errorHandling.documentation = new vscode.MarkdownString('Adds comprehensive error handling and retry logic for AI requests');
        snippets.push(errorHandling);

        return snippets;
    }
}

export function registerSnippetProvider(context: vscode.ExtensionContext) {
    const snippetProvider = new AIAgentSnippetProvider();
    
    // Register for TypeScript and JavaScript files
    const tsProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'typescript' },
        snippetProvider,
        'symindx', 'openai', 'langgraph', 'eliza', 'vercel', 'ai', 'agent'
    );
    
    const jsProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'javascript' },
        snippetProvider,
        'symindx', 'openai', 'langgraph', 'eliza', 'vercel', 'ai', 'agent'
    );
    
    context.subscriptions.push(tsProvider, jsProvider);
    
    console.log('AI Agent Studio snippet providers registered');
}