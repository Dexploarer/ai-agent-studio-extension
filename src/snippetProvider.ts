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

        // CrewAI Snippets
        const crewaiSnippets = this.createCrewAISnippets();
        completionItems.push(...crewaiSnippets);

        // AutoGen Snippets
        const autogenSnippets = this.createAutoGenSnippets();
        completionItems.push(...autogenSnippets);

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

        // Basic OpenAI Agent - Updated for July 2025
        const basicAgent = new vscode.CompletionItem('openai-agent', vscode.CompletionItemKind.Snippet);
        basicAgent.insertText = new vscode.SnippetString(`import { Agent, run } from '@openai/agents';

const \${1:myAgent} = new Agent({
    name: '\${2:Assistant}',
    instructions: '\${3:You are a helpful assistant}',
    model: '\${4:gpt-4o}',
    temperature: \${5:0.7}
});

// Basic usage
async function main() {
    const result = await run(
        \${1:myAgent},
        '\${6:Write a haiku about recursion in programming.}'
    );
    console.log(result.finalOutput);
}

main().catch(console.error);`);
        basicAgent.documentation = new vscode.MarkdownString('Creates a basic OpenAI Agent using the latest @openai/agents SDK (July 2025)');
        snippets.push(basicAgent);

        // Tool Calling Setup - Updated for July 2025
        const toolCalling = new vscode.CompletionItem('openai-tool-calling', vscode.CompletionItemKind.Snippet);
        toolCalling.insertText = new vscode.SnippetString(`import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

const \${1:weatherTool} = tool({
    name: '\${2:get_weather}',
    description: '\${3:Get the weather for a given city}',
    parameters: z.object({ 
        \${4:city}: z.string().describe('\${5:The city to get weather for}')
    }),
    execute: async (input) => {
        // Implement your tool logic here
        return \`The weather in \${input.\${4:city}} is \${6:sunny}\`;
    },
});

const agent = new Agent({
    name: '\${7:DataAgent}',
    instructions: '\${8:You are a data agent}',
    tools: [\${1:weatherTool}],
});

// Use the agent with tools
async function main() {
    const result = await run(agent, '\${9:What is the weather in Tokyo?}');
    console.log(result.finalOutput);
}

main().catch(console.error);`);
        toolCalling.documentation = new vscode.MarkdownString('Sets up OpenAI Agents SDK with tool calling using Zod for parameter validation (July 2025)');
        snippets.push(toolCalling);

        // Realtime Voice Agent - New in July 2025
        const realtimeAgent = new vscode.CompletionItem('openai-realtime-agent', vscode.CompletionItemKind.Snippet);
        realtimeAgent.insertText = new vscode.SnippetString(`import { RealtimeAgent, RealtimeSession, tool } from '@openai/agents-realtime';
import { z } from 'zod';

const \${1:weatherTool} = tool({
    name: '\${2:get_weather}',
    description: '\${3:Get the weather for a given city}',
    parameters: z.object({ 
        \${4:city}: z.string() 
    }),
    execute: async (input) => {
        return \`The weather in \${input.\${4:city}} is sunny\`;
    },
});

const agent = new RealtimeAgent({
    name: '\${5:VoiceAgent}',
    instructions: '\${6:You are a helpful voice assistant}',
    tools: [\${1:weatherTool}],
});

// For browser environments
const { apiKey } = await fetch('/path/to/ephemeral/key/generation').then(
    (resp) => resp.json(),
);

// Automatically configures audio input/output
const session = new RealtimeSession(agent);
await session.connect({ apiKey });`);
        realtimeAgent.documentation = new vscode.MarkdownString('Creates a real-time voice agent with tools for browser-based applications (July 2025)');
        snippets.push(realtimeAgent);

        // Agent Handoffs - New in July 2025
        const handoffs = new vscode.CompletionItem('openai-agent-handoffs', vscode.CompletionItemKind.Snippet);
        handoffs.insertText = new vscode.SnippetString(`import { Agent, run } from '@openai/agents';

// Create specialized agents
const \${1:triageAgent} = new Agent({
    name: '\${2:TriageAgent}',
    instructions: '\${3:You route questions to the appropriate specialist}',
});

const \${4:technicalAgent} = new Agent({
    name: '\${5:TechnicalAgent}',
    instructions: '\${6:You handle technical questions}',
});

const \${7:generalAgent} = new Agent({
    name: '\${8:GeneralAgent}',
    instructions: '\${9:You handle general inquiries}',
});

// Implement handoff logic
async function handleRequest(query: string) {
    // First, let triage agent decide
    const triageResult = await run(\${1:triageAgent}, query);
    
    // Based on triage result, route to appropriate agent
    if (triageResult.finalOutput.includes('technical')) {
        return await run(\${4:technicalAgent}, query);
    } else {
        return await run(\${7:generalAgent}, query);
    }
}

// Usage
const result = await handleRequest('\${10:How do I debug a React app?}');
console.log(result.finalOutput);`);
        handoffs.documentation = new vscode.MarkdownString('Demonstrates agent handoffs for routing tasks between specialized agents (July 2025)');
        snippets.push(handoffs);

        return snippets;
    }

    private createLangGraphSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic LangGraph Workflow - Updated for July 2025
        const basicWorkflow = new vscode.CompletionItem('langgraph-workflow', vscode.CompletionItemKind.Snippet);
        basicWorkflow.insertText = new vscode.SnippetString(`import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';

// Define your tools
const tools = [\${1:/* your tools here */}];
const toolNode = new ToolNode(tools);
const model = new ChatOpenAI({ model: '\${2:gpt-4o}' }).bindTools(tools);

// Define the routing logic
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1] as AIMessage;
    
    // If no tools are called, we can finish
    if (!lastMessage?.tool_calls?.length) {
        return END;
    }
    // Otherwise continue to tools
    return 'tools';
}

// Define the agent node
async function callModel(state: typeof MessagesAnnotation.State) {
    const { messages } = state;
    const response = await model.invoke(messages);
    return { messages: [response] };
}

// Build the workflow
const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addNode('tools', toolNode)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue, {
        tools: 'tools',
        [END]: END
    })
    .addEdge('tools', 'agent');

const app = workflow.compile();

// Usage
const result = await app.invoke({
    messages: [{ role: 'user', content: '\${3:Your message here}' }]
});`);
        basicWorkflow.documentation = new vscode.MarkdownString('Creates a basic LangGraph workflow with tool support (July 2025)');
        snippets.push(basicWorkflow);

        // React Agent with LangGraph - New Pattern
        const reactAgent = new vscode.CompletionItem('langgraph-react-agent', vscode.CompletionItemKind.Snippet);
        reactAgent.insertText = new vscode.SnippetString(`import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Define your tools
const \${1:searchTool} = tool({
    name: '\${2:search}',
    description: '\${3:Search for information}',
    schema: z.object({
        \${4:query}: z.string().describe('\${5:The search query}')
    }),
    func: async ({ \${4:query} }) => {
        // Implement your tool logic
        return \`Results for \${\${4:query}}\`;
    }
});

const tools = [\${1:searchTool}];
const model = new ChatOpenAI({ model: '\${6:gpt-4o}' });

// Create the agent
const agent = createReactAgent({
    llm: model,
    tools: tools,
    stateModifier: '\${7:You are a helpful assistant. Think step by step.}'
});

// Usage
const result = await agent.invoke({
    messages: [{ role: 'user', content: '\${8:Search for LangGraph tutorials}' }]
});

console.log(result.messages);`);
        reactAgent.documentation = new vscode.MarkdownString('Creates a ReAct-style agent using LangGraph prebuilt components (July 2025)');
        snippets.push(reactAgent);

        // Multi-Agent Network - New Pattern  
        const multiAgent = new vscode.CompletionItem('langgraph-multi-agent', vscode.CompletionItemKind.Snippet);
        multiAgent.insertText = new vscode.SnippetString(`import { StateGraph, MessagesAnnotation, Command } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

const model = new ChatOpenAI({ model: '\${1:gpt-4o}' });

// Define agent nodes that can hand off to each other
const \${2:agent1} = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.withStructuredOutput({
        response: z.string(),
        next_agent: z.enum(['\${3:agent2}', '\${4:agent3}', '__end__'])
    }).invoke([
        { role: 'system', content: '\${5:You are agent 1. Route to other agents as needed.}' },
        ...state.messages
    ]);
    
    return new Command({
        update: { messages: [{ role: 'assistant', content: response.response }] },
        goto: response.next_agent
    });
};

const \${3:agent2} = async (state: typeof MessagesAnnotation.State) => {
    // Similar implementation
    const response = await model.withStructuredOutput({
        response: z.string(),
        next_agent: z.enum(['\${2:agent1}', '\${4:agent3}', '__end__'])
    }).invoke([
        { role: 'system', content: '\${6:You are agent 2. Handle specific tasks.}' },
        ...state.messages
    ]);
    
    return new Command({
        update: { messages: [{ role: 'assistant', content: response.response }] },
        goto: response.next_agent
    });
};

const \${4:agent3} = async (state: typeof MessagesAnnotation.State) => {
    // Final agent implementation
    const response = await model.invoke([
        { role: 'system', content: '\${7:You are agent 3. Finalize the task.}' },
        ...state.messages
    ]);
    
    return new Command({
        update: { messages: [response] },
        goto: '__end__'
    });
};

// Build the graph
const graph = new StateGraph(MessagesAnnotation)
    .addNode('\${2:agent1}', \${2:agent1}, { ends: ['\${3:agent2}', '\${4:agent3}', '__end__'] })
    .addNode('\${3:agent2}', \${3:agent2}, { ends: ['\${2:agent1}', '\${4:agent3}', '__end__'] })
    .addNode('\${4:agent3}', \${4:agent3}, { ends: ['__end__'] })
    .addEdge('__start__', '\${2:agent1}')
    .compile();

// Usage
const result = await graph.invoke({
    messages: [{ role: 'user', content: '\${8:Your complex task here}' }]
});`);
        multiAgent.documentation = new vscode.MarkdownString('Creates a multi-agent network where agents can hand off tasks to each other (July 2025)');
        snippets.push(multiAgent);

        return snippets;
    }

    private createElizaSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic Eliza Character - Updated for July 2025
        const basicCharacter = new vscode.CompletionItem('eliza-character', vscode.CompletionItemKind.Snippet);
        basicCharacter.insertText = new vscode.SnippetString(`import { Character } from '@elizaos/core';

export const character: Character = {
    name: '\${1:MyAgent}',
    description: '\${2:A helpful AI assistant}',
    plugins: [
        '@elizaos/plugin-bootstrap',
        '@elizaos/plugin-sql',
        ...(!process.env.IGNORE_BOOTSTRAP ? ['@elizaos/plugin-bootstrap'] : []),
        ...(process.env.DISCORD_API_TOKEN ? ['@elizaos/plugin-discord'] : []),
        ...(process.env.OPENAI_API_KEY ? ['@elizaos/plugin-openai'] : [])
    ],
    settings: {
        secrets: {},
        avatar: '\${3:https://example.com/avatar.png}'
    },
    system: '\${4:Respond to all messages in a helpful, conversational manner...}',
    bio: [
        '\${5:Engages with all types of questions and conversations}',
        '\${6:Provides helpful, concise responses}'
    ],
    topics: ['\${7:general knowledge}', '\${8:problem solving}', '\${9:technology}'],
    messageExamples: [
        [
            {
                name: '{{user}}',
                content: { text: '\${10:Can you help me debug this?}' }
            },
            {
                name: '\${1:MyAgent}',
                content: { text: '\${11:I\'d be happy to help! Can you share the error message?}' }
            }
        ]
    ],
    style: {
        all: ['\${12:Keep responses concise}', '\${13:Use clear language}'],
        chat: ['\${14:Be conversational}', '\${15:Show personality}']
    }
};`);
        basicCharacter.documentation = new vscode.MarkdownString('Creates a complete ElizaOS character configuration with conditional plugin loading (July 2025)');
        snippets.push(basicCharacter);

        // ElizaOS with Custom Action
        const customAction = new vscode.CompletionItem('eliza-custom-action', vscode.CompletionItemKind.Snippet);
        customAction.insertText = new vscode.SnippetString(`import { Action, AgentRuntime, Character } from '@elizaos/core';

const \${1:myCustom}Action: Action = {
    name: '\${2:MY_CUSTOM_ACTION}',
    similes: ['\${3:CUSTOM}', '\${4:ACTION}'],
    description: '\${5:Performs a custom action}',
    
    validate: async (runtime: AgentRuntime, message: any) => {
        // Return true if this action should be executed
        return message.content.text.toLowerCase().includes('\${6:custom}');
    },
    
    handler: async (runtime, message, state, options, callback) => {
        try {
            // Implement your action logic here
            const result = await \${7:performCustomLogic}(message.content.text);
            
            await callback({
                text: \`\${8:Action completed: \${result}}\`,
                action: '\${2:MY_CUSTOM_ACTION}'
            });
            
            return true;
        } catch (error) {
            console.error('Error in custom action:', error);
            await callback({
                text: '\${9:Sorry, I encountered an error performing that action.}'
            });
            return false;
        }
    }
};

// Add to your character's actions
export const character: Character = {
    name: '\${10:MyAgent}',
    // ... other character config ...
    actions: [\${1:myCustom}Action]
};`);
        customAction.documentation = new vscode.MarkdownString('Creates a custom action for ElizaOS agents (July 2025)');
        snippets.push(customAction);

        // ElizaOS Plugin Template
        const pluginTemplate = new vscode.CompletionItem('eliza-plugin', vscode.CompletionItemKind.Snippet);
        pluginTemplate.insertText = new vscode.SnippetString(`import { Plugin, Action, Provider, Evaluator } from '@elizaos/core';

const \${1:myPlugin}Plugin: Plugin = {
    name: '\${2:my-plugin}',
    description: '\${3:Custom plugin for ElizaOS}',
    
    actions: [
        {
            name: '\${4:PLUGIN_ACTION}',
            description: '\${5:Plugin action description}',
            validate: async (runtime, message) => true,
            handler: async (runtime, message, state, options, callback) => {
                // Action implementation
                await callback({ text: '\${6:Action executed}' });
                return true;
            }
        }
    ],
    
    providers: [
        {
            name: '\${7:PLUGIN_PROVIDER}',
            description: '\${8:Provides data for the plugin}',
            get: async (runtime, message) => {
                return {
                    data: { \${9:key}: '\${10:value}' },
                    text: '\${11:Provider data retrieved}'
                };
            }
        }
    ],
    
    evaluators: [
        {
            name: '\${12:PLUGIN_EVALUATOR}',
            description: '\${13:Evaluates plugin conditions}',
            validate: async (runtime, message) => true,
            handler: async (runtime, message, state) => {
                return { \${14:evaluated}: true };
            }
        }
    ],
    
    services: []
};

export default \${1:myPlugin}Plugin;`);
        pluginTemplate.documentation = new vscode.MarkdownString('Creates a complete ElizaOS plugin with actions, providers, and evaluators (July 2025)');
        snippets.push(pluginTemplate);

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

        // Tool Calling Setup - Updated for July 2025
        const toolCalling = new vscode.CompletionItem('vercel-ai-tools', vscode.CompletionItemKind.Snippet);
        toolCalling.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

