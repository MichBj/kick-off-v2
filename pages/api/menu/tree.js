import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import MenuData from '@database/base/menu';
import schemas from '@database/base/menu/schemas';
import menuHelper from '@helper/menu';
import { treeFilter } from '@helper/api/menu';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(database(MenuData))
  .get((request) => {
    request.do(null, async (api, prisma) => {
      const where = treeFilter(request);
      const menus = await prisma.menu
        .where(where)
        .select(schemas.TREE)
        .orderBy([{ priority: 'asc' }])
        .getAll();
      return api.successOne(menuHelper.parseTree(menus));
    });
  });

export default handler;
