import findFilesByExtension from './utils/findFilesByExtension';

const currentDir = __dirname;

const directiveSchemaFiles = findFilesByExtension(`${currentDir}/directive`, '.schema.ts');
const querySchemaFiles = findFilesByExtension(`${currentDir}/query`, '.schema.ts');
const mutationSchemaFiles = findFilesByExtension(`${currentDir}/mutation`, '.schema.ts');

const schemas = async () =>
  (
    await Promise.all(
      [directiveSchemaFiles, querySchemaFiles, mutationSchemaFiles]
        .map(async (files) => Promise.all(files.map((filePath) => import(filePath).then((module) => module.default))))
        .flatMap((schema) => schema),
    )
  ).flatMap((schema) => schema);

export default schemas;