// Define tools with inputSchema (v5 syntax)
const \\${1:myTool} = tool({
    description: '\\${2:Tool description}',
    inputSchema: z.object({
        \\${3:param}: z.string().describe('\\${4:Parameter description}'),
    }),
    outputSchema: z.object({
        result: z.string(),
        status: z.enum(['success', 'error'])
    }),
    execute: async ({ \\${3:param} }) => {
        // Tool implementation
        return { 
            result: \\`Processed \\${\\${3:param}}\\`,
            status: 'success'
        };
    },
});

// Use tools in agent
const result = await generateText({
    model: openai('\\${5:gpt-4o}'),
    messages: [
        {
            role: 'user',
            content: '\\${6:Your message here}'
        }
    ],
    tools: {
        \\${1:myTool}: \\${1:myTool},
    },
    activeTools: ['\\${1:myTool}'], // v5: no experimental_ prefix
});

console.log(result.text);
console.log(result.toolCalls);`);
        toolCalling.documentation = new vscode.MarkdownString('Sets up tool calling with Vercel AI SDK 5 with input/output schemas (July 2025)');
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

        // Provider-Executed Tools (OpenAI Native) - July 2025
        const providerTools = new vscode.CompletionItem('vercel-ai-provider-tools', vscode.CompletionItemKind.Snippet);
        providerTools.insertText = new vscode.SnippetString(`import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Use OpenAI's built-in tools
