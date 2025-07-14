import testAgent from '../index';

describe('testAgent', () => {
    let agent: testAgent;

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
        agent = new testAgent(config);
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
});