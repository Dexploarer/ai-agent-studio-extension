import { Agent, EmotionalState, createAgent, ContextProvider } from '@symbaex/symindx';

interface AssistantConfig {
    name: string;
    apiKey: string;
    model: string;
    memoryProvider: 'sqlite' | 'supabase';
    emotionalProfile: EmotionalState[];
}

class EmotionalAssistant {
    private agent: Agent;
    private contextProvider: ContextProvider;

    constructor(config: AssistantConfig) {
        this.agent = createAgent({
            name: config.name,
            aiProvider: {
                name: 'openai',
                apiKey: config.apiKey,
                model: config.model || 'gpt-4o'
            },
            memoryProvider: config.memoryProvider,
            emotionalStates: config.emotionalProfile,
            personality: {
                traits: ['helpful', 'empathetic', 'creative'],
                mood: 'optimistic',
                responseStyle: 'conversational'
            }
        });

        this.contextProvider = new ContextProvider({
            enableEmotionalContext: true,
            enableMemoryContext: true,
            enableEnvironmentContext: true
        });
    }

    async processMessage(message: string, userId: string): Promise<string> {
        const context = await this.contextProvider.getContext({
            userId,
            currentMessage: message,
            includeEmotionalState: true,
            includeHistory: true
        });

        const response = await this.agent.respond({
            message,
            context,
            userId,
            emotionalAwareness: true
        });

        return response.content;
    }

    async updateEmotionalState(emotion: EmotionalState, intensity: number) {
        await this.agent.updateEmotionalState(emotion, intensity);
    }

    async getEmotionalState(): Promise<EmotionalState[]> {
        return this.agent.getCurrentEmotionalStates();
    }
}

// Example usage
async function main() {
    const assistant = new EmotionalAssistant({
        name: 'EmpatheticHelper',
        apiKey: process.env.OPENAI_API_KEY!,
        model: 'gpt-4o',
        memoryProvider: 'sqlite',
        emotionalProfile: [
            { name: 'joy', intensity: 0.7 },
            { name: 'empathy', intensity: 0.9 },
            { name: 'curiosity', intensity: 0.8 }
        ]
    });

    const response = await assistant.processMessage(
        "I'm feeling overwhelmed with work lately. Can you help me organize my tasks?",
        "user123"
    );

    console.log('Assistant Response:', response);
    
    const currentEmotions = await assistant.getEmotionalState();
    console.log('Current Emotional State:', currentEmotions);
}

if (require.main === module) {
    main().catch(console.error);
}

export { EmotionalAssistant, AssistantConfig };