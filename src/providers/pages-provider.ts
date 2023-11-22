import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import FileTreeItem from "../utils/file";
export default class PagesProvider
  implements vscode.TreeDataProvider<FileTreeItem>
{
  constructor(private projectDirUri: vscode.Uri) {}
  onDidChangeTreeData?:
    | vscode.Event<void | FileTreeItem | FileTreeItem[] | null | undefined>
    | undefined;

  getTreeItem(
    element: FileTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: FileTreeItem | undefined
  ): vscode.ProviderResult<FileTreeItem[]> {
    const files = fs.readdirSync(this.projectDirUri.fsPath);

    const treeItems = files
      // .filter((file) => file.includes("page"))
      .map((file) => {
        const filePath = path.join(this.projectDirUri.fsPath, file);
        const fileStat = fs.statSync(filePath);
        return new FileTreeItem(
          file,
          fileStat.isDirectory()
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,
          {
            command: "vscode.open",
            title: "Open File",
            arguments: [vscode.Uri.file(filePath)],
          }
        );
      });
    return treeItems;
  }

  getParent?(element: FileTreeItem): vscode.ProviderResult<FileTreeItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: FileTreeItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}
