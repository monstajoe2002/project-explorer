// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
type Framework = "nextjs" | "sveltekit";
type CommandName = "search" | "rename" | "create";
interface Command {
  commandId: `project-explorer.${Framework}.${string}`;
  register(context: vscode.ExtensionContext, cb: () => void): void;
}
class SearchFileCommand implements Command {
  commandId: `project-explorer.${Framework}.${CommandName}`;
  constructor(commandId: `project-explorer.${Framework}.${CommandName}`) {
    this.commandId = commandId;
  }
  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
}
export function activate(_: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "project-explorer" is now active!'
  );
  const searchCommand: SearchFileCommand = new SearchFileCommand(
    "project-explorer.nextjs.search"
  );
  searchCommand.register(_, () => {
    vscode.window.showInformationMessage("Hello World from Project Explorer!");
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
