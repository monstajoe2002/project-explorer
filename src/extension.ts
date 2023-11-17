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

const searchCommand: SearchFileCommand = new SearchFileCommand("nextjs");

export function activate(_: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }
  searchCommand.register(_, async () => {
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
          .map(([name]) => ({
            label: `${name}/`,
            description: "Folder",
          }));
        const appDirFiles = appDir
          .filter(
            ([name, fileType]) =>
              fileType === vscode.FileType.File &&
              searchCommand.isValidNextFile(name)
          )
          .map(([name]) => name);
        // const fileOptions = appDirFiles.map((fileName) => ({
        //   fileName,
        //   label: "/",
        //   description: fileName === "page.tsx" ? "page" : "layout",
        // }));
        // const folderOptions = appDirFolders.map((fileName) => ({
        //   fileName,
        //   label: fileName,
        //   description: "Folder",
        // }));
        // const selected = await vscode.window.showQuickPick([
        //   ...appDirFiles,
        //   ...appDirFolders,
        // ]);
        // const selectedPath = APP_DIR_PATH.concat("/", selected?.fileName || "");
        // const selectedUri = vscode.Uri.file(selectedPath);
        // const selectedFile = await vscode.workspace.openTextDocument(
        //   selectedUri
        // );
        // await vscode.window.showTextDocument(selectedFile);
        break;

      default:
        break;
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
