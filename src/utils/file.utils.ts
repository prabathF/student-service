import { extname } from 'path';

export const csvFileFilter = (req, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback('Only CSV files are allowed!', false);
  }
  callback(null, true);
};

export const csvFileName = (req, file: Express.Multer.File, cb) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  cb(null, `${randomName}${extname(file.originalname)}`);
};
