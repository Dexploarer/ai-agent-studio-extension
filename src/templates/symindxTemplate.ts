export const symindxProjectTemplate = {
    packageJson: (projectName: string) => ({
        name: projectName,
        version: "1.0.0",
        description: "SYMindX Emotionally Intelligent AI Agent",
        main: "dist/index.js",
        scripts: {
            build: "tsc",
            start: "node dist/index.js",
            dev: "ts-node src/index.ts",
            test: "jest",
            "test:watch": "jest --watch"
        },
        dependencies: {
            "@symbaex/symindx": "^1.0.0",
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

    indexTs: (projectName: string) => `import { SYMindXAgent, EmotionalState, ContextAwareness } from '@symbaex/symindx';
import { config } from 'dotenv';

config();

interface ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Config {
    name: string;
    emotionalProfile: {
        baseEmotions: EmotionalState[];
        adaptability: number;
        empathyLevel: number;
    };
    contextAwareness: {
        memoryDepth: number;
        learningRate: number;
        environmentSensitivity: number;
    };
}

export class ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent extends SYMindXAgent {
    private interactions: Array<{
        input: string;
        output: string;
        emotionalContext: EmotionalState;
        timestamp: Date;
    }> = [];

    constructor(config: ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Config) {
        super(config);
        this.setupEmotionalLearning();
    }

    async processInput(input: string, context?: any): Promise<string> {
        try {
            // 1. Analyze emotional context
            const emotionalContext = await this.analyzeEmotionalContext(input);
            console.log('Emotional Analysis:', emotionalContext);

            // 2. Update contextual memory
            await this.updateContextualMemory(input, { ...context, emotionalContext });

            // 3. Generate empathetic response
            const response = await this.generateEmpatheticResponse(input, emotionalContext);

            // 4. Learn from interaction
            await this.learnFromInteraction(input, response, emotionalContext);

            // 5. Store interaction
            this.interactions.push({
                input,
                output: response,
                emotionalContext,
                timestamp: new Date()
            });

            return response;
        } catch (error) {
            console.error('Error processing input:', error);
            return this.handleErrorWithEmpathy(input, error as Error);
        }
    }

    private async analyzeEmotionalContext(input: string): Promise<EmotionalState> {
        // Enhanced emotional analysis using multiple indicators
        const emotions = {
            joy: ['happy', 'excited', 'pleased', 'delighted', 'joyful', 'thrilled', 'elated'],
            sadness: ['sad', 'upset', 'disappointed', 'dejected', 'melancholy', 'down', 'blue'],
            anger: ['angry', 'furious', 'irritated', 'annoyed', 'mad', 'frustrated', 'livid'],
            fear: ['afraid', 'scared', 'worried', 'anxious', 'nervous', 'terrified', 'concerned'],
            surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'bewildered'],
            trust: ['trust', 'confident', 'secure', 'reliable', 'safe', 'certain'],
            anticipation: ['excited', 'eager', 'looking forward', 'anticipating', 'hopeful'],
            disgust: ['disgusted', 'revolted', 'repulsed', 'sick', 'nauseated']
        };

        const textLower = input.toLowerCase();
        const detectedEmotions: Array<{ emotion: string; intensity: number; triggers: string[] }> = [];

        for (const [emotion, keywords] of Object.entries(emotions)) {
            const matches = keywords.filter(keyword => textLower.includes(keyword));
            if (matches.length > 0) {
                detectedEmotions.push({
                    emotion,
                    intensity: Math.min(matches.length * 0.3, 1),
                    triggers: matches
                });
            }
        }

        // Analyze sentence structure for emotional indicators
        const questionMarks = (input.match(/\\?/g) || []).length;
        const exclamationMarks = (input.match(/!/g) || []).length;
        const capsWords = (input.match(/\\b[A-Z]{2,}\\b/g) || []).length;

        const structuralIntensity = Math.min((questionMarks + exclamationMarks * 2 + capsWords) * 0.2, 0.5);

        const primaryEmotion = detectedEmotions.length > 0 
            ? detectedEmotions.sort((a, b) => b.intensity - a.intensity)[0]
            : { emotion: 'neutral', intensity: 0, triggers: [] };

        return {
            primaryEmotion: primaryEmotion.emotion,
            intensity: Math.min(primaryEmotion.intensity + structuralIntensity, 1),
            context: \`Detected from: \${primaryEmotion.triggers.join(', ') || 'contextual analysis'}\`,
            confidence: primaryEmotion.triggers.length > 0 ? 0.8 : 0.3
        };
    }

    private async generateEmpatheticResponse(input: string, emotionalContext: EmotionalState): Promise<string> {
        const responseStrategies = {
            joy: {
                acknowledgment: "I can sense your happiness and excitement! ",
                approach: "celebratory",
                tonality: "enthusiastic and supportive"
            },
            sadness: {
                acknowledgment: "I understand this might be a difficult time for you. ",
                approach: "supportive",
                tonality: "gentle and caring"
            },
            anger: {
                acknowledgment: "I can see you're feeling frustrated or upset. ",
                approach: "validating",
                tonality: "calm and understanding"
            },
            fear: {
                acknowledgment: "I recognize you might be feeling uncertain or worried. ",
                approach: "reassuring",
                tonality: "stable and comforting"
            },
            surprise: {
                acknowledgment: "That seems unexpected! ",
                approach: "curious",
                tonality: "engaged and interested"
            },
            trust: {
                acknowledgment: "I appreciate your confidence. ",
                approach: "reliable",
                tonality: "steady and dependable"
            },
            anticipation: {
                acknowledgment: "I can sense your excitement about what's coming! ",
                approach: "encouraging",
                tonality: "optimistic and forward-looking"
            },
            neutral: {
                acknowledgment: "Thank you for reaching out. ",
                approach: "helpful",
                tonality: "warm and professional"
            }
        };

        const strategy = responseStrategies[emotionalContext.primaryEmotion as keyof typeof responseStrategies] 
            || responseStrategies.neutral;

        // Generate contextually appropriate response
        let response = strategy.acknowledgment;

        // Add specific help based on the input content
        if (input.toLowerCase().includes('help') || input.includes('?')) {
            response += "I'm here to assist you. ";
        }

        if (input.toLowerCase().includes('project') || input.toLowerCase().includes('work')) {
            response += "Let's work through this together step by step. ";
        }

        response += \`Regarding your message: "\${input}" - How can I best support you with this?\`;

        return response;
    }

    private async learnFromInteraction(input: string, output: string, emotionalContext: EmotionalState): Promise<void> {
        // Simple learning mechanism - in a real implementation, this would be more sophisticated
        const learningData = {
            inputPattern: this.extractPattern(input),
            emotionalResponse: emotionalContext.primaryEmotion,
            responseEffectiveness: this.estimateResponseQuality(input, output),
            timestamp: new Date()
        };

        // Store learning data (in real implementation, would persist to database)
        console.log('Learning from interaction:', learningData);
    }

    private extractPattern(input: string): string {
        // Extract common patterns for learning
        const patterns = [];
        
        if (input.includes('?')) patterns.push('question');
        if (input.toLowerCase().includes('help')) patterns.push('help-request');
        if (input.toLowerCase().includes('project')) patterns.push('project-related');
        if (/\\b(how|what|why|when|where)\\b/i.test(input)) patterns.push('information-seeking');
        
        return patterns.join(',') || 'general';
    }

    private estimateResponseQuality(input: string, output: string): number {
        // Simple heuristic for response quality
        const hasAcknowledgment = output.toLowerCase().includes('understand') || 
                                  output.toLowerCase().includes('sense') ||
                                  output.toLowerCase().includes('see');
        
        const hasHelpOffer = output.toLowerCase().includes('help') ||
                            output.toLowerCase().includes('assist') ||
                            output.toLowerCase().includes('support');
        
        const isPersonalized = output.includes(input.substring(0, 20));
        
        let quality = 0.5; // baseline
        if (hasAcknowledgment) quality += 0.2;
        if (hasHelpOffer) quality += 0.2;
        if (isPersonalized) quality += 0.1;
        
        return Math.min(quality, 1.0);
    }

    private handleErrorWithEmpathy(input: string, error: Error): string {
        console.error('Agent error:', error);
        return \`I apologize, but I encountered an issue while processing your message: "\${input}". I understand this might be frustrating. Let me try to help you in a different way. Could you please rephrase your request?\`;
    }

    private setupEmotionalLearning(): void {
        // Initialize emotional learning patterns
        console.log(\`\${this.config.name} agent initialized with emotional learning capabilities\`);
    }

    // Public methods for interaction monitoring
    public getInteractionHistory(): Array<{ input: string; output: string; emotionalContext: EmotionalState; timestamp: Date }> {
        return [...this.interactions];
    }

    public getEmotionalInsights(): { 
        mostCommonEmotion: string; 
        averageIntensity: number; 
        totalInteractions: number 
    } {
        if (this.interactions.length === 0) {
            return { mostCommonEmotion: 'neutral', averageIntensity: 0, totalInteractions: 0 };
        }

        const emotions = this.interactions.map(i => i.emotionalContext.primaryEmotion);
        const intensities = this.interactions.map(i => i.emotionalContext.intensity);
        
        const emotionCounts = emotions.reduce((acc, emotion) => {
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostCommonEmotion = Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

        const averageIntensity = intensities.reduce((sum, intensity) => sum + intensity, 0) / intensities.length;

        return {
            mostCommonEmotion,
            averageIntensity,
            totalInteractions: this.interactions.length
        };
    }
}

// Example usage and configuration
const agentConfig: ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Config = {
    name: '${projectName}',
    emotionalProfile: {
        baseEmotions: [
            { emotion: 'empathy', intensity: 0.8, context: 'default state' },
            { emotion: 'curiosity', intensity: 0.6, context: 'learning mode' }
        ],
        adaptability: 0.7,
        empathyLevel: 0.8
    },
    contextAwareness: {
        memoryDepth: 50,
        learningRate: 0.3,
        environmentSensitivity: 0.7
    }
};

// Initialize and start the agent
async function main() {
    console.log('Starting ${projectName} Agent...');
    
    const agent = new ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent(agentConfig);
    
    // Example interactions
    const testInputs = [
        "Hello, I'm feeling overwhelmed with my project",
        "Can you help me understand how to structure my code?",
        "I'm excited about this new feature I'm building!",
        "I'm worried this won't work correctly"
    ];

    for (const input of testInputs) {
        console.log(\`\\n--- Processing: "\${input}" ---\`);
        const response = await agent.processInput(input);
        console.log(\`Response: \${response}\`);
    }

    // Show insights
    console.log('\\n--- Emotional Insights ---');
    console.log(agent.getEmotionalInsights());
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

export default ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent;`,

    tsconfigJson: () => ({
        compilerOptions: {
            target: "ES2020",
            module: "commonjs",
            lib: ["ES2020"],
            outDir: "./dist",
            rootDir: "./src",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            declaration: true,
            declarationMap: true,
            sourceMap: true
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist", "**/*.test.ts"]
    }),

    envExample: () => `# SYMindX Agent Configuration
SYMINDX_API_KEY=your_api_key_here
SYMINDX_ENVIRONMENT=development
SYMINDX_LOG_LEVEL=info

# Optional: External service configurations
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key`,

    readme: (projectName: string) => `# ${projectName}

A SYMindX-powered emotionally intelligent AI agent that can understand and respond to human emotions with empathy and context awareness.

## Features

- **Emotional Analysis**: Advanced sentiment analysis and emotional context understanding
- **Empathetic Responses**: Generates responses that acknowledge and validate emotional states
- **Learning Capabilities**: Learns from interactions to improve emotional intelligence
- **Context Awareness**: Maintains conversation context and emotional history
- **Real-time Insights**: Provides emotional analytics and interaction patterns

## Installation

\`\`\`bash
npm install
\`\`\`

## Configuration

1. Copy \`.env.example\` to \`.env\`
2. Configure your API keys and settings

## Usage

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Testing
\`\`\`bash
npm test
\`\`\`

## API Usage

\`\`\`typescript
import ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent from './src/index';

const agent = new ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent(config);

// Process user input with emotional awareness
const response = await agent.processInput("I'm feeling frustrated with this bug");
console.log(response); // Empathetic response acknowledging frustration

// Get emotional insights
const insights = agent.getEmotionalInsights();
console.log(insights);
\`\`\`

## Emotional Profiles

The agent supports different emotional profiles:

- **Empathetic**: High empathy, supportive responses
- **Analytical**: Logical, fact-based responses with emotional awareness
- **Energetic**: Enthusiastic, motivating responses
- **Calm**: Steady, reassuring responses

## Architecture

- **Emotional Analysis Engine**: Analyzes text for emotional content
- **Response Generation**: Creates contextually appropriate empathetic responses
- **Learning System**: Improves responses based on interaction patterns
- **Context Memory**: Maintains conversation and emotional history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Learn More

- [SYMindX Documentation](https://github.com/SYMBaiEX/SYMindX)
- [AI Agent Studio](https://github.com/ai-agent-studio/vscode-extension)`,

    jestConfig: () => ({
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['<rootDir>/src'],
        testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
        collectCoverageFrom: [
            'src/**/*.ts',
            '!src/**/*.d.ts',
            '!src/index.ts'
        ]
    }),

    testExample: (projectName: string) => `import ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent from '../index';

describe('${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent', () => {
    let agent: ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent;

    beforeEach(() => {
        const config = {
            name: 'Test Agent',
            emotionalProfile: {
                baseEmotions: [{ emotion: 'empathy', intensity: 0.8, context: 'test' }],
                adaptability: 0.7,
                empathyLevel: 0.8
            },
            contextAwareness: {
                memoryDepth: 10,
                learningRate: 0.5,
                environmentSensitivity: 0.6
            }
        };
        agent = new ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Agent(config);
    });

    test('should process happy input with appropriate response', async () => {
        const input = "I'm so excited about this new project!";
        const response = await agent.processInput(input);
        
        expect(response).toContain('happiness');
        expect(response).toContain('excited');
    });

    test('should process sad input with empathetic response', async () => {
        const input = "I'm feeling really disappointed about the results";
        const response = await agent.processInput(input);
        
        expect(response).toContain('understand');
        expect(response).toContain('difficult');
    });

    test('should maintain interaction history', async () => {
        await agent.processInput("Hello");
        await agent.processInput("How are you?");
        
        const history = agent.getInteractionHistory();
        expect(history).toHaveLength(2);
        expect(history[0].input).toBe("Hello");
    });

    test('should provide emotional insights', async () => {
        await agent.processInput("I'm happy!");
        await agent.processInput("I'm excited!");
        
        const insights = agent.getEmotionalInsights();
        expect(insights.totalInteractions).toBe(2);
        expect(insights.mostCommonEmotion).toBe('joy');
    });

    test('should handle errors gracefully', async () => {
        // Mock an error condition
        const originalMethod = agent['analyzeEmotionalContext'];
        agent['analyzeEmotionalContext'] = jest.fn().mockRejectedValue(new Error('Test error'));
        
        const response = await agent.processInput("Test input");
        expect(response).toContain('apologize');
        expect(response).toContain('issue');
        
        // Restore original method
        agent['analyzeEmotionalContext'] = originalMethod;
    });
});`
};