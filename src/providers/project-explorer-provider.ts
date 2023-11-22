import * as vscode from "vscode";
import FileTreeItem from "../utils/file";
class ProjectExplorerProvider implements vscode.TreeDataProvider<FileTreeItem> {
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
    throw new Error("Method not implemented.");
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
