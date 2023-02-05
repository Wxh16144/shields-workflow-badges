import YAML from 'yaml'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'

import { getMarkdownFiles, getWorkflowFiles } from './git';
import fs from 'fs';

const FILE_NAME_MARK = '__FILE_NAME__'

function getWorkflowFileName(fullPath: string) {
  return fullPath.split('/').pop();
}

interface Options {
  content: string;
  workflows: any[];
  branchName?: string;
  owner?: string;
  repo?: string;
}

type PluginParameters = Omit<Options, 'content'>

// old: https://img.shields.io/github/workflow/status/<owner>/<repo>/<workflow-name>?style=flat-square
// new: https://img.shields.io/github/actions/workflow/status/<owner>/<repo>/test.yml?branch=main&style=flat-square
function transformUrl(url: string, options: PluginParameters) {
  const {
    branchName = 'main',
    workflows = [],
    owner: coverOwner,
    repo: coverRepo,
  } = options;

  const myUrl = new URL(url);

  if (
    myUrl.hostname === 'img.shields.io' &&
    myUrl.pathname.startsWith('/github/workflow/status')
  ) {
    const [owner, repo, oldWorkflowName] = myUrl.pathname.split('/').slice(4);

    const matchedWorkflow = workflows.find(workflow => {
      return workflow?.name === decodeURIComponent(oldWorkflowName);
    })

    const workflowFileName = matchedWorkflow[FILE_NAME_MARK] ?? oldWorkflowName;

    myUrl.pathname = `/github/actions/workflow/status/${coverOwner ?? owner}/${coverRepo ?? repo}/${oldWorkflowName}.yml`;

    if (!myUrl.searchParams.has('branch')) {
      myUrl.searchParams.set('branch', branchName);
    }

    myUrl.pathname = `/github/actions/workflow/status/${coverOwner ?? owner}/${coverRepo ?? repo}/${workflowFileName}`;

    return myUrl.toString();
  }

  return url;
}

function remarkReplaceBadgeLink(options: PluginParameters) {

  return (ast: any) => {
    visit(ast, (node) => {
      switch (node.type) {
        case 'image':
        case 'link':
          node.url = transformUrl(node.url, options);
          break;

        default:
      }
    });
  };
}

function processUnit(options: Options) {
  const { content, ...restOptions } = options;

  return remark()
    .use<PluginParameters[]>(remarkReplaceBadgeLink, restOptions)
    .process(content);
}

async function replace(branchName?: string) {
  const workflowFiles = await getWorkflowFiles();

  const workflows = workflowFiles.map(
    (file) => ({
      [FILE_NAME_MARK]: getWorkflowFileName(file),
      ...YAML.parse(fs.readFileSync(file, 'utf8')),
    })
  );

  const markdowns = await getMarkdownFiles();

  for (const markdown of markdowns) {
    const content = fs.readFileSync(markdown, 'utf8');
    const result = await processUnit({ content, branchName, workflows });

    fs.writeFileSync(markdown, result.toString());
  }
}

export default replace;