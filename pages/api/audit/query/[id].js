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
      return api.successOne(
        await prisma.query.record(request.query.id).getUnique(),
      );
    });
  })
  .put((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(
        await prisma.query.record(request.query.id).update(request.body),
      );
    });
  });

export default handler;
