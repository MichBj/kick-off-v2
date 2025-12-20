import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import UserData from '@database/base/user';

const handler = nextConnect();

const select = () => {
  return {
    Institution: {
      select: {
        name: true,
        campus: { select: { id: true, name: true, active: true } },
        Ldap: { select: { domain: true } },
      },
    },
  };
};

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const user = await prisma.user
        .select(select())
        .record(request.user.id)
        .getUnique();
      return api.successOne(user?.Institution);
    });
  });

export default handler;
