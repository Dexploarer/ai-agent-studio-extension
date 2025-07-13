import * as vscode from 'vscode';
import { FrameworkManager } from './framework/frameworkManager';
import { Context7Provider } from './context7/context7Provider';
import { AgentProjectManager } from './project/agentProjectManager';
import { AgentMonitor } from './monitoring/agentMonitor';
import { AgentDashboard } from './dashboard/agentDashboard';
import { TemplateManager } from './templates/templateManager';
import { SnippetProvider } from './snippets/snippetProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Agent Studio extension is now active!');

    // Initialize managers
    const frameworkManager = new FrameworkManager(context);
    const context7Provider = new Context7Provider(context);
    const projectManager = new AgentProjectManager(context);
    const agentMonitor = new AgentMonitor(context);
    const agentDashboard = new AgentDashboard(context);
    const templateManager = new TemplateManager(context);
    const snippetProvider = new SnippetProvider(context);

    // Register all command handlers
    registerCommands(context, {
        frameworkManager,
        context7Provider,
        projectManager,
        agentMonitor,
        agentDashboard,
        templateManager,
        snippetProvider
    });

    // Register providers
    registerProviders(context, {
        frameworkManager,
        context7Provider,
        projectManager,
        agentMonitor,
        agentDashboard,
        templateManager,
        snippetProvider
    });

    // Initialize workspace watchers
    initializeWorkspaceWatchers(context);
    
    // Show welcome message on first activation
    showWelcomeMessage(context);
}

function registerCommands(context: vscode.ExtensionContext, managers: any) {
    const commands = [
        vscode.commands.registerCommand('ai-agent-studio.createProject', async () => {
            await managers.projectManager.createProject();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.openAgentDashboard', async () => {
            await managers.agentDashboard.open();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.generateAgent', async () => {
            await managers.templateManager.generateAgent();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.startAgentMonitoring', async () => {
            await managers.agentMonitor.startMonitoring();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.searchContext7', async () => {
            await managers.context7Provider.searchDocumentation();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.configureFramework', async () => {
            await managers.frameworkManager.configureFramework();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.deployAgent', async () => {
            await managers.projectManager.deployAgent();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.testAgent', async () => {
            await managers.agentMonitor.testAgent();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.openFrameworkDocs', async () => {
            await managers.context7Provider.openFrameworkDocs();
        }),
        
        vscode.commands.registerCommand('ai-agent-studio.agentFlowVisualizer', async () => {
            await managers.agentDashboard.visualizeFlow();
        }),

        // Additional utility commands
        vscode.commands.registerCommand('ai-agent-studio.refreshViews', async () => {
            managers.projectManager.getTreeDataProvider().refresh();
            managers.frameworkManager.getTreeDataProvider().refresh();
            managers.agentMonitor.getTreeDataProvider().refresh();
            managers.context7Provider.getTreeDataProvider().refresh();
        }),

        vscode.commands.registerCommand('ai-agent-studio.refreshFrameworkStatus', async () => {
            await managers.frameworkManager.refreshFrameworkStatus();
        }),

        vscode.commands.registerCommand('ai-agent-studio.installFramework', async (framework) => {
            if (framework) {
                await managers.frameworkManager.installFramework(framework);
            } else {
                await managers.frameworkManager.installFramework();
            }
        }),

        vscode.commands.registerCommand('ai-agent-studio.uninstallFramework', async (framework) => {
            if (framework) {
                await managers.frameworkManager.uninstallFramework(framework);
            } else {
                vscode.window.showErrorMessage('No framework specified for uninstallation');
            }
        }),

        vscode.commands.registerCommand('ai-agent-studio.createFromTemplate', async (framework) => {
            await managers.templateManager.generateAgent();
        }),

        vscode.commands.registerCommand('ai-agent-studio.showFrameworkDetails', async (framework) => {
            if (framework) {
                await showFrameworkDetails(framework);
            }
        }),

        vscode.commands.registerCommand('ai-agent-studio.clearContext7History', async () => {
            managers.context7Provider.clearSearchHistory();
            vscode.window.showInformationMessage('Context7 search history cleared');
        }),

        vscode.commands.registerCommand('ai-agent-studio.refreshContext7', async () => {
            managers.context7Provider.getTreeDataProvider().refresh();
        }),

        // Agent-specific commands
        vscode.commands.registerCommand('ai-agent-studio.stopAgent', async (agent) => {
            if (agent) {
                // Implementation for stopping specific agent
                vscode.window.showInformationMessage(`Stopping agent: ${agent.name}`);
            }
        }),

        vscode.commands.registerCommand('ai-agent-studio.restartAgent', async (agent) => {
            if (agent) {
                // Implementation for restarting specific agent
                vscode.window.showInformationMessage(`Restarting agent: ${agent.name}`);
            }
        }),

        vscode.commands.registerCommand('ai-agent-studio.viewAgentLogs', async (agent) => {
            if (agent) {
                // Implementation for viewing agent logs
                vscode.window.showInformationMessage(`Viewing logs for agent: ${agent.name}`);
            }
        })
    ];

    commands.forEach(command => context.subscriptions.push(command));
}

