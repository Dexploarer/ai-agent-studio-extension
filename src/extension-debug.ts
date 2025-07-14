import * as vscode from 'vscode';

// Simple debug extension to test activation
export function activate(context: vscode.ExtensionContext) {
    console.log('AI Agent Studio - Activation started');
    
    // Force show notification
    vscode.window.showInformationMessage('AI Agent Studio Extension Activated!', 'Test Dashboard').then(selection => {
        if (selection === 'Test Dashboard') {
            // Create a simple test webview
            const panel = vscode.window.createWebviewPanel(
                'aiAgentStudioTest',
                'AI Agent Studio Test',
                vscode.ViewColumn.One,
                {}
            );
            
            panel.webview.html = `
                <!DOCTYPE html>
                <html>
                <body>
                    <h1>AI Agent Studio is Working!</h1>
                    <p>If you see this, the extension activated successfully.</p>
                    <p>Check the AI Agent Studio view in the Activity Bar.</p>
                </body>
                </html>
            `;
        }
    });
    
    // Register a simple tree provider that always works
    const treeDataProvider = {
        getTreeItem: (element: any) => element,
        getChildren: (element?: any) => {
            if (!element) {
                return [
                    new vscode.TreeItem('✅ Extension is active', vscode.TreeItemCollapsibleState.None),
                    new vscode.TreeItem('🤖 12 Frameworks available', vscode.TreeItemCollapsibleState.None),
                    new vscode.TreeItem('Click items above to test', vscode.TreeItemCollapsibleState.None)
                ];
            }
            return [];
        },
        onDidChangeTreeData: new vscode.EventEmitter<any>().event
    };
    
    // Register for all views
    try {
        vscode.window.registerTreeDataProvider('agentProjects', treeDataProvider);
        vscode.window.registerTreeDataProvider('frameworkStatus', treeDataProvider);
        vscode.window.registerTreeDataProvider('agentMonitoring', treeDataProvider);
        vscode.window.registerTreeDataProvider('context7Explorer', treeDataProvider);
        console.log('AI Agent Studio - Tree providers registered successfully');
    } catch (error) {
        console.error('AI Agent Studio - Failed to register tree providers:', error);
    }
    
    // Register test command
    const disposable = vscode.commands.registerCommand('ai-agent-studio.test', () => {
        vscode.window.showInformationMessage('AI Agent Studio command works!');
    });
    
    context.subscriptions.push(disposable);
    
    // Log success
    console.log('AI Agent Studio - Activation completed');
    
    // Show the AI Agent Studio view
    vscode.commands.executeCommand('workbench.view.extension.ai-agent-studio');
}

export function deactivate() {
    console.log('AI Agent Studio - Deactivated');
}