
import replace from "./replace";
import {
  getOwnerAndRepo,
  getRemoteRepo
} from "./git";


async function main() {
  const { owner, repo } = await getOwnerAndRepo();

  // const { default_branch } = await getRemoteRepo(); // NOTE: Avoid speed limit
  const default_branch = "main";

  await replace(default_branch);
}

main().
  then(
    () => console.log("Done!")
  ).catch(e => {
    console.error(e);
  })