import * as vscode from "vscode";
import { Provider } from "../utils/base-provider";
import ActiveEditorsTreeItem from "../utils/active-editors-tree-item";
export default class ActiveEditorsProvider
  extends Provider<ActiveEditorsTreeItem>
  implements vscode.TreeDataProvider<ActiveEditorsTreeItem>
{
  constructor(protected _projectDirUri: vscode.Uri) {
    super(_projectDirUri);
  }
  protected readonly _onDidChangeTreeData: vscode.EventEmitter<
    void | ActiveEditorsTreeItem | ActiveEditorsTreeItem[] | null | undefined
  > = new vscode.EventEmitter<
    void | ActiveEditorsTreeItem | ActiveEditorsTreeItem[] | null | undefined
  >();
  onDidChangeTreeData?:
    | vscode.Event<
        | void
        | ActiveEditorsTreeItem
        | ActiveEditorsTreeItem[]
        | null
        | undefined
      >
    | undefined = this._onDidChangeTreeData.event;
  refresh(): void {
    this._onDidChangeTreeData?.fire();
  }
  getTreeItem(
    element: ActiveEditorsTreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: ActiveEditorsTreeItem | undefined
  ): vscode.ProviderResult<ActiveEditorsTreeItem[]> {
    const openDocuments = vscode.workspace.textDocuments;
    const activeEditors: ActiveEditorsTreeItem[] = [];
    this.refresh();
    openDocuments.forEach((editor) => {
      if (editor.fileName.endsWith(".git")) {
        return null;
      }
      const activeEditor = new ActiveEditorsTreeItem(
        "\\" +
          editor.fileName.substring(
            editor.fileName.indexOf("app\\") + "app\\".length
          ),
        vscode.TreeItemCollapsibleState.None,
        {
          command: "vscode.open",
          title: "",
          arguments: [editor.uri],
        }
      );
      activeEditors.push(activeEditor);
    });
    return activeEditors;
  }
  closeEditor(element: ActiveEditorsTreeItem) {
    vscode.window.visibleTextEditors.map((editor) => {
      if (editor.document.fileName === element.label) {
        vscode.commands.executeCommand("workbench.action.closeActiveEditor");
      }
    });
    this.refresh();
    return;
  }
}
