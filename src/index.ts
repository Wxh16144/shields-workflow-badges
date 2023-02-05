import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import chalk from "chalk";
import mri from "mri";
import replace from "./replace";
import { getRemoteRepo } from "./git";
import type { Argv } from "./type";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolvePath = (...arg: any[]) => path.resolve(__dirname, '..', ...arg);
const readFileSync = (path: string) => fs.readFileSync(resolvePath(path), 'utf8');
const pkg = JSON.parse(readFileSync('./package.json'));

const argv = mri<Argv>(process.argv.slice(2), {
  alias: { h: 'help', v: 'version', b: 'branch', g: 'glob' },
  string: ['branch', 'glob'],
});

async function main(args: Argv = argv) {
  if (args.version) {
    console.log(`${chalk.bold(pkg.name)}: ${chalk.green('v' + pkg.version)}`);
    return;
  }

  if (args.help) {
    console.log(`
    npx ${pkg.name} [options] [file]
    ----------------------------------------
    ${chalk.bold('[options]')}
      -g, --glob: specify glob pattern. default: **/*.md
      -b, --branch: specify branch name. default: GitHub default branch.
    -h, --help: show help.
    -v, --version: show version. ${chalk.green('v' + pkg.version)}
    ----------------------------------------
    ${chalk.bold('e.g.')} ${chalk.green(`${pkg.name} README.md`)}
  `)
    return;
  }

  let branch = args.branch;
  let glob: string | string[] | undefined = args.glob;

  if (!branch) {
    const { default_branch } = await getRemoteRepo();
    branch = default_branch;
  }
  
  if (!glob && args._.length > 0) {
    glob = args._
  }

  await replace({ branch, glob: glob ?? '**/*.md' });
}

export default main;
