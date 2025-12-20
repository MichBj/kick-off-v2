export const config = {
  api: { externalResolver: true },
};

import express from 'express';
import path from 'path';

const handler = express();

const demograficoFolderPath = path.resolve('./uploads/dinnarp/demografico');
const serveFiles = express.static(demograficoFolderPath);
handler.use(['/api/public/files/dinarp/demografico'], serveFiles);
handler.use((req, res) => {
  res.status(404).send('Not Found');
});

export default handler;
