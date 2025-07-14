# SYMindX Emotional Assistant Example

This example demonstrates how to create an emotionally intelligent AI assistant using the SYMindX framework.

## Features

- **Emotional Intelligence**: The agent maintains and responds with emotional awareness
- **Context Memory**: Remembers conversation history and user preferences  
- **Multi-Platform Support**: Can be deployed to web, Discord, Slack, and more
- **Configurable Personality**: Customizable traits and response patterns
- **Performance Optimized**: Built with Bun for fast startup and execution

## Quick Start

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Set Environment Variables**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   # Optional: for platform integrations
   export DISCORD_TOKEN="your-discord-token"
   export SLACK_TOKEN="your-slack-token"
   ```

3. **Run the Assistant**
   ```bash
   bun run dev
   ```

## Configuration

The `symindx.config.ts` file contains all the configuration for your agents:

### Emotional States
Configure which emotions your agent can express:
```typescript
emotionalStates: [
    { name: 'joy', defaultIntensity: 0.7 },
    { name: 'empathy', defaultIntensity: 0.9 },
    { name: 'curiosity', defaultIntensity: 0.8 }
]
```

### Personality Traits
Define your agent's personality:
```typescript
personality: {
    traits: ['helpful', 'empathetic', 'creative'],
    communicationStyle: 'conversational',
    responsePattern: 'supportive'
}
```

### Memory Provider
Choose how your agent stores memories:
```typescript
memoryProvider: {
    type: 'sqlite', // or 'supabase'
    persistentMemory: true,
    contextWindow: 10
}
```

## Usage Examples

### Basic Conversation
```typescript
const response = await assistant.processMessage(
    "I'm feeling overwhelmed with work lately.",
    "user123"
);
```

### Emotional State Management
```typescript
// Update agent's emotional state
await assistant.updateEmotionalState('empathy', 0.95);

// Get current emotional state
const emotions = await assistant.getEmotionalState();
```

## Deployment

### Web Platform
```bash
bun run start
# Agent will be available at http://localhost:3000
```

### Discord Bot
1. Enable Discord platform in config
2. Set DISCORD_TOKEN environment variable
3. Run with Discord platform enabled

### Custom Integration
Extend the agent for your specific use case by implementing custom extensions and context providers.

## Learn More

- [SYMindX Documentation](https://github.com/SYMBaiEX/SYMindX)
- [Emotional AI Concepts](https://github.com/SYMBaiEX/SYMindX/docs/emotions)
- [Extension Development](https://github.com/SYMBaiEX/SYMindX/docs/extensions)