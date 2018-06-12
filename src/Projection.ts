const fs = require("fs");
import * as vscode from "vscode";
import * as utils from "./utils";
import * as AlternatePattern from "./AlternatePattern";
import * as FilePath from "./FilePath";

export interface t {
  [sourcePattern: string]: SourceData;
}

interface SourceData {
  alternate: string;
}

const projectionsFilename = ".projections.json";

export const findProjections = (): Thenable<t> =>
  FilePath.findFileUri(projectionsFilename)
    .then(
      (uri: vscode.Uri) =>
        new Promise<string>((resolve, reject) => {
          fs.readFile(uri.fsPath, (err: any, data: string) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        })
    )
    .then(parseProjections);

export const projectionsToAlternatePatterns = (
  projections: t
): AlternatePattern.t[] => {
  const pairs = utils.toPairs(projections) as [string, SourceData][];
  return pairs.map(projectionPairToAlternatePattern);
};

const parseProjections: (file: string) => t = JSON.parse;

const projectionPairToAlternatePattern = ([src, { alternate }]: [
  string,
  SourceData
]): AlternatePattern.t => ({ src, spec: alternate });