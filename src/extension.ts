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
  isValidNextFile: (fileName: string) => boolean;
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
  isValidNextFile = (fileName: string) =>
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx");

  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
}

const searchCommand: SearchFileCommand = new SearchFileCommand(
  "nextjs",
  "search"
);

export function activate(_: vscode.ExtensionContext) {
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

    const { framework } = searchCommand;
    switch (framework) {
      case "nextjs":
        const APP_DIR_PATH = `${workspacePath}/app`;
        const appDirUri = vscode.Uri.file(APP_DIR_PATH);
        const appDir = await vscode.workspace.fs.readDirectory(appDirUri);
        if (!appDir) {
          return;
        }
        const appDirFolders = appDir
          .filter(([_, fileType]) => fileType === vscode.FileType.Directory)
          .map(([name]) => name);
        const appDirFiles = appDir
          .filter(
            ([name, fileType]) =>
              fileType === vscode.FileType.File &&
              searchCommand.isValidNextFile(name)
          )
          .map(([name]) => name);
        const fileOptions = appDirFiles.map((name) => ({
          label: "/ (root)",
          description: name === "page.tsx" ? "Page" : "Layout",
        }));
        const folderOptions = appDirFolders.map((name) => ({
          label: name,
          description: "Folder",
        }));
        const selected = await vscode.window.showQuickPick([
          ...fileOptions,
          ...folderOptions,
        ]);
        break;

      default:
        break;
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
