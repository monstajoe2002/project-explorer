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
  constructor(framework: Framework) {
    this.name = "search";
    this.framework = framework;
    this.commandId = `project-explorer.${framework}.${this.name}`;
  }
  isValidNextFile = (fileName: string) =>
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx");

  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
}
class NextJsCommand implements Command {
  name: CommandName;
  readonly commandId: CommandId;
  framework: Framework;
  constructor(name: CommandName) {
    this.name = name;
    this.framework = "nextjs";
    this.commandId = `project-explorer.${this.framework}.${name}`;
  }
  isValidNextFile = (fileName: string) =>
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx");

  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
}
const uri = vscode.workspace.workspaceFolders![0].uri;
const workspacePath = uri.fsPath;

export function activate(_: vscode.ExtensionContext) {
  const { framework, register, isValidNextFile } = new NextJsCommand("search");

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }

  register(_, async () => {
    const workspaceUri = vscode.workspace.workspaceFolders![0].uri;
    const appDirUri = vscode.Uri.joinPath(workspaceUri, "app");
    await showDirectoryContents(appDirUri);
  });

  async function showDirectoryContents(uri: vscode.Uri) {
    const filesAndFolders = await vscode.workspace.fs.readDirectory(uri);
    const items = filesAndFolders
      .filter(
        ([name, fileType]) =>
          isValidNextFile(name) || fileType === vscode.FileType.Directory
      )
      .map(([name, type]) => ({
        fileName: name,
        label: isValidNextFile(name) ? "/" : name,
        isDirectory: type === vscode.FileType.Directory,
        description:
          type === vscode.FileType.Directory
            ? "folder"
            : name.includes("page")
            ? "page"
            : "layout",
      }))
      .sort((a, b) => (a.label === b.label ? 0 : a.label > b.label ? 1 : -1));

    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: "Select a file or folder",
    });
    if (selectedItem) {
      const selectedUri = vscode.Uri.joinPath(uri, selectedItem.fileName);
      if (selectedItem.isDirectory) {
        await showDirectoryContents(selectedUri);
      } else {
        const selectedFile = await vscode.workspace.openTextDocument(
          selectedUri
        );
        await vscode.window.showTextDocument(selectedFile);
      }
    }
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
