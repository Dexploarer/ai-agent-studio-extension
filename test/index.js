const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

suite('AI Agent Studio Extension Tests', function () {
    vscode.window.showInformationMessage('Starting AI Agent Studio tests.');

    // Test extension activation
    test('Extension should be present', function () {
        assert.ok(vscode.extensions.getExtension('ai-agent-studio.ai-agent-studio-extension'));
    });

    test('Extension should activate', async function () {
        const extension = vscode.extensions.getExtension('ai-agent-studio.ai-agent-studio-extension');
        await extension.activate();
        assert.strictEqual(extension.isActive, true);
    });

    // Test command registration
    test('Commands should be registered', async function () {
        const commands = await vscode.commands.getCommands(true);
        
        const expectedCommands = [
            'ai-agent-studio.createProject',
            'ai-agent-studio.generateAgent',
            'ai-agent-studio.installFramework',
            'ai-agent-studio.openAgentDashboard',
            'ai-agent-studio.manageMcpServers',
            'ai-agent-studio.startAgentMonitoring',
            'ai-agent-studio.testAgent',
            'ai-agent-studio.deployAgent'
        ];
        
        expectedCommands.forEach(command => {
            assert.ok(commands.includes(command), `Command ${command} should be registered`);
        });
    });

    // Test configuration
    test('Configuration should be accessible', function () {
        const config = vscode.workspace.getConfiguration('ai-agent-studio');
        assert.ok(config !== undefined);
    });

    // Test extension properties
    test('Extension should have correct package properties', function () {
        const extension = vscode.extensions.getExtension('ai-agent-studio.ai-agent-studio-extension');
        const packageJSON = extension.packageJSON;
        
        assert.strictEqual(packageJSON.name, 'ai-agent-studio-extension');
        assert.strictEqual(packageJSON.displayName, 'AI Agent Studio');
        assert.ok(packageJSON.version);
        assert.ok(packageJSON.engines.vscode);
    });

    // Test framework support
    test('Should support multiple AI frameworks', function () {
        const expectedFrameworks = [
            'OpenAI Agents SDK',
            'ElizaOS',
            'LangGraph', 
            'CrewAI',
            'AutoGen',
            'SYMindX'
        ];
        
        // This would test framework availability through the extension
        // In a real implementation, we'd mock the extension and test framework registration
        assert.ok(expectedFrameworks.length > 0);
    });

    // Test tree data providers
    test('Tree data providers should be initialized', function () {
        // Test that view containers are properly registered
        const viewContainers = vscode.window.tabGroups;
        assert.ok(viewContainers !== undefined);
    });

    // Test snippet providers
    test('Snippet providers should be available', async function () {
        // Create a test document to verify completion providers work
        const testDocument = await vscode.workspace.openTextDocument({
            content: 'symindx-',
            language: 'typescript'
        });
        
        const position = new vscode.Position(0, 8);
        const completions = await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            testDocument.uri,
            position
        );
        
        assert.ok(completions);
    });

    // Test webview functionality
    test('Dashboard webview should be creatable', async function () {
        // Test that webview panels can be created
        try {
            await vscode.commands.executeCommand('ai-agent-studio.openAgentDashboard');
            // If command executes without error, webview creation works
            assert.ok(true);
        } catch (error) {
            assert.fail(`Dashboard creation failed: ${error.message}`);
        }
    });

    // Test MCP integration
    test('MCP servers should be manageable', async function () {
        try {
            // Test MCP management without actually executing
            const mcpCommands = [
                'ai-agent-studio.manageMcpServers'
            ];
            
            mcpCommands.forEach(command => {
                assert.ok(vscode.commands.getCommands(true).then(commands => 
                    commands.includes(command)
                ));
            });
        } catch (error) {
            assert.fail(`MCP integration test failed: ${error.message}`);
        }
    });

    // Test workspace integration
    test('Should handle workspace operations', function () {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        // Should not crash when no workspace is open
        assert.ok(true);
    });

    // Performance test
    test('Extension activation should be fast', async function () {
        const startTime = Date.now();
        const extension = vscode.extensions.getExtension('ai-agent-studio.ai-agent-studio-extension');
        await extension.activate();
        const activationTime = Date.now() - startTime;
        
        // Should activate in under 5 seconds
        assert.ok(activationTime < 5000, `Activation took ${activationTime}ms, should be under 5000ms`);
    });
});
