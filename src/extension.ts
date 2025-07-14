import * as vscode from 'vscode';
import { SimpleMCPProvider } from './mcp/simpleMcpProvider';
import { ProjectManager } from './projectManager';
import { registerSnippetProvider } from './snippetProvider';
import {
    generateOpenAIAgent,
    generateSYMindXAgent,
    generateLangGraphAgent,
    generateElizaAgent,
    generateCustomAgent,
    getMonitoringDashboardHtml,
    searchDocumentation,
    getSearchResultsHtml,
    getOrCreateConfig,
    getConfigurationHtml,
    saveConfiguration,
    getInteractiveTestingHtml,
    getFrameworkDocumentation,
    getDocumentationViewerHtml,
    getFlowVisualizerHtml,
    generateSYMindXTemplate,
    generateOpenAITemplate,
    generateElizaTemplate,
    generateLangGraphTemplate,
    generateCrewAITemplate,
    generateAutoGenTemplate,
    generateVercelAISDKTemplate,
    generateLangChainTemplate,
    generateSmolAgentsTemplate,
    generateGoogleADKTemplate,
    generateSemanticKernelTemplate,
    generatePydanticAITemplate,
    generateCustomFrameworkTemplate
} from './extensionUtils';

class SimpleTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private getItems: () => vscode.TreeItem[]) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (!element) {
            return Promise.resolve(this.getItems());
        }
        return Promise.resolve([]);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Agent Studio - Starting activation');
    
    // Show immediate feedback
    const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusItem.text = '$(robot) AI Agent Studio';
    statusItem.tooltip = 'AI Agent Studio is active';
    statusItem.show();
    context.subscriptions.push(statusItem);
    
    // Initialize MCP Provider and Project Manager
    const mcpProvider = new SimpleMCPProvider(context);
    const projectManager = new ProjectManager();
    
    // Register snippet providers for intelligent code completion
    registerSnippetProvider(context);
    
    // Create framework items
    const frameworkItems = [
        'OpenAI Agents SDK',
        'ElizaOS', 
        'LangGraph',
        'CrewAI',
        'AutoGen',
        'SmolAgents',
        'Google ADK',
        'Semantic Kernel',
        'Pydantic AI',
        'LangChain',
        'SYMindX',
        'Vercel AI SDK 5 Beta',
        'Custom Framework'
    ].map(name => {
        const item = new vscode.TreeItem(name, vscode.TreeItemCollapsibleState.None);
        item.tooltip = `${name} - Click to install`;
        item.iconPath = new vscode.ThemeIcon('package');
        item.command = {
            command: 'ai-agent-studio.showFrameworkInfo',
            title: 'Show Info',
            arguments: [name]
        };
        return item;
    });
    
    // Register framework info command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.showFrameworkInfo', (name: string) => {
            vscode.window.showInformationMessage(`Framework: ${name}`, 'Install', 'Learn More', 'Create Project').then(action => {
                if (action === 'Install') {
                    vscode.commands.executeCommand('ai-agent-studio.installFramework', name);
                } else if (action === 'Learn More') {
                    const urls: { [key: string]: string } = {
                        'OpenAI Agents SDK': 'https://github.com/openai/agents-sdk',
                        'ElizaOS': 'https://github.com/elizaos/eliza',
                        'LangGraph': 'https://langchain-ai.github.io/langgraph/',
                        'CrewAI': 'https://docs.crewai.com/',
                        'AutoGen': 'https://microsoft.github.io/autogen/',
                        'SYMindX': 'https://github.com/SYMBaiEX/SYMindX',
                        'Vercel AI SDK 5 Beta': 'https://sdk.vercel.ai/',
                        'LangChain': 'https://docs.langchain.com/',
                        'SmolAgents': 'https://github.com/smol-ai/smol-agents',
                        'Google ADK': 'https://ai.google.dev/',
                        'Semantic Kernel': 'https://learn.microsoft.com/en-us/semantic-kernel/',
                        'Pydantic AI': 'https://ai.pydantic.dev/'
                    };
                    const url = urls[name];
                    if (url) {
                        vscode.env.openExternal(vscode.Uri.parse(url));
                    }
                } else if (action === 'Create Project') {
                    vscode.commands.executeCommand('ai-agent-studio.createProject', name);
                }
            });
        })
    );
    
    // Create Project command - Now using real templates
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.createProject', async (framework?: string) => {
            const availableFrameworks = projectManager.getAvailableFrameworks();
            const selectedFramework = framework || await vscode.window.showQuickPick(
                availableFrameworks,
                { 
                    placeHolder: 'Select a framework for your agent project',
                    ignoreFocusOut: true
                }
            );
            
            if (!selectedFramework) return;
            
            const projectName = await vscode.window.showInputBox({
                prompt: 'Enter project name',
                placeHolder: 'my-agent-project',
                ignoreFocusOut: true,
                validateInput: (value) => {
                    if (!value || value.trim() === '') return 'Project name cannot be empty';
                    if (!/^[a-z0-9-_]+$/i.test(value)) return 'Invalid characters in project name (use letters, numbers, hyphens, underscores)';
                    if (value.length > 50) return 'Project name too long (max 50 characters)';
                    return null;
                }
            });
            
            if (!projectName) return;
            
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: 'Select Project Location',
                title: 'Choose where to create your project'
            });
            
            if (!folderUri || folderUri.length === 0) return;
            
            const projectPath = vscode.Uri.joinPath(folderUri[0], projectName);
            
            // Check if directory already exists
            try {
                await vscode.workspace.fs.stat(projectPath);
                const overwrite = await vscode.window.showWarningMessage(
                    `Directory "${projectName}" already exists. Do you want to overwrite it?`,
                    'Yes', 'No'
                );
                if (overwrite !== 'Yes') return;
            } catch {
                // Directory doesn't exist, which is what we want
            }

            // Ask for additional options
            const includeTests = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { 
                    placeHolder: 'Include test setup?',
                    ignoreFocusOut: true
                }
            ) === 'Yes';

            try {
                await projectManager.createProject({
                    framework: selectedFramework,
                    projectName,
                    projectPath,
                    includeTests,
                    includeExamples: true
                });
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        })
    );
    
    // Install Framework command - Now using real installation
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.installFramework', async (frameworkName?: string) => {
            const availableFrameworks = projectManager.getAvailableFrameworks();
            const selectedFramework = frameworkName || await vscode.window.showQuickPick(
                availableFrameworks,
                { 
                    placeHolder: 'Select a framework to install',
                    ignoreFocusOut: true
                }
            );
            
            if (!selectedFramework) return;
            
            try {
                await projectManager.installFramework(selectedFramework);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to install ${selectedFramework}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        })
    );
    
    // MCP Servers management command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.manageMcpServers', async () => {
            const action = await vscode.window.showQuickPick([
                { label: '$(server) View Available MCP Servers', value: 'view' },
                { label: '$(add) Add MCP Server to Workspace', value: 'add' },
                { label: '$(book) Open MCP Documentation', value: 'docs' }
            ], { placeHolder: 'Manage MCP Servers' });
            
            if (!action) return;
            
            switch (action.value) {
                case 'view':
                    const servers = await mcpProvider.getAvailableServers();
                    const serverList = servers.map(s => `• ${s.name}: ${s.description}`).join('\\n');
                    vscode.window.showInformationMessage(`Available MCP Servers:\\n${serverList}`);
                    break;
                    
                case 'add':
                    const availableServers = await mcpProvider.getAvailableServers();
                    const selected = await vscode.window.showQuickPick(
                        availableServers.map(s => ({ label: s.name, description: s.description, server: s })),
                        { placeHolder: 'Select MCP server to add' }
                    );
                    
                    if (selected) {
                        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                        if (workspaceFolder) {
                            const mcpConfig = {
                                servers: {
                                    [selected.server.id]: {
                                        command: (selected.server.definition as any).command,
                                        args: (selected.server.definition as any).args
                                    }
                                }
                            };
                            
                            const vscodePath = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode');
                            const mcpPath = vscode.Uri.joinPath(vscodePath, 'mcp.json');
                            
                            try {
                                await vscode.workspace.fs.createDirectory(vscodePath);
                                await vscode.workspace.fs.writeFile(mcpPath, Buffer.from(JSON.stringify(mcpConfig, null, 2)));
                                vscode.window.showInformationMessage(`Added ${selected.label} MCP server to workspace`);
                            } catch (error) {
                                vscode.window.showErrorMessage(`Failed to add MCP server: ${error}`);
                            }
                        }
                    }
                    break;
                    
                case 'docs':
                    vscode.env.openExternal(vscode.Uri.parse('https://modelcontextprotocol.io/'));
                    break;
            }
        })
    );
    
    // Dashboard command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.openAgentDashboard', () => {
            const panel = vscode.window.createWebviewPanel(
                'aiAgentDashboard',
                'AI Agent Studio Dashboard',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            
            panel.webview.html = getDashboardHtml();
            
            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'createProject':
                            vscode.commands.executeCommand('ai-agent-studio.createProject');
                            break;
                        case 'installFramework':
                            vscode.commands.executeCommand('ai-agent-studio.installFramework');
                            break;
                        case 'manageMcp':
                            vscode.commands.executeCommand('ai-agent-studio.manageMcpServers');
                            break;
                        case 'learnSYMindX':
                            vscode.env.openExternal(vscode.Uri.parse('https://github.com/SYMBaiEX/SYMindX'));
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );
        })
    );
    
    // Register tree providers
    const providers = {
        agentProjects: new SimpleTreeProvider(() => [
            createTreeItem('No projects yet', 'folder-opened', 'Create your first project'),
            createTreeItem('Click + to create new', 'add', 'Create new agent project')
        ]),
        frameworkStatus: new SimpleTreeProvider(() => frameworkItems),
        agentMonitoring: new SimpleTreeProvider(() => [
            createTreeItem('No agents running', 'debug-stop', 'Start monitoring agents'),
            createTreeItem('MCP servers available', 'server', 'Manage MCP servers')
        ]),
        context7Explorer: new SimpleTreeProvider(() => [
            createTreeItem('MCP Documentation', 'book', 'Access documentation via MCP'),
            createTreeItem('Search with MCP', 'search', 'Search using MCP servers')
        ])
    };
    
    // Register all providers
    Object.entries(providers).forEach(([viewId, provider]) => {
        try {
            context.subscriptions.push(
                vscode.window.registerTreeDataProvider(viewId, provider)
            );
            console.log(`Registered provider for ${viewId}`);
        } catch (error) {
            console.error(`Failed to register ${viewId}:`, error);
        }
    });
    
    // Generate Agent command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.generateAgent', async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showErrorMessage('Please open a file to generate agent code');
                return;
            }

            const document = activeEditor.document;
            const selection = activeEditor.selection;
            const selectedText = document.getText(selection);
            
            const agentType = await vscode.window.showQuickPick([
                'OpenAI Chat Agent',
                'SYMindX Emotional Agent', 
                'LangGraph Workflow Agent',
                'ElizaOS Character Agent',
                'Custom Agent'
            ], {
                placeHolder: 'What type of agent do you want to generate?',
                ignoreFocusOut: true
            });

            if (!agentType) return;

            const agentName = await vscode.window.showInputBox({
                prompt: 'Enter agent name',
                placeHolder: 'MyAgent',
                value: selectedText || 'MyAgent',
                ignoreFocusOut: true
            });

            if (!agentName) return;

            let generatedCode = '';
            
            switch (agentType) {
                case 'OpenAI Chat Agent':
                    generatedCode = generateOpenAIAgent(agentName);
                    break;
                case 'SYMindX Emotional Agent':
                    generatedCode = generateSYMindXAgent(agentName);
                    break;
                case 'LangGraph Workflow Agent':
                    generatedCode = generateLangGraphAgent(agentName);
                    break;
                case 'ElizaOS Character Agent':
                    generatedCode = generateElizaAgent(agentName);
                    break;
                default:
                    generatedCode = generateCustomAgent(agentName);
            }

            if (selection.isEmpty) {
                // Insert at cursor position
                activeEditor.edit(editBuilder => {
                    editBuilder.insert(selection.active, generatedCode);
                });
            } else {
                // Replace selected text
                activeEditor.edit(editBuilder => {
                    editBuilder.replace(selection, generatedCode);
                });
            }

            vscode.window.showInformationMessage(`Generated ${agentType}: ${agentName}`);
        })
    );

    // Start Agent Monitoring command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.startAgentMonitoring', async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('Please open a workspace to start monitoring');
                return;
            }

            const panel = vscode.window.createWebviewPanel(
                'agentMonitoring',
                'Agent Monitoring Dashboard',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            panel.webview.html = getMonitoringDashboardHtml();

            // Start monitoring agents in the workspace
            const terminal = vscode.window.createTerminal('Agent Monitor');
            terminal.show();
            terminal.sendText('echo "Starting Agent Monitoring..."');
            
            // Look for running agents
            terminal.sendText('ps aux | grep -E "(node|python).*agent" || echo "No agents currently running"');

            vscode.window.showInformationMessage('Agent monitoring started! Check the monitoring dashboard and terminal.');
        })
    );

    // Search Context7 command  
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.searchContext7', async () => {
            const query = await vscode.window.showInputBox({
                prompt: 'Search AI agent documentation and examples',
                placeHolder: 'Enter your search query...',
                ignoreFocusOut: true
            });

            if (!query) return;

            const results = await searchDocumentation(query);
            
            const panel = vscode.window.createWebviewPanel(
                'searchResults',
                `Search Results: ${query}`,
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            panel.webview.html = getSearchResultsHtml(query, results);
        })
    );

    // Configure Framework command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.configureFramework', async (frameworkName?: string) => {
            const availableFrameworks = projectManager.getAvailableFrameworks();
            const selectedFramework = frameworkName || await vscode.window.showQuickPick(
                availableFrameworks,
                { 
                    placeHolder: 'Select framework to configure',
                    ignoreFocusOut: true
                }
            );

            if (!selectedFramework) return;

            const configOptions = await vscode.window.showQuickPick([
                'API Keys & Authentication',
                'Model Settings', 
                'Default Parameters',
                'Environment Variables',
                'Advanced Configuration'
            ], {
                placeHolder: `Configure ${selectedFramework}`,
                ignoreFocusOut: true
            });

            if (!configOptions) return;

            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (workspaceFolder) {
                const configPath = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode', 'ai-agent-studio.json');
                const config = await getOrCreateConfig(configPath, selectedFramework);
                
                const panel = vscode.window.createWebviewPanel(
                    'frameworkConfig',
                    `Configure ${selectedFramework}`,
                    vscode.ViewColumn.One,
                    { enableScripts: true }
                );

                panel.webview.html = getConfigurationHtml(selectedFramework, config);
                
                panel.webview.onDidReceiveMessage(async (message) => {
                    if (message.command === 'saveConfig') {
                        await saveConfiguration(configPath, message.config);
                        vscode.window.showInformationMessage(`${selectedFramework} configuration saved!`);
                    }
                });
            }
        })
    );

    // Deploy Agent command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.deployAgent', async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('Please open a project to deploy');
                return;
            }

            const deploymentOptions = await vscode.window.showQuickPick([
                'Deploy to Local Server',
                'Deploy to Docker Container',
                'Deploy to Vercel',
                'Deploy to Railway', 
                'Deploy to Heroku',
                'Export for Manual Deployment'
            ], {
                placeHolder: 'Choose deployment target',
                ignoreFocusOut: true
            });

            if (!deploymentOptions) return;

            const terminal = vscode.window.createTerminal('Agent Deployment');
            terminal.show();

            switch (deploymentOptions) {
                case 'Deploy to Local Server':
                    terminal.sendText('npm run build && npm start');
                    break;
                case 'Deploy to Docker Container':
                    terminal.sendText('docker build -t ai-agent . && docker run -p 3000:3000 ai-agent');
                    break;
                case 'Deploy to Vercel':
                    terminal.sendText('npx vercel --prod');
                    break;
                case 'Deploy to Railway':
                    terminal.sendText('railway login && railway deploy');
                    break;
                case 'Deploy to Heroku':
                    terminal.sendText('git push heroku main');
                    break;
                case 'Export for Manual Deployment':
                    terminal.sendText('npm run build && echo "Build complete! Check the dist/ folder for deployment files."');
                    break;
            }

            vscode.window.showInformationMessage(`Deploying agent with ${deploymentOptions}...`);
        })
    );

    // Test Agent command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.testAgent', async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('Please open a project to test');
                return;
            }

            const testType = await vscode.window.showQuickPick([
                'Run Unit Tests',
                'Run Integration Tests',
                'Interactive Agent Testing',
                'Performance Testing',
                'Load Testing'
            ], {
                placeHolder: 'Choose test type',
                ignoreFocusOut: true
            });

            if (!testType) return;

            const terminal = vscode.window.createTerminal('Agent Testing');
            terminal.show();

            switch (testType) {
                case 'Run Unit Tests':
                    terminal.sendText('npm test');
                    break;
                case 'Run Integration Tests':
                    terminal.sendText('npm run test:integration');
                    break;
                case 'Interactive Agent Testing':
                    const panel = vscode.window.createWebviewPanel(
                        'agentTesting',
                        'Interactive Agent Testing',
                        vscode.ViewColumn.One,
                        { enableScripts: true }
                    );
                    panel.webview.html = getInteractiveTestingHtml();
                    break;
                case 'Performance Testing':
                    terminal.sendText('npm run test:performance');
                    break;
                case 'Load Testing':
                    terminal.sendText('npm run test:load');
                    break;
            }

            vscode.window.showInformationMessage(`Starting ${testType}...`);
        })
    );

    // Open Framework Docs command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.openFrameworkDocs', async (frameworkName?: string) => {
            const availableFrameworks = projectManager.getAvailableFrameworks();
            const selectedFramework = frameworkName || await vscode.window.showQuickPick(
                availableFrameworks,
                { 
                    placeHolder: 'Select framework to view documentation',
                    ignoreFocusOut: true
                }
            );

            if (!selectedFramework) return;

            const docs = await getFrameworkDocumentation(selectedFramework);
            
            const panel = vscode.window.createWebviewPanel(
                'frameworkDocs',
                `${selectedFramework} Documentation`,
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            panel.webview.html = getDocumentationViewerHtml(selectedFramework, docs);
        })
    );

    // Agent Flow Visualizer command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.agentFlowVisualizer', async () => {
            const panel = vscode.window.createWebviewPanel(
                'agentFlowVisualizer',
                'Agent Flow Visualizer',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            panel.webview.html = getFlowVisualizerHtml();

            panel.webview.onDidReceiveMessage((message) => {
                if (message.command === 'generateFlow') {
                    // Generate flow visualization code
                    vscode.window.showInformationMessage('Flow visualization generated!');
                }
            });
        })
    );

    // Refresh Views command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.refreshViews', () => {
            Object.values(providers).forEach(provider => provider.refresh());
            vscode.window.showInformationMessage('Views refreshed!');
        })
    );

    // Uninstall Framework command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.uninstallFramework', async (frameworkName?: string) => {
            const availableFrameworks = projectManager.getAvailableFrameworks();
            const selectedFramework = frameworkName || await vscode.window.showQuickPick(
                availableFrameworks,
                { 
                    placeHolder: 'Select framework to uninstall',
                    ignoreFocusOut: true
                }
            );

            if (!selectedFramework) return;

            const confirmation = await vscode.window.showWarningMessage(
                `Are you sure you want to uninstall ${selectedFramework}?`,
                'Yes', 'No'
            );

            if (confirmation !== 'Yes') return;

            const terminal = vscode.window.createTerminal(`Uninstall ${selectedFramework}`);
            terminal.show();

            // Simple uninstall commands - in a real implementation, this would be more sophisticated
            const packageMap: { [key: string]: { package: string, isPython: boolean } } = {
                'OpenAI Agents SDK': { package: 'openai', isPython: false },
                'ElizaOS': { package: '@elizaos/core @elizaos/plugin-node', isPython: false },
                'LangGraph': { package: '@langchain/langgraph @langchain/core @langchain/openai', isPython: false },
                'CrewAI': { package: 'crewai', isPython: true },
                'AutoGen': { package: 'pyautogen', isPython: true },
                'SYMindX': { package: '@symbaex/symindx', isPython: false },
                'LangChain': { package: 'langchain @langchain/openai', isPython: false },
                'Semantic Kernel': { package: '@microsoft/semantic-kernel', isPython: false },
                'Vercel AI SDK 5 Beta': { package: 'ai @ai-sdk/openai @ai-sdk/anthropic zod', isPython: false },
                'SmolAgents': { package: 'smol-agents', isPython: false },
                'Google ADK': { package: '@google/generative-ai', isPython: false },
                'Pydantic AI': { package: 'pydantic-ai', isPython: true }
            };

            const framework = packageMap[selectedFramework];
            if (framework) {
                if (framework.isPython) {
                    terminal.sendText(`pip uninstall ${framework.package} -y`);
                } else {
                    terminal.sendText(`npm uninstall ${framework.package}`);
                }
            }

            vscode.window.showInformationMessage(`Uninstalling ${selectedFramework}...`);
        })
    );

    // Create From Template command
    context.subscriptions.push(
        vscode.commands.registerCommand('ai-agent-studio.createFromTemplate', async (frameworkName?: string) => {
            const selectedFramework = frameworkName || await vscode.window.showQuickPick(
                projectManager.getAvailableFrameworks(),
                { 
                    placeHolder: 'Select framework for template',
                    ignoreFocusOut: true
                }
            );

            if (!selectedFramework) return;

            const templates = {
                'SYMindX': [
                    'Customer Service Agent',
                    'Therapeutic Assistant', 
                    'Creative Collaborator',
                    'Analytical Advisor'
                ],
                'OpenAI Agents SDK': [
                    'Chat Assistant',
                    'Function Calling Agent',
                    'Streaming Agent',
                    'Multi-Modal Agent'
                ],
                'ElizaOS': [
                    'Social Media Agent',
                    'Discord Bot',
                    'Twitter Agent',
                    'Multi-Platform Agent'
                ],
                'LangGraph': [
                    'Workflow Agent',
                    'State Machine Agent',
                    'Multi-Step Processor',
                    'Decision Tree Agent'
                ],
                'CrewAI': [
                    'Research Team',
                    'Analysis Crew',
                    'Content Creation Team',
                    'Problem Solving Squad'
                ],
                'AutoGen': [
                    'Multi-Agent Chat',
                    'Code Assistant',
                    'Research Assistant',
                    'Document Processor'
                ],
                'Vercel AI SDK 5 Beta': [
                    'Streaming Chat Agent',
                    'Tool-Calling Agent',
                    'Multi-Modal Agent',
                    'RAG Agent'
                ],
                'LangChain': [
                    'RAG Agent',
                    'Conversational Agent',
                    'Document QA Agent',
                    'API Agent'
                ],
                'SmolAgents': [
                    'Simple Agent',
                    'Text Processor',
                    'Basic Reasoner',
                    'Lightweight Agent'
                ],
                'Google ADK': [
                    'Gemini Agent',
                    'Multi-Modal Agent',
                    'Text Generator',
                    'Vision Agent'
                ],
                'Semantic Kernel': [
                    'Skill-Based Agent',
                    'Planner Agent',
                    'Memory Agent',
                    'Function Agent'
                ],
                'Pydantic AI': [
                    'Structured Agent',
                    'Validation Agent',
                    'Type-Safe Agent',
                    'Data Agent'
                ],
                'Custom Framework': [
                    'Basic Template',
                    'Advanced Template',
                    'Specialized Agent',
                    'Custom Implementation'
                ]
            };

            const frameworkTemplates = templates[selectedFramework as keyof typeof templates] || ['Basic Template'];
            
            const selectedTemplate = await vscode.window.showQuickPick(
                frameworkTemplates,
                { 
                    placeHolder: `Select ${selectedFramework} template`,
                    ignoreFocusOut: true
                }
            );

            if (!selectedTemplate) return;

            // Generate template code based on selection
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                let templateCode = '';
                
                switch (selectedFramework) {
                    case 'SYMindX':
                        templateCode = generateSYMindXTemplate(selectedTemplate);
                        break;
                    case 'OpenAI Agents SDK':
                        templateCode = generateOpenAITemplate(selectedTemplate);
                        break;
                    case 'ElizaOS':
                        templateCode = generateElizaTemplate(selectedTemplate);
                        break;
                    case 'LangGraph':
                        templateCode = generateLangGraphTemplate(selectedTemplate);
                        break;
                    case 'CrewAI':
                        templateCode = generateCrewAITemplate(selectedTemplate);
                        break;
                    case 'AutoGen':
                        templateCode = generateAutoGenTemplate(selectedTemplate);
                        break;
                    case 'Vercel AI SDK 5 Beta':
                        templateCode = generateVercelAISDKTemplate(selectedTemplate);
                        break;
                    case 'LangChain':
                        templateCode = generateLangChainTemplate(selectedTemplate);
                        break;
                    case 'SmolAgents':
                        templateCode = generateSmolAgentsTemplate(selectedTemplate);
                        break;
                    case 'Google ADK':
                        templateCode = generateGoogleADKTemplate(selectedTemplate);
                        break;
                    case 'Semantic Kernel':
                        templateCode = generateSemanticKernelTemplate(selectedTemplate);
                        break;
                    case 'Pydantic AI':
                        templateCode = generatePydanticAITemplate(selectedTemplate);
                        break;
                    case 'Custom Framework':
                        templateCode = generateCustomFrameworkTemplate(selectedTemplate);
                        break;
                    default:
                        templateCode = `// ${selectedTemplate} template for ${selectedFramework}
// This framework is not yet fully implemented
export class ${selectedTemplate.replace(/[^a-zA-Z0-9]/g, '')}Agent {
    constructor() {
        this.name = "${selectedTemplate}";
        this.framework = "${selectedFramework}";
    }

    async processInput(input: string): Promise<string> {
        return \`\${this.name} (\${this.framework}) processed: \${input}\`;
    }
}`;
                }

                activeEditor.edit(editBuilder => {
                    editBuilder.insert(activeEditor.selection.active, templateCode);
                });

                vscode.window.showInformationMessage(`Inserted ${selectedTemplate} template for ${selectedFramework}`);
            } else {
                vscode.window.showErrorMessage('Please open a file to insert the template');
            }
        })
    );

    // Show welcome
    vscode.window.showInformationMessage(
        'AI Agent Studio is ready! 🤖',
        'Open Dashboard',
        'View Frameworks',
        'Manage MCP'
    ).then(action => {
        if (action === 'Open Dashboard') {
            vscode.commands.executeCommand('ai-agent-studio.openAgentDashboard');
        } else if (action === 'View Frameworks') {
            vscode.commands.executeCommand('workbench.view.extension.ai-agent-studio');
        } else if (action === 'Manage MCP') {
            vscode.commands.executeCommand('ai-agent-studio.manageMcpServers');
        }
    });
    
    console.log('AI Agent Studio - Activation complete');
}

