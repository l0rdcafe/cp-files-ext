#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");

program
  .version("1.0.0")
  .option("-H --html", "HTML extension")
  .option("-c --css", "CSS extension")
  .option("-j --js", "JS extension")
  .option("-t --txt", "TXT extension")
  .parse(process.argv);

function readDirContents(dir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      reject(new Error(`${dir} does not exist.`));
    }
    fs.readdir(dir, (err, contents) => {
      if (err) {
        reject(err);
      }
      resolve(contents);
    });
  });
}

function filterFilesByExt(files, ext) {
  return files.filter(file => file.endsWith(ext));
}

function copyFiles(files, dir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync("./new")) {
      fs.mkdirSync("./new", error => {
        if (error) {
          reject(error);
        }
      });
    }

    files.forEach(file => {
      fs.copyFile(`./${dir}/${file}`, `./new/${file}`, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
}

async function handler(ext) {
  try {
    const dir = program.args[0];
    const contents = await readDirContents(dir);
    const files = filterFilesByExt(contents, ext);
    await copyFiles(files, dir);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

function main() {
  if (process.argv.length < 4) {
    console.log("Please specify a directory and one of the following file extensions: --js, --txt, --html, --css");
    process.exit(1);
  }

  if (program.html) {
    handler(".html");
    console.log("HTML files copied to directory named new.");
  }

  if (program.css) {
    handler(".css");
    console.log("CSS files copied to directory named new.");
  }

  if (program.js) {
    handler(".js");
    console.log("JS files copied to directory named new.");
  }

  if (program.txt) {
    handler(".txt");
    console.log("TXT files copied to directory named new.");
  }
}

main();
