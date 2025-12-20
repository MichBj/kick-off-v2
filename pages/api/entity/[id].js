import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import EntityData, { ESCAPE } from '@database/base/entity';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('entity'))
  .use(database(EntityData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.entity.record(request.query.id).getUnique(),
      );
    });
  })
  .use(parser.escape(ESCAPE))
  .put((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(
        await prisma.entity.record(request.query.id).update(request.body),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(
        await prisma.entity.record(request.query.id).update({ active: false }),
      );
    });
  });

export default handler;
