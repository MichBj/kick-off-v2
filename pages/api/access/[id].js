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
      return api.successOne(
        await prisma.access.record(request.query.id).getUnique(),
      );
    });
  })
  .use(parser.escape(ESCAPE))
  .put((request) => {
    request.do('write', async (api, prisma) => {
      const data = accessHelper.api.parseData(request.body);
      return api.success(
        await prisma.access.record(request.query.id).update(data),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(
        await prisma.access.record(request.query.id).update({ active: false }),
      );
    });
  });

export default handler;
