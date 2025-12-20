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
  .put((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(
        await prisma.user.record(request.query.id).update({ active: true }),
      );
    });
  });

export default handler;
