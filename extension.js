// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "readme-tree" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('readme-tree.GetDirTree', function (param) {
		// The code you place here will be executed every time your command is executed
		// let runtimePath = param.fsPath (it's Equivalent)
		const runtimePath = vscode.window.activeTextEditor.document.fileName;
		const deep = vscode.workspace.getConfiguration('readme-tree').get('deep')
		const ignoreFile = vscode.workspace.getConfiguration('readme-tree').get('ignoreFile')

		const pathArr = runtimePath.split('\\')
		pathArr.pop()
		const runtimeDirectory = pathArr.join('\\')
		Object.assign(result, { path: runtimeDirectory, title: path.basename(runtimeDirectory), type: 'directory', deep: 0, extname: path.extname(runtimeDirectory) })

		readDirs(runtimeDirectory, 0, deep, ignoreFile)
		const treeDir = getFileTree(result)

		// console.log(result);

		enterText(treeDir)

		// Display a message box to the user
		// let successMsg = 'success add tree to readme'
		// vscode.window.showInformationMessage(successMsg);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

let result = {}
function readDirs(url, index = 0, deep, ignoreFile) {
	let deepFlag = (typeof deep === "number" ? (index < deep) : true)
	result.child = result.child || []
	const res = fs.readdirSync(url)
	res.map(item => {
		const itemPath = path.join(url, item)
		const isDirectory = fs.statSync(itemPath).isDirectory()
		const extname = path.extname(item)
		if (isDirectory && !ignoreFile.includes(item) && deepFlag) {
			result.child.push({ path: itemPath, title: path.basename(itemPath), type: 'directory', deep: index + 1, extname: extname })
			readDirs(itemPath, index + 1, deep, ignoreFile)
		}
		if (!isDirectory && !ignoreFile.includes(item) && index === 0 && deepFlag) {
			result.child.push({ path: itemPath, title: path.basename(itemPath), type: 'file', deep: index + 1, extname: extname })
		}
	})
}

function getFileTree(data) {
	if (!data) return
	const result = generateTree(data)
	return result
}

function generateTree(data) {
	let result = ''
	if (data.deep === 0) {
		result = '\n'
	}
	result += `${getSpace(data.deep)}${data.title}\n`
	data.child.map(item => {
		const newChild = item.child || []
		if (newChild.length > 0) {
			result += generateTree(item, item.deep)
		} else {
			result += `${getSpace(item.deep)}${item.title}\n`
		}
	})
	return result
}

function getSpace(index) {
	let str = ''
	for (let i = 1; i <= index; i++) {
		str += '    '
	}
	str += '├──'
	return str
}

// add something to now file, ref:https://stackoverflow.com/questions/38279920/how-to-open-file-and-insert-text-using-the-vscode-api
function enterText(text) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.insert(editor.selection.active, text);
		});
	}
}

module.exports = {
	activate,
	deactivate
}
