// Custom type definitions

export type CommandName = "search" | "rename" | "create" | "delete";
export type CommandId = `next-project-explorer.${CommandName}`;
export type File = {
  fileName: string;
  label: string;
  isDirectory: boolean;
  description: string;
};
