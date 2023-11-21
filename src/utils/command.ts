import * as vscode from "vscode";
import { CommandName, CommandId, File } from "./types";

export default interface Command {
  name: CommandName;
  readonly commandId: CommandId;
  register(context: vscode.ExtensionContext, cb: () => void): void;
  isValidNextFile: (fileName: string) => boolean;
  _getQuickPickOptions(uri: vscode.Uri): Promise<File[]>;
  showDirectoryContents(uri: vscode.Uri): Promise<void>;
  createPageOrLayout(uri: vscode.Uri): Promise<void>;
  deletePageOrLayout(uri: vscode.Uri): Promise<void>;
}
