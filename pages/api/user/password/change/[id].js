import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import UserData from '@database/base/user';
import LdapData from '@database/base/ldap';
import schemas from '@database/base/ldap/schemas';
import { ldap } from '@lib/ldap';
import { hash } from '@lib/hash';

const handler = nextConnect();

const BIND_ERROR = 'Su contraseña actual no es correcta';

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(UserData))
  .use(database(LdapData))
  .put((request) => {
    request.do(
      null,
      async (api, prisma) => {
        const data = request.body;
        const user = await prisma.user.record(request.query.id).getUnique();
        const params = await ldap.signinConfig(
          user.username,
          data.current,
          user.Institution.ldapId,
        );
        // Update LDAP user password if not superuser
        if (request.user.id !== 1) {
          await ldap.checkBind(
            params.url,
            user.username,
            data.current,
            BIND_ERROR,
          );
          let domain = await prisma.ldap
            .select(schemas.SEARCHABLE_PASSWORD)
            .record(user.Institution.ldapId)
            .getUnique();
          const client = await ldap.checkBind(
            params.url,
            domain.username,
            domain.password,
          );
          await ldap.changePassword(
            client,
            params.baseDN,
            user.username,
            data.password,
            params.variables.email,
          );
        }
        // Update local user password
        await prisma.user
          .clean()
          .record(request.query.id)
          .update({ password: hash.create(data.password) });
        return api.success();
      },
      { transaction: true },
    );
  });

export default handler;
