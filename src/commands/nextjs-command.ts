import * as vscode from "vscode";
import { CommandName, CommandId, File } from "../utils/types";
import Command from "../utils/command";

export default class NextJsCommand implements Command {
  name: CommandName;
  readonly commandId: CommandId;
  constructor(name: CommandName) {
    this.name = name;
    this.commandId = `project-explorer.${name}`;
  }
  async deletePageOrLayout(uri: vscode.Uri): Promise<void> {
    const items = await this._getQuickPickOptions(uri);

    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: "Select a file or folder",
    });
    if (!selectedItem) {
      return;
    }
    const selectedUri = vscode.Uri.joinPath(uri, selectedItem.fileName);
    console.log(selectedUri);
    if (!selectedItem.isDirectory) {
      const option = await vscode.window.showWarningMessage(
        "Are you sure you want to delete this file?",
        "Yes",
        "No"
      );
      if (option === "No") {
        return;
      }
      await vscode.workspace.fs.delete(selectedUri, {
        useTrash: true,
      });
      vscode.window.showInformationMessage(`Deleted ${selectedItem.fileName}`);
    }

    await this.deletePageOrLayout(selectedUri);
  }

  async createPageOrLayout(uri: vscode.Uri): Promise<void> {
    const pageOrLayout = await vscode.window.showQuickPick(["Page", "Layout"], {
      placeHolder: "Choose page or layout",
    });

    if (!pageOrLayout) {
      vscode.window.showErrorMessage("No page or layout selected");
      return;
    }

    const isPage = pageOrLayout === "Page";

    const input = await vscode.window.showInputBox({
      prompt: `Enter the name of the ${
        isPage ? "page" : "layout"
      } relative to 'app/' without extension`,
      value: pageOrLayout === "Page" ? "page.tsx" : "layout.tsx",
    });

    if (!input) {
      vscode.window.showErrorMessage("No file name provided");
      return;
    }

    const pathToFileUri = vscode.Uri.joinPath(uri, input);
    const pathToFile = pathToFileUri.fsPath;
    const fileName = pathToFile.split("\\").at(-2);

    await vscode.workspace.fs.writeFile(
      pathToFileUri,
      new Uint8Array(
        Buffer.from(`
    ${
      isPage
        ? `
    export default function ${
      fileName![0].toUpperCase() + fileName!.slice(1) + pageOrLayout
    }() {
      return <div>${fileName} page</div>
    }`
        : `
    export default function ${
      fileName![0].toUpperCase() + fileName!.slice(1) + pageOrLayout
    }({ children }) {
      return <div>{children}</div>
    }`
    }
    `)
      )
    );

    await this._openFile(pathToFileUri);
  }

  isValidNextFile = (fileName: string) =>
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx");

  register(context: vscode.ExtensionContext, cb: () => void): void {
    const disposable = vscode.commands.registerCommand(this.commandId, cb);
    context.subscriptions.push(disposable);
  }
  private async _openFile(uri: vscode.Uri) {
    await vscode.commands.executeCommand("vscode.open", uri);
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
        await this._openFile(selectedUri);
      }
    }
  }

  private async _getQuickPickOptions(uri: vscode.Uri) {
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
