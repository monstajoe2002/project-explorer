import * as vscode from "vscode";
import FileTreeItem from "./file-tree-item";
export abstract class Provider {
  constructor(protected _projectDirUri: vscode.Uri) {}
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

  abstract getChildren(
    element?: FileTreeItem | undefined
  ): vscode.ProviderResult<FileTreeItem[]>;
}
