export const config = {
  api: { externalResolver: true },
};

import express from 'express';
import path from 'path';

const handler = express();

const cneFolderPath = path.resolve('./uploads/dinnarp/cne');
const serveFiles = express.static(cneFolderPath);
handler.use(['/api/public/files/dinarp/cne'], serveFiles);
handler.use((req, res) => {
  res.status(404).send('Not Found');
});

export default handler;
