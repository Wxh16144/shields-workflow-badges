import glob from "fast-glob";
import simpleGit, { type SimpleGit } from 'simple-git';
import { Octokit } from '@octokit/core'

export const git: SimpleGit = simpleGit({
  baseDir: process.cwd(),
});

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getWorkflowFiles = async () => await glob([".github/workflows/*.yml"]);

export const getMarkdownFiles = async (pattern: string | string[] = '*.md') => await glob([
  ...(Array.isArray(pattern) ? pattern : [pattern]),
  '!node_modules/**',
]);

export const getOwnerAndRepo = async () => {
  const remotes = await git.getRemotes(true);
  let url: string = '';

  // upstream > origin
  remotes.forEach(remote => {
    if (remote.name === "upstream") {
      url = remote.refs.fetch;
    } else if (remote.name === "origin") {
      url = remote.refs.fetch;
    }
  })

  const regex = /github\.com[:\/](?<owner>.+)\/(?<repo>.+)\.git/;
  return url.match(regex)?.groups ?? { owner: '', repo: '' }
}

export const getRemoteRepo = async () => {
  const { owner, repo } = await getOwnerAndRepo();

  const res = await octokit.request('GET /repos/{owner}/{repo}', {
    owner,
    repo,
  })

  return res.data;
}