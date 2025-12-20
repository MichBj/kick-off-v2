import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import PersonData from '@database/base/person';
import UserData from '@database/base/user';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('person'))
  .use(database(PersonData))
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const user = await prisma.user
        .where({
          institutionId: request.user.institutionId,
          Person: { dni: request.query.dni },
        })
        .getFirst();
      if (user)
        return api.failure(
          `Ya existe un usuario con el número de identificación ${request.query.dni} en la institución ${user.Institution?.name}`,
        );
      return api.successOne(
        await prisma.person.where({ dni: request.query.dni }).getUnique(),
      );
    });
  });

export default handler;
