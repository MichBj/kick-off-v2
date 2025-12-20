import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import ParameterData from '@database/base/parameter';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('parameter'))
  .use(database(ParameterData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(
        await prisma.parameter
          .select({ name: true, value: true, id: true })
          .where({
            AND: [{ key: { startsWith: request.query.key } }, { active: true }],
          })
          .getAll(),
      );
    });
  });

export default handler;
