export const config = {
  api: {
    responseLimit: '250mb',
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
      return api.successMany(
        await prisma.document.orderBy({ updatedAt: 'desc' }).getAll(),
      );
    });
  })
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.document.create(request.body));
    });
  });

export default handler;
