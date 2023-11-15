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
  const searchCommand: SearchFileCommand = new SearchFileCommand(
    "project-explorer.nextjs.search"
  );

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }
  searchCommand.register(_, async () => {
    const uri = vscode.workspace.workspaceFolders![0].uri;
    const workspaceName = vscode.workspace.workspaceFolders![0].name;
    const filesAndFolders = await vscode.workspace.fs.readDirectory(uri);
    const folders = filesAndFolders.filter(
      (item) => item[1] === vscode.FileType.Directory
    );
    vscode.window.showQuickPick(folders.map((item) => item[0]));
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
