import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import FileTreeItem from "../utils/file-tree-item";
export default class PagesProvider
  implements vscode.TreeDataProvider<FileTreeItem>
{
  constructor(private projectDirUri: vscode.Uri) {}
  private _onDidChangeTreeData: vscode.EventEmitter<
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
      console.error("Error reading directory:", err);
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
    });
  }
}