function createTreeItem(label: string, icon: string, tooltip: string): vscode.TreeItem {
    const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
    item.iconPath = new vscode.ThemeIcon(icon);
    item.tooltip = tooltip;
    return item;
}

function getFrameworkUrl(framework: string): string {
    const urls: { [key: string]: string } = {
        'OpenAI Agents SDK': 'https://github.com/openai/agents-sdk',
        'ElizaOS': 'https://github.com/elizaos/eliza',
        'LangGraph': 'https://langchain-ai.github.io/langgraph/',
        'CrewAI': 'https://docs.crewai.com/',
        'AutoGen': 'https://microsoft.github.io/autogen/',
        'SYMindX': 'https://github.com/SYMBaiEX/SYMindX'
    };
    return urls[framework] || 'https://github.com/ai-agent-studio/vscode-extension';
}

function getDashboardHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                background: #1e1e1e;
                color: #cccccc;
            }
            h1 { color: #4fc3f7; }
            .card {
                background: #2d2d2d;
                border: 1px solid #3c3c3c;
                border-radius: 8px;
                padding: 20px;
                margin: 10px 0;
            }
            button {
                background: #0e639c;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin: 5px;
                font-size: 14px;
            }
            button:hover { background: #1177bb; }
            .status-item {
                padding: 5px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .status-icon { font-size: 18px; }
        </style>
    </head>
    <body>
        <h1>🤖 AI Agent Studio Dashboard</h1>
        <p>Build AI agents with the latest frameworks and MCP integration!</p>
        
        <div class="card">
            <h2>✨ Quick Start</h2>
            <button onclick="sendCommand('createProject')">Create New Project</button>
            <button onclick="sendCommand('installFramework')">Install Framework</button>
        </div>
        
        <div class="card">
            <h2>📊 Status</h2>
            <div class="status-item">
                <span class="status-icon">📦</span>
                <span>Frameworks: 12 available</span>
            </div>
            <div class="status-item">
                <span class="status-icon">🔌</span>
                <span>MCP: Documentation & SYMindX servers ready</span>
            </div>
            <div class="status-item">
                <span class="status-icon">✅</span>
                <span>Extension Status: Active</span>
            </div>
        </div>
        
        <div class="card">
            <h2>🔌 Model Context Protocol</h2>
            <p>Access AI tools and documentation through standardized MCP integration</p>
            <button onclick="sendCommand('manageMcp')">Manage MCP Servers</button>
        </div>
        
        <div class="card">
            <h2>🚀 Featured: SYMindX</h2>
            <p>Build emotionally intelligent agents with context awareness!</p>
            <button onclick="sendCommand('learnSYMindX')">Learn More</button>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            function sendCommand(command) {
                vscode.postMessage({ command: command });
            }
        </script>
    </body>
    </html>`;
}

export function deactivate() {}