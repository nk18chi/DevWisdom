import findFilesByExtension from './utils/findFilesByExtension';
import path from 'path';

const currentDir = __dirname;
/* v8 ignore next */
const fileExtension = path.extname(__filename) === '.js' ? '.schema.js' : '.schema.ts'; // this if condition is for build time

const directiveSchemaFiles = findFilesByExtension(`${currentDir}/directive`, fileExtension);
const querySchemaFiles = findFilesByExtension(`${currentDir}/query`, fileExtension);
const mutationSchemaFiles = findFilesByExtension(`${currentDir}/mutation`, fileExtension);

const schemas = async () =>
  (
    await Promise.all(
      [directiveSchemaFiles, querySchemaFiles, mutationSchemaFiles]
        .map(async (files) => Promise.all(files.map((filePath) => import(filePath).then((module) => module.default))))
        .flatMap((schema) => schema),
    )
  ).flatMap((schema) => schema);

export default schemas;
