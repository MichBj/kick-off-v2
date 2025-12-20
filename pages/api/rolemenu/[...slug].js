import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import RoleMenuData, { ESCAPE } from '@database/base/rolemenu';
import { toInteger } from 'lodash';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use((request, _, next) => {
    if (request.query.slug.length != 2) return request.api.unauthorized();
    next();
  })
  .use(access('rolemenu'))
  .use(database(RoleMenuData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      let [roleId, menuId] = request.query.slug;
      roleId = toInteger(roleId);
      menuId = toInteger(menuId);

      const getById = async () => {
        return api.successOne(
          await prisma.rolesOnMenus
            .where({ roleId_menuId: { roleId, menuId } })
            .getUnique(),
        );
      };

      const getByRole = async () => {
        return api.successMany(
          await prisma.rolesOnMenus.where({ roleId }).getAll(),
        );
      };

      const getByMenu = async () => {
        return api.successMany(
          await prisma.rolesOnMenus.where({ menuId }).getAll(),
        );
      };

      if (roleId == 'role') return getByMenu();
      if (menuId == 'menu') return getByRole();
      return getById();
    });
  })
  .use(parser.escape(ESCAPE))
  .put((request) => {
    request.do('write', async (api, prisma) => {
      const [roleId, menuId] = request.query.slug.map((item) =>
        toInteger(item),
      );
      await prisma.rolesOnMenus
        .where({ roleId_menuId: { roleId, menuId } })
        .update(request.body);
      return api.success();
    });
  });

export default handler;