function registerProviders(context: vscode.ExtensionContext, managers: any) {
    // Register tree data providers for sidebar views
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('agentProjects', managers.projectManager.getTreeDataProvider())
    );
    
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('frameworkStatus', managers.frameworkManager.getTreeDataProvider())
    );
    
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('agentMonitoring', managers.agentMonitor.getTreeDataProvider())
    );
    
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('context7Explorer', managers.context7Provider.getTreeDataProvider())
    );

    // Register completion providers
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        ['typescript', 'javascript', 'python'],
        managers.snippetProvider,
        '.'
    );
    context.subscriptions.push(completionProvider);

    // Register hover providers for Context7 documentation
    const hoverProvider = vscode.languages.registerHoverProvider(
        ['typescript', 'javascript', 'python'],
        managers.context7Provider.getHoverProvider()
    );
    context.subscriptions.push(hoverProvider);
}

function initializeWorkspaceWatchers(context: vscode.ExtensionContext) {
    // Watch for agent config files
    const configWatcher = vscode.workspace.createFileSystemWatcher('**/*.{agent.json,crew.json,eliza.json}');
    
    configWatcher.onDidCreate(uri => {
        vscode.window.showInformationMessage(`Agent config detected: ${uri.fsPath}`);
    });
    
    configWatcher.onDidChange(uri => {
        // Refresh views when config changes
        vscode.commands.executeCommand('ai-agent-studio.refreshViews');
    });
    
    context.subscriptions.push(configWatcher);
    
    // Watch for framework changes
    const frameworkWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');
    frameworkWatcher.onDidChange(() => {
        vscode.commands.executeCommand('ai-agent-studio.refreshFrameworkStatus');
    });
    
    context.subscriptions.push(frameworkWatcher);
}

function showWelcomeMessage(context: vscode.ExtensionContext) {
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            'Welcome to AI Agent Studio! 🤖 Create your first agent project to get started.',
            'Create Project',
            'Open Dashboard',
            'Learn More'
        ).then(selection => {
            switch (selection) {
                case 'Create Project':
                    vscode.commands.executeCommand('ai-agent-studio.createProject');
                    break;
                case 'Open Dashboard':
                    vscode.commands.executeCommand('ai-agent-studio.openAgentDashboard');
                    break;
                case 'Learn More':
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/ai-agent-studio/vscode-extension'));
                    break;
            }
        });
        
        context.globalState.update('hasShownWelcome', true);
    }
}

async function showFrameworkDetails(framework: any) {
    if (!framework) {
        vscode.window.showErrorMessage('No framework data available');
        return;
    }

    const displayName = framework.displayName || 'Unknown Framework';
    const description = framework.description || 'No description available';
    const languages = framework.languages || [];
    const dependencies = framework.dependencies || [];
    const documentationUrl = framework.documentationUrl || '#';
    const templatePath = framework.templatePath || 'Not specified';
    const installed = framework.installed || false;
    const version = framework.version || 'unknown';

    const panel = vscode.window.createWebviewPanel(
        'frameworkDetails',
        `Framework: ${displayName}`,
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${displayName} Details</title>
            <style>
                body { 
                    font-family: var(--vscode-font-family); 
                    padding: 20px; 
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                }
                .header { 
                    border-bottom: 1px solid var(--vscode-panel-border); 
                    padding-bottom: 15px; 
                    margin-bottom: 20px; 
                }
                .section { 
                    margin: 15px 0; 
                    padding: 10px; 
                    border: 1px solid var(--vscode-panel-border); 
                    border-radius: 5px;
                }
                .badge { 
                    background: var(--vscode-badge-background); 
                    color: var(--vscode-badge-foreground); 
                    padding: 2px 8px; 
                    border-radius: 10px; 
                    font-size: 0.8em; 
                    margin: 2px;
                }
                .status-installed { background: var(--vscode-testing-iconPassed); color: white; }
                .status-not-installed { background: var(--vscode-testing-iconFailed); color: white; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${displayName}</h1>
                <p>${description}</p>
                <span class="badge ${installed ? 'status-installed' : 'status-not-installed'}">
                    ${installed ? `✅ v${version}` : '❌ Not installed'}
                </span>
            </div>

            <div class="section">
                <h3>Languages</h3>
                ${languages.map((lang: string) => `<span class="badge">${lang}</span>`).join('')}
            </div>

            <div class="section">
                <h3>Dependencies</h3>
                ${dependencies.map((dep: string) => `<span class="badge">${dep}</span>`).join('')}
            </div>

            <div class="section">
                <h3>Documentation</h3>
                <a href="${documentationUrl}" target="_blank">${documentationUrl}</a>
            </div>

            <div class="section">
                <h3>Template Path</h3>
                <code>${templatePath}</code>
            </div>
        </body>
        </html>
    `;
}

export function deactivate() {
    console.log('AI Agent Studio extension is now deactivated.');
}