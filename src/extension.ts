// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import NextJsCommand from "./commands/nextjs-command";
import PagesProvider from "./providers/pages-provider";
import FileTreeItem from "./utils/file-tree-item";
import LayoutsProvider from "./providers/layouts-provider";
import path from "path";
import ActiveEditorsProvider from "./providers/active-editors-provider";

const workspaceUri = vscode.workspace.workspaceFolders![0].uri;
let appDirUri: vscode.Uri;
export async function activate(_: vscode.ExtensionContext) {
  const nextSearch = new NextJsCommand("search");
  const nextCreate = new NextJsCommand("create");
  const nextDelete = new NextJsCommand("delete");
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folder open");
    return;
  }
  const workspaceRootContent = await vscode.workspace.fs.readDirectory(
    workspaceUri
  );

  const srcFolderExists = workspaceRootContent.some(([name]) => name === "src");

  if (srcFolderExists) {
    appDirUri = vscode.Uri.joinPath(workspaceUri, "src", "app");
  } else {
    appDirUri = vscode.Uri.joinPath(workspaceUri, "app");
  }

  const pagesTree = new PagesProvider(appDirUri);
  const layoutsTree = new LayoutsProvider(appDirUri);
  const activeEditorsTree = new ActiveEditorsProvider(appDirUri);
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
    treeDataProvider: pagesTree,
  });
  vscode.window.createTreeView("projectExplorer.layouts", {
    treeDataProvider: layoutsTree,
  });
  vscode.window.createTreeView("projectExplorer.activeEditors", {
    treeDataProvider: activeEditorsTree,
  });
  vscode.commands.registerCommand("project-explorer.tree.refresh", () => {
    pagesTree.refresh();
    layoutsTree.refresh();
    activeEditorsTree.refresh();
  });
  vscode.commands.registerCommand(
    "project-explorer.tree.delete",
    (el: FileTreeItem) => {
      pagesTree.deleteFile(el);
    }
  );
  vscode.commands.registerCommand(
    "project-explorer.tree.rename",
    (el: FileTreeItem) => {
      pagesTree.renameFile(appDirUri, el);
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
