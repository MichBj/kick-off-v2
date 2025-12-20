export const config = {
  api: { externalResolver: true },
};

import express from 'express';
const handler = express();

const serveFiles = express.static('./uploads');
handler.use(['/api/public/images'], serveFiles);

export default handler;
