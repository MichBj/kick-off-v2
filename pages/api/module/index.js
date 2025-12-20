import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import ModuleData from '@database/base/module';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('module'))
  .use(database(ModuleData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(
        await prisma.module.orderBy({ id: 'asc' }).getAll(),
      );
    });
  });

export default handler;
