import * as vscode from "vscode";
import FileTreeItem from "../utils/file-tree-item";
abstract class Provider {
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

  abstract getChildren(
    element?: FileTreeItem | undefined
  ): vscode.ProviderResult<FileTreeItem[]>;
}
