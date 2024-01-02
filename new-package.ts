import fs from "fs-extra";
import { spawn } from "child_process";

const project_path = __dirname + '/generated/typescript';
const package_path = project_path + '/package.json';
import fern from "./fern/fern.config.json";
import project from "./package.json";

var package_json = {
    "name": project.name + '-sdk',
    "version": project.version,
    "description": project.description,
    "main": "src/index.js",
    "types": "src/index.d.ts",
    "author": project.author,
    "license": project.license,
    "dependencies": {
        "axios": "^1.6.3",
        "url-join": "^4.0.1"
    }
}

fs.outputJSON(package_path, package_json, {spaces: 2, EOL: '\n'}).then(() => {
    console.log('generated package.');

    const child = spawn('npm', ['i'], { cwd: project_path });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('error', (error) => {
        console.error(`Error: ${error}`);
    });

    child.on('close', () => {
        console.log("\x1b[32m%s\x1b[0m", "  Please run the following command:"); // Blue text
        console.log("\x1b[32m%s\x1b[0m", `  npm link ${package_json.name}`); // Green text
    })
}).catch((error) => {
    console.error(error);
})
