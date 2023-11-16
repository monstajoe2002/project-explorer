// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// Custom type definition
type Framework = "nextjs" | "sveltekit";
type CommandName = "search" | "rename" | "create";
type CommandId = `project-explorer.${Framework}.${CommandName}`;
interface Command {
  name: CommandName;
  framework: Framework;
  readonly commandId: CommandId;
  register(context: vscode.ExtensionContext, cb: () => void): void;
}
class SearchFileCommand implements Command {
  name: CommandName;
  framework: Framework;
  commandId: CommandId;
  constructor(framework: Framework, name: CommandName) {
    this.name = name;
    this.framework = framework;
    this.commandId = `project-explorer.${framework}.${name}`;
  }
  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
}
export function activate(_: vscode.ExtensionContext) {
  const searchCommand: SearchFileCommand = new SearchFileCommand(
    "nextjs",
    "search"
  );

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }
  searchCommand.register(_, async () => {
    const uri = vscode.workspace.workspaceFolders![0].uri;
    const workspacePath = uri.fsPath;
    const filesAndFolders = await vscode.workspace.fs.readDirectory(uri);
    const folders = filesAndFolders.filter(
      (item) => item[1] === vscode.FileType.Directory
    );
    const doesAppDirExist = filesAndFolders.includes([
      "app",
      vscode.FileType.Directory,
    ]);
    const { framework } = searchCommand;
    switch (framework) {
      case "nextjs":
        // if (!doesAppDirExist) {
        //   return;
        // }
        /*TODO: - fix app dir boolean issue 
                - seperate folder options into page and layout options
        */
        console.log("App dir", doesAppDirExist);
        const appDirPath = `${workspacePath}/app`;
        const appDirUri = vscode.Uri.file(appDirPath);
        const appDir = await vscode.workspace.fs.readDirectory(appDirUri);
        const appDirFolders = appDir.filter(
          ([_, fileType]) => fileType === vscode.FileType.Directory
        );
        const appDirFolderNames = appDirFolders.map(([name]) => name);
        const selected = await vscode.window.showQuickPick(appDirFolderNames);
        break;

      default:
        break;
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
