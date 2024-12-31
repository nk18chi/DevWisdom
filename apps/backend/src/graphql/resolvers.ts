import findFilesByExtension from './utils/findFilesByExtension';

const currentDir = __dirname;

const queryResolverFiles = findFilesByExtension(`${currentDir}/query`, '.resolver.ts');
const mutationResolverFiles = findFilesByExtension(`${currentDir}/mutation`, '.resolver.ts');

const schemas = async () =>
  (
    await Promise.all(
      [queryResolverFiles, mutationResolverFiles]
        .map(async (files) => Promise.all(files.map((filePath) => import(filePath).then((module) => module.default))))
        .flatMap((schema) => schema),
    )
  ).flatMap((schema) => schema);

export default schemas;