const result = await generateText({
    model: openai('\\${1:gpt-4o}'),
    tools: {
        file_search: openai.tools.fileSearch(),
        web_search_preview: openai.tools.webSearchPreview({
            searchContextSize: '\\${2:high}'
        })
    },
    messages: [
        {
            role: 'user',
            content: '\\${3:Search for information about AI advancements}'
        }
    ]
});

console.log('Response:', result.text);
console.log('Sources:', result.sources);

// Alternative: Gemini with search grounding
const geminiResult = await generateText({
    model: google('\\${4:gemini-1.5-pro}', {
        useSearchGrounding: true,
    }),
    prompt: '\\${5:List the latest tech news from this week}'
});

console.log('Gemini response:', geminiResult.text);
console.log('Grounding metadata:', geminiResult.providerMetadata?.google);`);
        providerTools.documentation = new vscode.MarkdownString('Uses provider-executed tools like OpenAI file/web search and Gemini grounding (July 2025)');
        snippets.push(providerTools);

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

    private createCrewAISnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic CrewAI Agent - July 2025
        const basicAgent = new vscode.CompletionItem('crewai-agent', vscode.CompletionItemKind.Snippet);
        basicAgent.insertText = new vscode.SnippetString(`from crewai import Agent
from langchain_openai import ChatOpenAI

