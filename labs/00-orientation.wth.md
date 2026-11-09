# What the heck was that lab about?

## Angular CLI

- Installed globally on a machine
    - Can be good and bad - bad if you need multiple versions (ERO, etc.)
- Each project gets a "copy" of it, too.

`ng --help` can get you going.

Use `ng new` to create an Angular app.

Use `ng serve` to compile and open the development server.
- runs by default at `http://localhost:4200`
- How would you find out how to have it run on a different port?

## **ALWAYS** Open VSCode in the directory that has the `.vscode`, `package.json` and `angular.json` files.

## Command line stuff
- `code .` says "open a new instance of VS Code RIGHT HERE in this directory (that's what the period means.)
- `code -r .` says open a new instance of VS Code RIGHT HERE in this directory, but if I already have an instance running, reuse that one.

## Scripts in `package.json`

These are "shortcuts" for common tasks you might want to do within your application. You can add new ones, etc.

A super cool feature of this is the ability to use VS Code to run them.

Also - scripts *always* look in `./node_modules/.bin` for a command before looking in your path. So, the `ng` that runs when you run the `ng serve` command is the one in your project, not the one you installed globally.

