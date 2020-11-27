/*
Copyright 2020 JamJar Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import minimist from "minimist";
import * as path from "path";
import * as fs from "fs";
import * as handlebars from "handlebars";
import * as inquirer from "inquirer";

const argv = minimist(process.argv.slice(2));

const positionalArgs = argv._;

if (positionalArgs.length <= 0) {
    console.error("Must provide a directory to initialize the JamJar game to as an argument, exiting");
    process.exit(1);
}

inquirer.prompt([
    {
        "type": "input",
        "name": "game_name",
        "message": "Game name (this will be the project name)",
        "validate": (input: string) => {
            if (input !== "") {
                return true;
            }

            return "Please enter a name for the game";
        }
    },
    {
        "type": "input",
        "name": "game_description",
        "message": "Game description"
    },
    {
        "type": "input",
        "name": "game_version",
        "message": "Game description",
        "default": "0.0.0"
    },
    {
        "type": "input",
        "name": "game_license",
        "message": "Game license",
        "default": "Apache-2.0"
    }
]).then((answers: any) => {
    const targetDirectory = positionalArgs[0];
    const targetDirectoryPath = path.join(process.cwd(), targetDirectory);

    if (!fs.existsSync(targetDirectoryPath)) {
        fs.mkdirSync(targetDirectoryPath);
    }

    const templateDirectory = path.join(__dirname, "..", "template");

    function directoryTraverse(templateRoot: string, directory: string, targetRoot: string, configuration: any)
    {
        const directoryPath = path.join(templateRoot, directory);
        const children = fs.readdirSync(directoryPath);
        for (const child of children) {
            const childRelativePath = path.join(directory, child);
            const childAbsolutePath = path.join(templateRoot, childRelativePath)
            if (fs.lstatSync(childAbsolutePath).isDirectory()) {
                fs.mkdirSync(path.join(targetRoot, childRelativePath));
                directoryTraverse(templateDirectory, childRelativePath, targetDirectoryPath, configuration);
            }
            else {
                const data = fs.readFileSync(childAbsolutePath, "utf-8");
                const template = handlebars.compile(data);
                fs.writeFileSync(path.join(targetRoot, childRelativePath), template(configuration));
            }
        }
    }

    directoryTraverse(templateDirectory, "", targetDirectoryPath, answers)

});
