import fs from "fs/promises";
import { exec, execSync } from "child_process";
import { argv } from "process";
import path from "path";

let libToBeCompiled = argv[2];

/**
 * WARNING!
 * 
 * THIS CODE IS UTTERLY RIDICULOUS
 * 
 * I'm dumb, so what this code does is:
 * 
 * - Pick up a .c file
 * - Put it in the /examples quickjs folder
 * - Compile it as the fibonacci example (because that worked)
 * - Get the .so from fibonacci and rename it to lib.so
 * - Put it in the executable
 * 
 * Yes, I'm using an entire toolchain to build a single .so
 * because I'm dumb enough to find why I can't build it with the commands
 * I tried so far. And I want to progress into making an usable HTTP server for quickjs 
 * first. So this will have to wait.
 */
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
