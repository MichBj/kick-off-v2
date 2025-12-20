import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import ParemeterData from '@database/base/parameter';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('parameter'))
  .use(database(ParemeterData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.parameter.record(request.query.id).getUnique(),
      );
    });
  })
  .put((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(
        await prisma.parameter.record(request.query.id).update(request.body),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(
        await prisma.parameter
          .record(request.query.id)
          .update({ active: false }),
      );
    });
  });

export default handler;
