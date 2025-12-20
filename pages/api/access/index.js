import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import accessHelper from '@helper/access';
import AccessData, { ESCAPE } from '@database/base/access';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('access'))
  .use(database(AccessData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.access.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      const data = accessHelper.api.parseData(request.body);
      return api.success(await prisma.access.create(data));
    });
  });

export default handler;
