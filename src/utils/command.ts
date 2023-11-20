import * as vscode from "vscode";
import { CommandName, Framework, CommandId } from "./types";

export default interface Command {
  name: CommandName;
  framework: Framework;
  readonly commandId: CommandId;
  register(context: vscode.ExtensionContext, cb: () => void): void;
  isValidNextFile: (fileName: string) => boolean;
  showDirectoryContents(uri: vscode.Uri): Promise<void>;
  createPageOrLayout(uri: vscode.Uri): Promise<void>;
  deletePageOrLayout(uri: vscode.Uri): Promise<void>;
}
