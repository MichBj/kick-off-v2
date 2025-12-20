import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import UserData, { ESCAPE } from '@database/base/user';
import PersonData from '@database/base/person';
import LdapData from '@database/base/ldap';
import LdapUserVarData from '@database/base/ldap/userVar';
import LdapOuData from '@database/base/ldap/ou';
import LdapGroupData from '@database/base/ldap/group';
import ParameterData from '@database/base/parameter';
import { pick } from 'lodash';
import { randomBytes } from 'crypto';
import {
  getLdap,
  checkDni,
  parseName,
  parseEmail,
  parseLdapGroups,
  parseRoles,
  parseLdapCreateData,
  createOnLdap,
} from '@helper/api/user';

/** Retorna un objeto con los datos transformados a los formatos requeridos por
 * la base de datos */
const parseData = (data, email, institutionId) => {
  const now = new Date();
  return {
    ...data,
    email,
    username: data.username?.toLowerCase(),
    displayName: data.displayName?.toUpperCase(),
    name: parseName(data.firstName, data.lastName),
    firstName: data.firstName?.toUpperCase(),
    lastName: data.lastName?.toUpperCase(),
    personalEmail: data.personalEmail?.toLowerCase(),
    password: randomBytes(20).toString('hex'),
    createdDate: now,
    modifiedDate: now,
    institutionId,
  };
};

/** Retorna un objeto con datos válidos para la tabla `person` */
const upsertPerson = async (prisma, data) => {
  return await prisma.person.where({ dni: data.dni }).upsert({
    ...pick(data, ['dni', 'mobile', 'name', 'firstName', 'lastName']),
    email: data.personalEmail,
  });
};

/** Retorna un objeto con datos válidos para la tabla `user` */
const upsertUser = async (prisma, data, person, email) => {
  return await prisma.user.create({
    ...pick(data, [
      'createdDate',
      'modifiedDate',
      'password',
      'institutionId',
      'email',
      'ldapOUId',
      'accountTypeId',
      'campusId',
    ]),
    username: email,
    ldapGroups: parseLdapGroups(data.ldapGroups),
    roles: parseRoles(data.roles),
    personId: person.id,
  });
};

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const db = prisma.user;
      const where = { institutionId: request.user.institutionId };
      if (request.user.id !== 1) where.NOT = { id: 1 };
      db.where(where);
      return api.successMany(await db.getAll());
    });
  })
  .use(database(PersonData))
  .use(database(LdapData))
  .use(database(LdapOuData))
  .use(database(LdapUserVarData))
  .use(database(ParameterData))
  .use(database(LdapGroupData))
  //#FIXME: fields as 'roles' can't be escaped, instead they always have to be overwritten
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do(
      'create',
      async (api, prisma) => {
        let data = request.body;
        const ldap = await getLdap(prisma, request.user.Institution.ldapId);
        const email = parseEmail(data.username, ldap.domain);
        checkDni(data.checkDni, data.dni);
        data = parseData(data, email, request.user.institutionId);
        const person = await upsertPerson(prisma, data);
        const user = await upsertUser(prisma, data, person, email);
        const ldapData = await parseLdapCreateData(prisma, ldap, data);
        await createOnLdap(ldap, ldapData);
        return api.success(user);
      },
      { transaction: true },
    );
  });

export default handler;
