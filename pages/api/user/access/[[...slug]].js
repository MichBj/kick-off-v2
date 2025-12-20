import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import AccessData from '@database/base/access';
import EntityData from '@database/base/entity';
import api from '@middleware/api';
import database from '@middleware/database';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(database(AccessData))
  .use(database(EntityData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const codes = request.query.slug;
      if (request.user.id === 1) {
        const access = {};
        const query = prisma.entity;
        if (codes) {
          if (codes.length === 1) {
            return api.successOne({
              read: true,
              create: true,
              write: true,
              remove: true,
            });
          }
          query.where({ code: { in: codes } });
        }
        const entities = await query.getAll();
        entities.map(
          (item) =>
            (access[item.code] = {
              read: true,
              create: true,
              write: true,
              remove: true,
            }),
        );
        if (entities.length === 1) {
          return api.successOne(access[codes]);
        }
        return api.successMany(access);
      }
      let query = prisma.access.user({ id: request.user.id });
      if (codes) query = query.entities(codes);
      let access = prisma.access.parseByEntityCode(await query.getAll());
      if (codes && codes.length === 1) {
        return api.successOne(access[codes[0]]);
      }
      return api.successMany(access);
    });
  });

export default handler;
