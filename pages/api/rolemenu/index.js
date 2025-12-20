import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import RoleMenuData, { ESCAPE } from '@database/base/rolemenu';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('rolemenu'))
  .use(database(RoleMenuData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.rolesOnMenus.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.rolesOnMenus.create(request.body));
    });
  });

export default handler;
