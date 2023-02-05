export interface Argv {
  branch?: string;
  glob?: string;
  help?: boolean;
  version?: boolean;
  _: string[];
}

export interface Options {
  content: string;
  workflows: any[];
  branchName?: string;
  owner?: string;
  repo?: string;
}

export type PluginParameters = Omit<Options, 'content'>
export type ReplaceParameters = {
  branch: string;
  glob: string | string[];
}