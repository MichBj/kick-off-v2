import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import LogData from '@database/audit/log';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('log'))
  .use(database(LogData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.log.getAll());
    });
  });

export default handler;
