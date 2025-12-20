import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import UserData from '@database/base/user';
import schemas from '@database/base/user/schemas';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(database(UserData))
  .get((request) => {
    request.do(null, async (api, prisma) => {
      if (!request.user) return api.unauthorized();
      const user = await prisma.user
        .select(schemas.PUBLIC)
        .record(request.user.id)
        .getUnique();
      api.successOne(user);
    });
  });

export default handler;
