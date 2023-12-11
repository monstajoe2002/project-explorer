# Project Explorer README
<a href="https://www.producthunt.com/posts/project-explorer?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-project&#0045;explorer" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=427756&theme=neutral" alt="Project&#0032;Explorer - Organize&#0032;and&#0032;view&#0032;your&#0032;Next&#0046;js&#0032;project&#0032;in&#0032;an&#0032;intuitive&#0032;way&#0032; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
A convenient extension for searching and creating page and layout files in a Next.js application project.

## Motivation

With the introduction of [Next.js 13](https://nextjs.org/), the `app` directory is now the default location for page and layout files. However, every page and layout file must be created manually and must be named with the `page.jsx` or `layout.jsx` (or `.tsx` for TypeScript projects). This extension aims to make it easier to create and search for page and layout files through commands and custom tree views.

## Features

You can access the Project Explorer through the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) by searching for `Project Explorer`. This allows you to search for, create and delete page and layout files.

![Command Palette Feature](resources/features/command-palette.gif)

You can also access the Project Explorer through the sidebar. This allows you to search for and delete page and layout files. However, you can also rename file paths through the sidebar.
![Project Tree View](resources/features/treeview.gif)

## Requirements

This extension works in Next.js 13+ projects with `app` directory enabled **only**.

## Known Issues

When you delete a file through the command palette, VS Code will through an error saying that the file is not found. *See screenshot below*. This is a known issue with VS Code and is not related to this extension.
![Alt text](delete-error.png)
