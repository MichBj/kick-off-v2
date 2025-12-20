import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import LdapData from '@database/base/ldap';
import InstitutionData from '@database/base/institution';
import { ldap } from '@lib/ldap';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(LdapData))
  .use(database(InstitutionData))
  .get((request) => {
    request.do(
      'read',
      async (api) => {
        const slug = request.query.slug;
        if (slug.length > 2) return api.unauthorized();
        let [dni, mail] = slug;
        const institutionId = request.user.institutionId;
        if (!dni) return api.successOne({});
        const params = await ldap.institutionConfig(institutionId);
        const client = ldap.client(params.url);
        try {
          await ldap.bind(client, params.username, params.password);
        } catch (error) {
          return api.failure({
            message: 'No es posible conectar al servidor LDAP',
          });
        }
        params.attributes.push(
          'memberOf',
          'distinguishedName',
          'userAccountControl',
        );
        const remoteData = await ldap.searchDisabledUserBy(
          client,
          params.variables.dni,
          dni,
          params.variables.email,
          mail,
          params.baseDN,
          params.attributes,
          params.variables,
        );
        if (!remoteData?.ldapUser)
          return api.failure('No se encuentra al usuario');

        const accountStateCode = remoteData.userAccountControl;
        return api.success({ userAccountControl: accountStateCode });
      },
      { transaction: true },
    );
  });

export default handler;
