import findFilesByExtension from './utils/findFilesByExtension';
import path from 'path';

const currentDir = __dirname;
const fileExtension = path.extname(__filename) === '.js' ? '.resolver.js' : '.resolver.ts';

const queryResolverFiles = findFilesByExtension(`${currentDir}/query`, fileExtension);
const mutationResolverFiles = findFilesByExtension(`${currentDir}/mutation`, fileExtension);

const schemas = async () =>
  (
    await Promise.all(
      [queryResolverFiles, mutationResolverFiles]
        .map(async (files) => Promise.all(files.map((filePath) => import(filePath).then((module) => module.default))))
        .flatMap((schema) => schema),
    )
  ).flatMap((schema) => schema);

export default schemas;
