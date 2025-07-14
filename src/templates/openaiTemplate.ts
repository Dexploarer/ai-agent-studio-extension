export const openaiProjectTemplate = {
    packageJson: (projectName: string) => ({
        name: projectName,
        version: "1.0.0",
        description: "OpenAI Agents SDK Project",
        main: "dist/index.js",
        scripts: {
            build: "tsc",
            start: "node dist/index.js",
            dev: "ts-node src/index.ts",
            test: "jest"
        },
        dependencies: {
            "openai": "^4.20.0",
            "dotenv": "^16.3.1",
            "zod": "^3.22.4"
        },
        devDependencies: {
            "@types/node": "^20.8.0",
            "typescript": "^5.2.2",
            "ts-node": "^10.9.1",
            "jest": "^29.7.0",
            "@types/jest": "^29.5.5"
        }
    }),

    indexTs: (projectName: string) => `import OpenAI from 'openai';
import { config } from 'dotenv';
import { z } from 'zod';

config();

// Input validation schemas
const MessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
});

const ChatRequestSchema = z.object({
    messages: z.array(MessageSchema),
    model: z.string().default('gpt-4'),
    temperature: z.number().min(0).max(2).default(0.7),
    max_tokens: z.number().positive().optional()
});

interface AgentConfig {
    name: string;
    systemPrompt: string;
    model: string;
    temperature: number;
    maxTokens?: number;
}

interface ConversationMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export class ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    private openai: OpenAI;
    private config: AgentConfig;
    private conversationHistory: ConversationMessage[] = [];
    private tools: Map<string, Function> = new Map();

    constructor(config: AgentConfig) {
        this.config = config;
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Add system message to conversation history
        this.conversationHistory.push({
            role: 'system',
            content: config.systemPrompt,
            timestamp: new Date()
        });

        // Setup default tools
        this.setupDefaultTools();
    }

    private setupDefaultTools(): void {
        // Weather tool example
        this.addTool('get_weather', 'Get current weather for a location', {
            location: 'string'
        }, async (args: { location: string }) => {
            // Mock weather data - in real implementation, call weather API
            return {
                location: args.location,
                temperature: 72,
                condition: 'sunny',
                humidity: 45
            };
        });

        // Calculator tool
        this.addTool('calculate', 'Perform mathematical calculations', {
            expression: 'string'
        }, async (args: { expression: string }) => {
            try {
                // Simple calculator - in production, use a proper math parser
                const result = eval(args.expression.replace(/[^0-9+\\-*/.() ]/g, ''));
                return { result, expression: args.expression };
            } catch (error) {
                return { error: 'Invalid mathematical expression' };
            }
        });

        // Memory tool
        this.addTool('remember_fact', 'Store important information for later use', {
            key: 'string',
            value: 'string'
        }, async (args: { key: string; value: string }) => {
            // In production, store in database
            return { stored: true, key: args.key, value: args.value };
        });
    }

    public addTool(name: string, description: string, parameters: Record<string, string>, handler: Function): void {
        this.tools.set(name, handler);
        console.log(\`Added tool: \${name} - \${description}\`);
    }

    async chat(userMessage: string, options?: {
        temperature?: number;
        maxTokens?: number;
        useTools?: boolean;
    }): Promise<string> {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date()
            });

            // Prepare messages for OpenAI
            const messages = this.conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Validate request
            const validatedRequest = ChatRequestSchema.parse({
                messages,
                model: this.config.model,
                temperature: options?.temperature ?? this.config.temperature,
                max_tokens: options?.maxTokens ?? this.config.maxTokens
            });

            // Setup function calling if tools are enabled
            const functions = options?.useTools ? this.buildFunctionDefinitions() : undefined;

            const response = await this.openai.chat.completions.create({
                ...validatedRequest,
                functions: functions,
                function_call: functions ? 'auto' : undefined
            });

            const assistantMessage = response.choices[0].message;
            
            // Handle function calls
            if (assistantMessage.function_call) {
                const functionResult = await this.handleFunctionCall(assistantMessage.function_call);
                
                // Add function call and result to conversation
                this.conversationHistory.push({
                    role: 'assistant',
                    content: assistantMessage.content || \`Called function: \${assistantMessage.function_call.name}\`,
                    timestamp: new Date()
                });

                // Get final response after function execution
                const finalResponse = await this.openai.chat.completions.create({
                    model: this.config.model,
                    messages: [
                        ...this.conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
                        {
                            role: 'function',
                            name: assistantMessage.function_call.name,
                            content: JSON.stringify(functionResult)
                        }
                    ],
                    temperature: validatedRequest.temperature
                });

                const finalMessage = finalResponse.choices[0].message.content || 'No response generated';
                
                this.conversationHistory.push({
                    role: 'assistant',
                    content: finalMessage,
                    timestamp: new Date()
                });

                return finalMessage;
            } else {
                const responseContent = assistantMessage.content || 'No response generated';
                
                this.conversationHistory.push({
                    role: 'assistant',
                    content: responseContent,
                    timestamp: new Date()
                });

                return responseContent;
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = \`I apologize, but I encountered an error: \${error instanceof Error ? error.message : 'Unknown error'}\`;
            
            this.conversationHistory.push({
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date()
            });

            return errorMessage;
        }
    }

    private buildFunctionDefinitions(): any[] {
        const functions = [];
        
        // Add weather function
        functions.push({
            name: 'get_weather',
            description: 'Get current weather for a location',
            parameters: {
                type: 'object',
                properties: {
                    location: {
                        type: 'string',
                        description: 'The city and state, e.g. San Francisco, CA'
                    }
                },
                required: ['location']
            }
        });

        // Add calculator function
        functions.push({
            name: 'calculate',
            description: 'Perform mathematical calculations',
            parameters: {
                type: 'object',
                properties: {
                    expression: {
                        type: 'string',
                        description: 'Mathematical expression to evaluate'
                    }
                },
                required: ['expression']
            }
        });

        return functions;
    }

    private async handleFunctionCall(functionCall: any): Promise<any> {
        const { name, arguments: args } = functionCall;
        const tool = this.tools.get(name);
        
        if (!tool) {
            return { error: \`Function \${name} not found\` };
        }

        try {
            const parsedArgs = JSON.parse(args);
            return await tool(parsedArgs);
        } catch (error) {
            return { error: \`Error executing function \${name}: \${error}\` };
        }
    }

    public async streamChat(userMessage: string): Promise<AsyncIterable<string>> {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        });

        const messages = this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const stream = await this.openai.chat.completions.create({
            model: this.config.model,
            messages,
            temperature: this.config.temperature,
            stream: true
        });

        let fullResponse = '';

        async function* generateTokens() {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullResponse += content;
                    yield content;
                }
            }
        }

        const generator = generateTokens();
        
        // Store the complete response when streaming is done
        const iterator = generator[Symbol.asyncIterator]();
        const wrappedIterator = {
            async next() {
                const result = await iterator.next();
                if (result.done && fullResponse) {
                    // Add complete response to history
                    this.conversationHistory.push({
                        role: 'assistant',
                        content: fullResponse,
                        timestamp: new Date()
                    });
                }
                return result;
            },
            [Symbol.asyncIterator]() {
                return this;
            }
        };

        return wrappedIterator;
    }

    public getConversationHistory(): ConversationMessage[] {
        return [...this.conversationHistory];
    }

    public clearHistory(): void {
        this.conversationHistory = [{
            role: 'system',
            content: this.config.systemPrompt,
            timestamp: new Date()
        }];
    }

    public exportConversation(): string {
        return JSON.stringify(this.conversationHistory, null, 2);
    }

    public async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text
        });

        return response.data[0].embedding;
    }

    public getStats(): {
        totalMessages: number;
        userMessages: number;
        assistantMessages: number;
        averageResponseTime: number;
    } {
        const totalMessages = this.conversationHistory.length;
        const userMessages = this.conversationHistory.filter(m => m.role === 'user').length;
        const assistantMessages = this.conversationHistory.filter(m => m.role === 'assistant').length;

        return {
            totalMessages,
            userMessages,
            assistantMessages,
            averageResponseTime: 0 // Would need to track response times in real implementation
        };
    }
}

// Example configuration and usage
const agentConfig: AgentConfig = {
    name: '${projectName}',
    systemPrompt: \`You are a helpful AI assistant named \${projectName}. You are knowledgeable, friendly, and always strive to provide accurate and helpful information. You can use various tools to help answer questions and perform tasks.\`,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
};

async function main() {
    if (!process.env.OPENAI_API_KEY) {
        console.error('Please set OPENAI_API_KEY environment variable');
        process.exit(1);
    }

    console.log('Starting ${projectName} Agent...');
    
    const agent = new ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent(agentConfig);
    
    // Example conversation
    const responses = await Promise.all([
        agent.chat("Hello! What can you help me with?"),
        agent.chat("Can you calculate 15 * 23 + 7?", { useTools: true }),
        agent.chat("What's the weather like in New York?", { useTools: true }),
        agent.chat("Remember that my favorite color is blue", { useTools: true })
    ]);

    responses.forEach((response, index) => {
        console.log(\`\\nResponse \${index + 1}: \${response}\`);
    });

    // Show conversation stats
    console.log('\\n--- Conversation Stats ---');
    console.log(agent.getStats());

    // Example of streaming
    console.log('\\n--- Streaming Example ---');
    console.log('Question: Tell me a short story about AI');
    const stream = await agent.streamChat("Tell me a short story about AI and creativity");
    
    process.stdout.write('Story: ');
    for await (const token of stream) {
        process.stdout.write(token);
    }
    console.log('\\n');
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

export default ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`,

    envExample: () => `# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORGANIZATION_ID=your_org_id_here

# Agent Configuration
AGENT_MODEL=gpt-4
AGENT_TEMPERATURE=0.7
AGENT_MAX_TOKENS=1000

# Environment
NODE_ENV=development
LOG_LEVEL=info`,

    readme: (projectName: string) => `# ${projectName}

An OpenAI-powered intelligent agent with function calling capabilities, conversation memory, and streaming support.

## Features

- **GPT-4 Integration**: Uses the latest OpenAI models for intelligent responses
- **Function Calling**: Built-in tools for weather, calculations, and memory
- **Conversation Memory**: Maintains context across multiple interactions
- **Streaming Support**: Real-time response streaming
- **Tool System**: Extensible tool/function system
- **Input Validation**: Zod-based schema validation
- **Error Handling**: Robust error handling and recovery

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

1. Copy \`.env.example\` to \`.env\`
2. Add your OpenAI API key

## Usage

### Basic Chat
\`\`\`typescript
import ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent from './src/index';

const agent = new ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent({
    name: 'MyAgent',
    systemPrompt: 'You are a helpful assistant',
    model: 'gpt-4',
    temperature: 0.7
});

const response = await agent.chat("Hello! How can you help me?");
console.log(response);
\`\`\`

### Using Tools
\`\`\`typescript
// The agent automatically uses tools when needed
const response = await agent.chat("What's 15 * 23?", { useTools: true });
\`\`\`

### Streaming Responses
\`\`\`typescript
const stream = await agent.streamChat("Tell me a story");
for await (const token of stream) {
    process.stdout.write(token);
}
\`\`\`

### Custom Tools
\`\`\`typescript
agent.addTool('search_web', 'Search the internet', {
    query: 'string'
}, async (args) => {
    // Your tool implementation
    return { results: 'search results...' };
});
\`\`\`

## Built-in Tools

- **get_weather**: Get weather information for any location
- **calculate**: Perform mathematical calculations
- **remember_fact**: Store and recall information

## Development

\`\`\`bash
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## API Reference

### AgentConfig
- \`name\`: Agent identifier
- \`systemPrompt\`: System instructions
- \`model\`: OpenAI model to use
- \`temperature\`: Response creativity (0-2)
- \`maxTokens\`: Maximum response length

### Methods
- \`chat(message, options)\`: Send a message and get response
- \`streamChat(message)\`: Get streaming response
- \`addTool(name, description, parameters, handler)\`: Add custom tool
- \`getConversationHistory()\`: Get full conversation
- \`clearHistory()\`: Reset conversation
- \`exportConversation()\`: Export as JSON

## License

MIT License`
};