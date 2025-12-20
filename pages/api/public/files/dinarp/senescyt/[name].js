export const config = {
  api: { externalResolver: true },
};

import express from 'express';
import path from 'path';

const handler = express();

const senescytFolderPath = path.resolve('./uploads/dinnarp/senescyt');
const serveFiles = express.static(senescytFolderPath);
handler.use(['/api/public/files/dinarp/senescyt'], serveFiles);
handler.use((req, res) => {
  res.status(404).send('Not Found');
});

export default handler;
