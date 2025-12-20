export const config = {
  api: { externalResolver: true },
};

import express from 'express';
import path from 'path';

const handler = express();

const mineducFolderPath = path.resolve('./uploads/dinnarp/mineduc');
const serveFiles = express.static(mineducFolderPath);
handler.use(['/api/public/files/dinarp/mineduc'], serveFiles);
handler.use((req, res) => {
  res.status(404).send('Not Found');
});

export default handler;
