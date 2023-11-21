import * as vscode from "vscode";
import { CommandName, CommandId, File } from "../utils/types";
import Command from "../utils/command";

export default class NextJsCommand implements Command {
  name: CommandName;
  readonly commandId: CommandId;
  constructor(name: CommandName) {
    this.name = name;
    this.commandId = `next-project-explorer.${name}`;
  }
  async deletePageOrLayout(uri: vscode.Uri): Promise<void> {
    // TODO: group option by folder level
    const items = await this._getQuickPickOptions(uri);

    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: "Select a file or folder",
    });
    if (!selectedItem) {
      return;
    }
    const selectedUri = vscode.Uri.joinPath(uri, selectedItem.fileName);
    if (!selectedItem.isDirectory) {
      const option = await vscode.window.showWarningMessage(
        "Are you sure you want to delete this file?",
        "Yes",
        "No"
      );
      if (option === "Yes") {
        await vscode.workspace.fs.delete(selectedUri, {
          useTrash: true,
        });
      } else {
        return;
      }
    }

    await this.deletePageOrLayout(selectedUri);
  }

  async createPageOrLayout(uri: vscode.Uri): Promise<void> {
    const input = await vscode.window.showInputBox({
      prompt: "Enter the name of the page or layout relative to 'app/'",
    });
    if (!input) {
      vscode.window.showErrorMessage("No file name provided");
    }
    const pathToFileUri = vscode.Uri.joinPath(uri, input!);
    const pathToFile = pathToFileUri.fsPath;
    const fileName = pathToFile.split("\\").at(-1)!.slice(0, -4);
    await vscode.workspace.fs.writeFile(
      pathToFileUri,
      new Uint8Array(
        Buffer.from(`
      export default function ${fileName}() {
        return <div>${fileName}</div>
      }
      `)
      )
    );
    await this.openFile(pathToFileUri);
  }
  isValidNextFile = (fileName: string) =>
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx");

  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
  private async openFile(uri: vscode.Uri) {
    const selectedFile = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(selectedFile);
  }
  async showDirectoryContents(uri: vscode.Uri) {
    const items: File[] = await this._getQuickPickOptions(uri);

    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: "Select a file or folder",
    });
    if (selectedItem) {
      const selectedUri = vscode.Uri.joinPath(uri, selectedItem.fileName);
      if (selectedItem.isDirectory) {
        await this.showDirectoryContents(selectedUri);
      } else {
        await this.openFile(selectedUri);
      }
    }
  }

  async _getQuickPickOptions(uri: vscode.Uri) {
    const filesAndFolders = await vscode.workspace.fs.readDirectory(uri);
    const items: File[] = filesAndFolders
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
    return items;
  }
}
