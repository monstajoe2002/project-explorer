import * as vscode from "vscode";
import FileTreeItem from "../utils/file-tree-item";
import { Provider } from "../utils/base-provider";
class ActiveEditorsProvider
  extends Provider
  implements vscode.TreeDataProvider<FileTreeItem>
{
  getChildren(
    element?: FileTreeItem | undefined
  ): vscode.ProviderResult<FileTreeItem[]> {
    throw new Error("Method not implemented.");
  }
}
