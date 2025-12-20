import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import UserData from '@database/base/user';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      if (request.user.id !== request.query.id)
        return api.unauthorized(
          'No tiene permitido el acceso a este contenido',
        );
      const user = await prisma.user
        .select({ Person: { select: { photo: true } } })
        .record(request.query.id)
        .getUnique();
      return api.successOne({ photo: user?.Person?.photo });
    });
  });

export default handler;
