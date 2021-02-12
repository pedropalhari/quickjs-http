import fs from "fs/promises";
import { exec, execSync } from "child_process";
import { argv } from "process";
import path from "path";

let libToBeCompiled = argv[2];

(async () => {
  let libContentsBuffer = await fs.readFile(libToBeCompiled);
  let libContents = libContentsBuffer.toString();

  await fs.writeFile(
    path.join(__dirname, "../qjs-lib/examples/fib.c"),
    libContents
  );

  execSync("make", { cwd: path.join(__dirname, "../qjs-lib") });
  await fs.copyFile(
    path.join(__dirname, "../qjs-lib/examples/fib.so"),
    path.join(__dirname, "../qjs-src/lib.so")
  );

  await fs.rm(path.join(__dirname, "../qjs-lib/examples/fib.c"));
  await fs.rm(path.join(__dirname, "../qjs-lib/examples/fib.so"));

  console.log("DONE!");
})();
