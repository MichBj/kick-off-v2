import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import RolesOnUsers from '@database/base/RolesOnUsers';
import RoleData from '@database/base/role';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(database(RolesOnUsers))
  .use(database(RoleData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const rol = {};
      const data = await prisma.rolesOnUsers
        .where({
          userId: request.user.id,
          active: true,
        })
        .getAll();
      data?.map(
        (item) =>
          (rol[item.Role?.code] = {
            code: item.Role?.code,
            name: item.Role?.name,
            id: item.roleId,
          }),
      );
      return api.successMany(rol);
    });
  });

export default handler;
