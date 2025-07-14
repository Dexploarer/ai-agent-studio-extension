import OpenAI from 'openai';
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

export class MyOpenAIAgentAgent {
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
            expression: 
// ... (truncated for demo)
