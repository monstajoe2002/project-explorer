// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import NextJsCommand from "./commands/nextjs-command";
import PagesProvider from "./providers/pages-provider";

const workspaceUri = vscode.workspace.workspaceFolders![0].uri;
const appDirUri = vscode.Uri.joinPath(workspaceUri, "app");
export function activate(_: vscode.ExtensionContext) {
  const nextSearch = new NextJsCommand("search");
  const nextCreate = new NextJsCommand("create");
  const nextDelete = new NextJsCommand("delete");
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }

  nextSearch.register(_, async () => {
    await nextSearch.showDirectoryContents(appDirUri);
  });
  nextCreate.register(_, async () => {
    await nextCreate.createPageOrLayout(appDirUri);
  });
  nextDelete.register(_, async () => {
    await nextDelete.deletePageOrLayout(appDirUri);
  });
  vscode.window.createTreeView("projectExplorer.pages", {
    treeDataProvider: new PagesProvider(appDirUri),
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
