import * as vscode from "vscode";
import FileTreeItem from "../utils/file-tree-item";
import { Provider } from "../utils/base-provider";
import ActiveEditorsTreeItem from "../utils/active-editors-tree-item";
class ActiveEditorsProvider
  extends Provider<ActiveEditorsTreeItem>
  implements vscode.TreeDataProvider<FileTreeItem>
{
  getChildren(
    element?: FileTreeItem | undefined
  ): vscode.ProviderResult<FileTreeItem[]> {
    throw new Error("Method not implemented.");
  }
}
