import nextConnect from 'next-connect';
import api from '@middleware/api';
import database from '@middleware/database';
import UserData from '@database/base/user';
import LdapData from '@database/base/ldap';
import schemas from '@database/base/ldap/schemas';
import { hash } from '@lib/hash';
import { ldap } from '@lib/ldap';
import { checkExpiration } from '@lib/tokens';

const handler = nextConnect();

const NOTOKEN_ERROR = 'Token inválido para realizar esta operación';

const getRecoverToken = (request) => {
  const token = request.query.token;
  if (!token) throw new Error(NOTOKEN_ERROR);
  return token;
};

const getUser = async (db, recoverToken) => {
  const user = await db.where({ recoverToken }).getFirst();
  if (!user) throw new Error(NOTOKEN_ERROR);
  return user;
};

handler
  .use(api)
  .use(database(UserData))
  .use(database(LdapData))
  .put((request) => {
    request.do(
      null,
      async (api, prisma) => {
        let data = request.body;
        const user = await getUser(prisma.user, getRecoverToken(request));
        prisma.user.setAudited(user);
        checkExpiration(user.recoverDate);
        // Update LDAP user password if not superuser
        if (user.id !== 1) {
          const params = await ldap.signinConfig(
            user.username,
            data.password,
            user.Institution.ldapId,
          );
          let ldapRecord = await prisma.ldap
            .select(schemas.SEARCHABLE_PASSWORD)
            .record(user.Institution.ldapId)
            .getUnique();
          const client = await ldap.checkBind(
            params.url,
            ldapRecord.username,
            ldapRecord.password,
          );
          await ldap.changePassword(
            client,
            params.baseDN,
            user.username,
            data.password,
            params.variables.email,
          );
        }
        // Update local user
        await prisma.user
          .clean()
          .record(user.id)
          .update({
            password: hash.create(data.password),
            recoverToken: '',
            recoverDate: null,
          });
        return api.success();
      },
      { transaction: true },
    );
  });

export default handler;
