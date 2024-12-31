import * as fs from 'fs';
import * as path from 'path';

function findFilesByExtension(directory: string, extension: string) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return fs
        .readdirSync(entryPath)
        .filter((file) => file.endsWith(extension))
        .map((file) => path.join(`${entry.path}/${entry.name}`, file));
    }

    return [];
  });
}

export default findFilesByExtension;
