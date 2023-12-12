import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import FileTreeItem from "../utils/file-tree-item";
import { Provider } from "./base-provider";
export default class PagesProvider
  extends Provider
  implements vscode.TreeDataProvider<FileTreeItem>
{
  constructor(protected projectDirUri: vscode.Uri) {
    super(projectDirUri);
  }
  protected readonly _onDidChangeTreeData: vscode.EventEmitter<
    void | FileTreeItem | FileTreeItem[] | null | undefined
  > = new vscode.EventEmitter<
    void | FileTreeItem | FileTreeItem[] | null | undefined
  >();
  onDidChangeTreeData?:
    | vscode.Event<void | FileTreeItem | FileTreeItem[] | null | undefined>
    | undefined = this._onDidChangeTreeData.event;
  refresh(): void {
    this._onDidChangeTreeData?.fire();
  }
  getTreeItem(
    element: FileTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: FileTreeItem | undefined
  ): vscode.ProviderResult<FileTreeItem[]> {
    if (!this.projectDirUri) {
      vscode.window.showInformationMessage("No file in empty workspace");
      return [];
    }
    let rootDir: vscode.Uri = this.projectDirUri;
    if (element) {
      rootDir = element.resourceUri!;
    }
    if (!rootDir || !rootDir.fsPath) {
      vscode.window.showErrorMessage("Invalid directory");
      return [];
    }

    try {
      const files = fs.readdirSync(rootDir.fsPath, { withFileTypes: true });
      const fileTreeItems: FileTreeItem[] = [];
      files.forEach((file) => {
        let filePath = path.join(rootDir.fsPath, file.name);

        const fileTreeItem = new FileTreeItem(
          file.isFile() ? "/" : `/${file.name}`,

          file.isDirectory()
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,

          {
            command: "vscode.open",
            title: "",
            arguments: [vscode.Uri.file(filePath)],
          }
        );
        fileTreeItem.resourceUri = vscode.Uri.file(filePath);
        if (!file.isDirectory() && !file.name.includes("page")) {
          return;
        }
        fileTreeItems.push(fileTreeItem);
      });
      return fileTreeItems;
    } catch (err) {
      vscode.window.showErrorMessage("Error reading directory");
      return [];
    }
  }
  async deleteFile(element: FileTreeItem) {
    const fileToDelete = await this.getTreeItem(element);
    if (!fileToDelete) {
      vscode.window.showErrorMessage("Failed to delete");
    }
    await vscode.workspace.fs.delete(fileToDelete.resourceUri!, {
      recursive: true,
      useTrash: true,
    });
    this.refresh();
  }
  async renameFile(appDirUri: vscode.Uri, element: FileTreeItem) {
    const fileToRename = await this.getTreeItem(element);
    if (!fileToRename) {
      vscode.window.showErrorMessage("Failed to rename");
    }
    const newPath = await vscode.window.showInputBox();
    if (!newPath) {
      return;
    }
    const newPathUri = vscode.Uri.parse(newPath);
    await vscode.workspace.fs.rename(
      fileToRename.resourceUri!,
      vscode.Uri.joinPath(appDirUri, newPathUri.fsPath)
    );
    this.refresh();
  }
}
