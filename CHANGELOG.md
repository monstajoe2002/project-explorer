# Change Log

All notable changes to **Project Explorer** will be documented in this file.

## [0.1.4] - 2023-12-02

### Fixed

- Replace minus sign with ttrash in the tree view

## [0.1.3] - 2023-11-29

### Fixed

- Even though the extension checks if an `src` folder exists, it would fail to detect the `app` directory if it's in the project root

### Added

- Project Tree View auto-refershes on deleting and renaming files and folders

## [0.1.2] - 2023-11-26

### Fixed

- The extension assumed that the workspace folder is the root of the project. This is not always the case. The extension now checks if `app` is located in the `src` folder. If not, it will use the workspace folder as the root of the project.

## [0.1.1] - 2023-11-24

### Removed

- Custom icons for files and folders and used bulit-in product icons instead.

### Fixed

- Tree view not showing up in the explorer view.

## [0.1.0] - 2023-11-24

- Initial release 🎉
