import * as vscode from "vscode";
import { Provider } from "../utils/base-provider";
import ActiveEditorsTreeItem from "../utils/active-editors-tree-item";
import { P, match } from "ts-pattern";
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
    openDocuments.forEach((editor) => {
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
      match(editor.fileName)
        .with(P.string.includes("page"), () => {
          activeEditors.push(activeEditor);
        })
        .with(P.string.includes("layout"), () => {
          activeEditors.push(activeEditor);
        })
        // refuses to exclude '.git' files from tree view despite being in the matching pattern
        // .with(P.string.endsWith(".git"), () => null)
        .otherwise(() => null);
    });
    this.refresh();
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
