import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import MenuData from '@database/base/menu';
import RoleData from '@database/base/role';
import PageData from '@database/base/page';
import ModuleData from '@database/base/module';
import { toInteger } from 'lodash';

const handler = nextConnect();

const LISTS = ['pages', 'roles', 'menus', 'install'];

handler
  .use(auth)
  .use(api)
  .use(async (request, _, next) => {
    await request.do(null, async (api) => {
      const slug = request.query.slug;
      if (slug.length > 2) return api.unauthorized();
      let [id, list] = slug;
      if (!LISTS.includes(list)) return api.unauthorized();
      request.query.id = toInteger(id);
      api.list = list;
    });
    next();
  })
  // FIXME: access and database middlewares should be used only for their respectives requests
  // FIXME: Read should be controlled by each module
  .use(access('module'))
  .use(database(PageData))
  .use(database(RoleData))
  .use(database(MenuData))
  // ---------------------------------------------------------------------------------------
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const where = { moduleId: request.query.id };
      if (api.list === 'pages')
        return api.successMany(await prisma.page.where(where).getAll());
      if (api.list === 'roles')
        return api.successMany(await prisma.role.where(where).getAll());
      if (api.list === 'menus')
        return api.successMany(await prisma.menu.where(where).getAll());
      return api.failure('Petición inválida');
    });
  })
  .use(database(ModuleData))
  .put((request) => {
    request.do(
      'write',
      async (api, prisma) => {
        await prisma.module.record(request.query.id).install();
        await prisma.module
          .record(request.query.id)
          .update({ installed: true, active: true });
        return api.success();
      },
      { transaction: true },
    );
  });

export default handler;
