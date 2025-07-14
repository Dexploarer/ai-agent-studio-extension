import { SYMindXConfig } from '@symbaex/symindx';

export const config: SYMindXConfig = {
    runtime: 'bun',
    
    agents: [
        {
            name: 'EmotionalAssistant',
            type: 'conversational',
            aiProvider: {
                name: 'openai',
                model: 'gpt-4o',
                temperature: 0.7,
                maxTokens: 1000
            },
            emotionalStates: [
                { name: 'joy', defaultIntensity: 0.7 },
                { name: 'empathy', defaultIntensity: 0.9 },
                { name: 'curiosity', defaultIntensity: 0.8 },
                { name: 'concern', defaultIntensity: 0.6 },
                { name: 'excitement', defaultIntensity: 0.5 },
                { name: 'calm', defaultIntensity: 0.8 }
            ],
            personality: {
                traits: ['helpful', 'empathetic', 'creative', 'patient'],
                communicationStyle: 'conversational',
                responsePattern: 'supportive'
            },
            memoryProvider: {
                type: 'sqlite',
                persistentMemory: true,
                contextWindow: 10,
                emotionalMemory: true
            },
            extensions: [
                'emotional-awareness',
                'context-memory',
                'user-preferences'
            ]
        }
    ],
    
    globalSettings: {
        logging: {
            level: 'info',
            emotionalLogs: true,
            contextLogs: true
        },
        performance: {
            cacheEnabled: true,
            maxConcurrentAgents: 5,
            responseTimeout: 30000
        },
        security: {
            validateInputs: true,
            sanitizeOutputs: true,
            rateLimiting: {
                enabled: true,
                maxRequestsPerMinute: 60
            }
        }
    },
    
    platforms: [
        {
            name: 'web',
            enabled: true,
            port: 3000,
            cors: {
                enabled: true,
                origins: ['http://localhost:3000', 'https://yourdomain.com']
            }
        },
        {
            name: 'discord',
            enabled: false,
            token: process.env.DISCORD_TOKEN,
            prefix: '!'
        },
        {
            name: 'slack',
            enabled: false,
            token: process.env.SLACK_TOKEN,
            signingSecret: process.env.SLACK_SIGNING_SECRET
        }
    ],
    
    environment: {
        development: {
            debug: true,
            hotReload: true,
            mockResponses: false
        },
        production: {
            debug: false,
            hotReload: false,
            mockResponses: false
        }
    }
};

export default config;