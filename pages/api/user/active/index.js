import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import UserData from '@database/base/user';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const data = await prisma.user
        .select({ id: true })
        .where({
          id: request.user.id,
        })
        .getAll();
      return api.successMany(...data);
    });
  });

export default handler;
