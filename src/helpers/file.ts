import fs from 'fs';
import path from 'path';

const createFolderIfNotExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const getRootFilePath = (fileRoot: string, filePath: string) => {
    return path.join(`${process.cwd()}/${fileRoot}`, filePath);
};

export { createFolderIfNotExists, getRootFilePath };
