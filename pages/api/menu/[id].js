import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import MenuData, { ESCAPE } from '@database/base/menu';
import { toInteger } from 'lodash';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('menu'))
  .use(database(MenuData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.menu.record(request.query.id).getUnique(),
      );
    });
  })
  .use(parser.escape(ESCAPE))
  .put((request) => {
    request.do('write', async (api, prisma) => {
      if (request.query.id === toInteger(request.body.menuId))
        throw new Error('El registro no puede ser su propio padre');
      return api.success(
        await prisma.menu.record(request.query.id).update(request.body),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(
        await prisma.menu.record(request.query.id).update({ active: false }),
      );
    });
  });

export default handler;
