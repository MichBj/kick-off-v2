import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import schemas from '@database/base/menu/schemas';
import MenuData from '@database/base/menu';
import { treeFilter } from '@helper/api/menu';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('menu'))
  .use(database(MenuData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const where = {
        ...treeFilter(request),
        Menu: { code: request.query?.parent },
      };
      return api.successMany(
        await prisma.menu
          .select(schemas.TREE)
          .where(where)
          .orderBy({ priority: 'asc' })
          .getAll(),
      );
    });
  });

export default handler;
