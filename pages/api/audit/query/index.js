import nextConnect from 'next-connect';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import LogQueryData from '@database/audit/query';

const handler = nextConnect();

handler
  .use(api)
  .use(access('query'))
  .use(database(LogQueryData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.query.getAll());
    });
  })
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.query.create(request.body));
    });
  });

export default handler;
