import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import RoleData, { ESCAPE } from '@database/base/role';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('role'))
  .use(database(RoleData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.role.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.role.create(request.body));
    });
  });

export default handler;
