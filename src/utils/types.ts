// Custom type definitions

export type Framework = "nextjs" | "sveltekit";
export type CommandName = "search" | "rename" | "create" | "delete";
export type CommandId = `project-explorer.${Framework}.${CommandName}`;
