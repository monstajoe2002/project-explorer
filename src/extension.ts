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
const uri = vscode.workspace.workspaceFolders![0].uri;
const workspacePath = uri.fsPath;

export function activate(_: vscode.ExtensionContext) {
  const { framework, isValidNextFile, register } = new SearchFileCommand(
    "nextjs"
  );

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }
  async function showDirectoryContents(uri: vscode.Uri) {
    const filesAndFolders = await vscode.workspace.fs.readDirectory(uri);
    const folders = filesAndFolders
      .filter(([_, fileType]) => fileType === vscode.FileType.Directory)
      .map(([name, fileType]) => ({
        name,
        fileType,
        label: `${name}/`,
        description: "Folder",
      }));
    const files = filesAndFolders
      .filter(
        ([name, fileType]) =>
          fileType === vscode.FileType.File && isValidNextFile(name)
      )
      .map(([name, fileType]) => ({
        name,
        fileType,
        label: "/",
        description: name.includes("page") ? "page" : "layout",
      }));
    const selectedItem = await vscode.window.showQuickPick([
      ...files,
      ...folders,
    ]);
    if (selectedItem) {
      const selectedUri = vscode.Uri.joinPath(uri, selectedItem.name);
      if (selectedItem.fileType === vscode.FileType.Directory) {
        await showDirectoryContents(selectedUri);
      } else {
        const selectedFile = await vscode.workspace.openTextDocument(
          selectedUri
        );
        await vscode.window.showTextDocument(selectedFile);
      }
    }
  }
  async function nextInit() {
    const APP_DIR_PATH = `${workspacePath}/app`;
    const appDirUri = vscode.Uri.file(APP_DIR_PATH);
    const appDir = await vscode.workspace.fs.readDirectory(appDirUri);
    if (!appDir) {
      return;
    }
    const appDirFolders = appDir
      .filter(([_, fileType]) => fileType === vscode.FileType.Directory)
      .map(([name, fileType]) => ({
        name,
        fileType,
        label: `${name}/`,
        description: "Folder",
      }));
    const appDirFiles = appDir
      .filter(
        ([name, fileType]) =>
          fileType === vscode.FileType.File && isValidNextFile(name)
      )
      .map(([name, fileType]) => ({
        name,
        fileType,
        label: "/",
        description: name.includes("page") ? "page" : "layout",
      }));
    const selected = await vscode.window.showQuickPick([
      ...appDirFiles,
      ...appDirFolders,
    ]);
    if (!selected) {
      return;
    }
    const selectedPath = APP_DIR_PATH.concat("/", selected.name);
    const selectedUri = vscode.Uri.file(selectedPath);
    showDirectoryContents(selectedUri);
  }
  register(_, async () => {
    switch (framework) {
      case "nextjs":
        nextInit();
        break;
      case "sveltekit":
        break;
      default:
        break;
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