\${1:researcher} = Agent(
    role='\${2:Senior Research Analyst}',
    goal='\${3:Uncover cutting-edge developments in AI and data science}',
    backstory='''
        \${4:You are a Senior Research Analyst at a leading tech think tank.
        Your expertise lies in identifying emerging trends and technologies.
        You have a knack for dissecting complex data and presenting insights.}
    ''',
    verbose=True,
    allow_delegation=\${5:False},
    tools=[\${6:# Add tools here}],
    llm=ChatOpenAI(model='\${7:gpt-4o}', temperature=\${8:0.7})
)`);
        basicAgent.documentation = new vscode.MarkdownString('Creates a CrewAI agent with full configuration (July 2025)');
        snippets.push(basicAgent);

        // CrewAI Task - July 2025
        const task = new vscode.CompletionItem('crewai-task', vscode.CompletionItemKind.Snippet);
        task.insertText = new vscode.SnippetString(`from crewai import Task

\${1:research_task} = Task(
    description='''\${2:
        Conduct comprehensive research on the latest advancements in AI.
        Identify key trends, breakthrough technologies, and potential impacts.
        Make sure to check with the latest sources.
    }''',
    expected_output='\${3:A comprehensive report on AI advancements with key insights}',
    agent=\${4:researcher},
    tools=[\${5:# Optional: specific tools for this task}]
)`);
        task.documentation = new vscode.MarkdownString('Creates a CrewAI task with detailed configuration (July 2025)');
        snippets.push(task);

        // CrewAI Crew with Process - July 2025
        const crew = new vscode.CompletionItem('crewai-crew', vscode.CompletionItemKind.Snippet);
        crew.insertText = new vscode.SnippetString(`from crewai import Crew, Process

\${1:crew} = Crew(
    agents=[\${2:researcher, writer, critic}],
    tasks=[\${3:research_task, writing_task, review_task}],
    process=Process.\${4|sequential,hierarchical|},
    verbose=\${5:True},
    memory=\${6:True}
)

# Execute the crew
result = \${1:crew}.kickoff()
print(result)`);
        crew.documentation = new vscode.MarkdownString('Creates a CrewAI crew with process configuration (July 2025)');
        snippets.push(crew);

        // CrewAI with Tools - July 2025
        const withTools = new vscode.CompletionItem('crewai-with-tools', vscode.CompletionItemKind.Snippet);
        withTools.insertText = new vscode.SnippetString(`from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool, WebsiteSearchTool
import os

# Set up tools
os.environ["SERPER_API_KEY"] = "\${1:Your Key}"
search_tool = SerperDevTool()
web_tool = WebsiteSearchTool()

# Create agent with tools
\${2:researcher} = Agent(
    role='\${3:Market Research Analyst}',
    goal='\${4:Provide up-to-date market analysis}',
    backstory='\${5:Expert analyst with a keen eye for trends}',
    tools=[search_tool, web_tool],
    verbose=True
)

# Create task
\${6:research_task} = Task(
    description='\${7:Research the latest trends in AI}',
    expected_output='\${8:A summary of top 5 trends}',
    agent=\${2:researcher}
)

# Create and run crew
crew = Crew(
    agents=[\${2:researcher}],
    tasks=[\${6:research_task}],
    verbose=True
)

result = crew.kickoff()
print(result)`);
        withTools.documentation = new vscode.MarkdownString('Complete CrewAI setup with tools integration (July 2025)');
        snippets.push(withTools);

        return snippets;
    }

    private createAutoGenSnippets(): vscode.CompletionItem[] {
        const snippets: vscode.CompletionItem[] = [];

        // Basic AutoGen Assistant Agent - July 2025
        const assistantAgent = new vscode.CompletionItem('autogen-agent', vscode.CompletionItemKind.Snippet);
        assistantAgent.insertText = new vscode.SnippetString(`from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Initialize model client
model_client = OpenAIChatCompletionClient(model='\${1:gpt-4o}')

\${2:assistant} = AssistantAgent(
    name='\${3:Assistant}',
    description='\${4:A helpful AI assistant}',
    system_message='''\${5:
        You are a helpful AI assistant.
        Provide clear, concise, and accurate responses.
        Think step by step when solving problems.
    }''',
    model_client=model_client,
    tools=[\${6:# Add tools here}]
)`);
        assistantAgent.documentation = new vscode.MarkdownString('Creates an AutoGen assistant agent with v0.4 API (July 2025)');
        snippets.push(assistantAgent);

        // AutoGen Selector Group Chat - July 2025
        const selectorChat = new vscode.CompletionItem('autogen-selector-chat', vscode.CompletionItemKind.Snippet);
        selectorChat.insertText = new vscode.SnippetString(`from autogen_agentchat.teams import SelectorGroupChat
from autogen_agentchat.conditions import TextMentionTermination, MaxMessageTermination
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Create termination conditions
text_termination = TextMentionTermination('\${1:TERMINATE}')
max_messages = MaxMessageTermination(max_messages=\${2:25})
termination = text_termination | max_messages

# Define selector function (optional)
def selector_func(messages):
    \${3:# Custom logic to select next speaker
    # Return agent name or None for LLM selection}
    return None

# Create team
team = SelectorGroupChat(
    [\${4:planning_agent, search_agent, analyst_agent}],
    model_client=OpenAIChatCompletionClient(model='\${5:gpt-4o-mini}'),
    termination_condition=termination,
    selector_func=selector_func,
    allow_repeated_speaker=\${6:True}
)

# Run the chat
await Console(team.run_stream(task='\${7:Your task here}'))`);
        selectorChat.documentation = new vscode.MarkdownString('Creates AutoGen selector group chat with dynamic speaker selection (July 2025)');
        snippets.push(selectorChat);

        // AutoGen Round Robin Chat - July 2025
        const roundRobin = new vscode.CompletionItem('autogen-roundrobin', vscode.CompletionItemKind.Snippet);
        roundRobin.insertText = new vscode.SnippetString(`from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.ui import Console
import asyncio

# Create termination condition
termination = TextMentionTermination('\${1:APPROVE}')

# Create round robin group chat
group_chat = RoundRobinGroupChat(
    [\${2:writer, critic}],
    termination_condition=termination,
    max_turns=\${3:12}
)

# Run the chat
async def main():
    stream = group_chat.run_stream(task='\${4:Write a short story}')
    await Console(stream)

asyncio.run(main())`);
        roundRobin.documentation = new vscode.MarkdownString('Creates AutoGen round-robin group chat (July 2025)');
        snippets.push(roundRobin);

        // AutoGen with Tools - July 2025
        const withTools = new vscode.CompletionItem('autogen-with-tools', vscode.CompletionItemKind.Snippet);
        withTools.insertText = new vscode.SnippetString(`from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Define mock tools
def \${1:search_web_tool}(query: str) -> str:
    '''Search the web for information'''
    # Implement your tool logic
    return f"Results for {query}"

def \${2:calculate_tool}(expression: str) -> float:
    '''Perform calculations'''
    # Implement calculation logic
    return eval(expression)

# Create model client
model_client = OpenAIChatCompletionClient(model='\${3:gpt-4o}')

# Create agents with tools
\${4:search_agent} = AssistantAgent(
    name='\${5:SearchAgent}',
    description='\${6:Agent that searches for information}',
    tools=[\${1:search_web_tool}],
    model_client=model_client,
    system_message='\${7:You search for information using the provided tools}'
)

\${8:calc_agent} = AssistantAgent(
    name='\${9:CalculatorAgent}',
    description='\${10:Agent that performs calculations}',
    tools=[\${2:calculate_tool}],
    model_client=model_client,
    system_message='\${11:You perform calculations using the provided tools}'
)`);
        withTools.documentation = new vscode.MarkdownString('Creates AutoGen agents with tool integration (July 2025)');
        snippets.push(withTools);

        return snippets;
    }
}

export function registerSnippetProvider(context: vscode.ExtensionContext) {
    const snippetProvider = new AIAgentSnippetProvider();
    
    // Register for TypeScript and JavaScript files
    const tsProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'typescript' },
        snippetProvider,
        'symindx', 'openai', 'langgraph', 'eliza', 'vercel', 'ai', 'agent', 'crewai', 'autogen'
    );
    
    const jsProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'javascript' },
        snippetProvider,
        'symindx', 'openai', 'langgraph', 'eliza', 'vercel', 'ai', 'agent', 'crewai', 'autogen'
    );
    
    context.subscriptions.push(tsProvider, jsProvider);
    
    console.log('AI Agent Studio snippet providers registered');
}