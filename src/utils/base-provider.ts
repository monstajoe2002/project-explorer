import * as vscode from "vscode";
import FileTreeItem from "./file-tree-item";
export abstract class Provider<T extends vscode.TreeItem> {
  constructor(protected _projectDirUri: vscode.Uri) {}
  protected readonly _onDidChangeTreeData: vscode.EventEmitter<
    void | T | T[] | null | undefined
  > = new vscode.EventEmitter<void | T | T[] | null | undefined>();
  onDidChangeTreeData?:
    | vscode.Event<void | T | T[] | null | undefined>
    | undefined = this._onDidChangeTreeData.event;
  refresh(): void {
    this._onDidChangeTreeData?.fire();
  }
  getTreeItem(element: T): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  abstract getChildren(element?: T | undefined): vscode.ProviderResult<T[]>;
}
