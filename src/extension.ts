// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// Custom type definition
type Framework = "nextjs" | "sveltekit";
type CommandName = "search" | "rename" | "create" | "delete";
type CommandId = `project-explorer.${Framework}.${CommandName}`;

const workspaceUri = vscode.workspace.workspaceFolders![0].uri;
const appDirUri = vscode.Uri.joinPath(workspaceUri, "app");
interface Command {
  name: CommandName;
  framework: Framework;
  readonly commandId: CommandId;
  register(context: vscode.ExtensionContext, cb: () => void): void;
  isValidNextFile: (fileName: string) => boolean;
  showDirectoryContents(uri: vscode.Uri): Promise<void>;
  // createPageOrLayout(uri: vscode.Uri, fileName: string): Promise<void>;
  // deletePageOrLayout(uri: vscode.Uri, fileName: string): Promise<void>;
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
  async showDirectoryContents(uri: vscode.Uri) {
    const filesAndFolders = await vscode.workspace.fs.readDirectory(uri);
    const items = filesAndFolders
      .filter(
        ([name, fileType]) =>
          this.isValidNextFile(name) || fileType === vscode.FileType.Directory
      )
      .map(([name, type]) => ({
        fileName: name,
        label: this.isValidNextFile(name) ? "/" : name,
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
        await this.showDirectoryContents(selectedUri);
      } else {
        const selectedFile = await vscode.workspace.openTextDocument(
          selectedUri
        );
        await vscode.window.showTextDocument(selectedFile);
      }
    }
  }
  createPage(uri: vscode.Uri, fileName: string) {}
}

export function activate(_: vscode.ExtensionContext) {
  const nextSearch = new NextJsCommand("search");
  const nextCreate = new NextJsCommand("create");

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }

  nextSearch.register(_, async () => {
    await nextSearch.showDirectoryContents(appDirUri);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
