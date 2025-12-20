import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import AccessData from '@database/base/access';
import { toInteger } from 'lodash';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('access'))
  .use(database(AccessData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const slug = request.query.slug;
      if (slug.length > 2) return api.unauthorized();
      let [id, list] = slug;
      if (list !== 'access') return api.successMany([]);
      return api.successMany(
        await prisma.access.where({ roleId: toInteger(id) }).getAll(),
      );
    });
  });

export default handler;
