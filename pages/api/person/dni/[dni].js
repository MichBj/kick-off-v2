import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import PersonData from '@database/base/person';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('person'))
  .use(database(PersonData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.person.where({ dni: request.query.dni }).getUnique(),
      );
    });
  });

export default handler;
