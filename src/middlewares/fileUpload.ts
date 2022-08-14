import multer from 'multer';
import { createFolderIfNotExists } from '../helpers/file';

const storage = (storageFolder: string) =>
    multer.diskStorage({
        destination: (_req, _file, cb) => {
            createFolderIfNotExists(storageFolder);
            cb(null, `${process.cwd()}/${storageFolder}`);
        },
        filename: (req, file, cb) => {
            const fileName = req.body.fileName
                ? `${new Date().getTime()}_${req.body.fileName}`
                : `${new Date().getTime()}_${file.originalname}`;
            req.body.fileName = fileName;
            cb(null, fileName);
        },
    });

const storageNotHaveDate = (storageFolder: string) =>
    multer.diskStorage({
        destination: (_req, _file, cb) => {
            createFolderIfNotExists(storageFolder);
            cb(null, `${process.cwd()}/${storageFolder}`);
        },
        filename: (req, file, cb) => {
            const fileName = file.originalname;
            cb(null, fileName);
        },
    });

export default {
    storage,
    storageNotHaveDate,
};
