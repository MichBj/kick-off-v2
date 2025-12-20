import nextConnect from 'next-connect';
import api from '@middleware/api';
import database from '@middleware/database';
import UserData from '@database/base/user';
import schemas from '@database/base/user/schemas';
import { checkExpiration } from '@lib/tokens';

const handler = nextConnect();

const NOTOKEN_ERROR = 'Token inválido para realizar esta operación';
const INACTIVE_ERROR = 'El usuario se encuentra desactivado';

const getRecoverToken = (request) => {
  const token = request.query.token;
  if (!token) throw new Error(NOTOKEN_ERROR);
  return token;
};

const getUser = async (db, token) => {
  const user = await db
    .select(schemas.PUBLICRECOVERTOKEN)
    .where({ recoverToken: token })
    .getFirst(); //FIXME: should be unique?
  if (!user) throw new Error(NOTOKEN_ERROR);
  if (!user.active) throw new Error(INACTIVE_ERROR);
  return user;
};

handler
  .use(api)
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const user = await getUser(prisma.user, getRecoverToken(request));
      checkExpiration(user.recoverDate);
      return api.successOne(user);
    });
  });

export default handler;
