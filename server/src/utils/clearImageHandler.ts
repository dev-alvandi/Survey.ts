import fs from 'fs';
import path from 'path';

export const clearImage = (filePath: string) => {
  const fileAddress = filePath;
  fs.unlink(fileAddress, (err) => {
    if (err) {
      console.log('File is not deleted!', err);
    }
  });
};
