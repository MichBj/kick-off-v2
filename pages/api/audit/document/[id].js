export const config = {
  api: {
    responseLimit: '15mb',
  },
};
import nextConnect from 'next-connect';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import DocumentData from '@database/audit/document';

const handler = nextConnect();

handler
  .use(api)
  .use(access('document'))
  .use(database(DocumentData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.document.record(request.query.id).getUnique(),
      );
    });
  })
  .put((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(
        await prisma.document.record(request.query.id).update(request.body),
      );
    });
  });

export default handler;
