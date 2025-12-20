import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import EntityData, { ESCAPE } from '@database/base/entity';
import { parseData } from '@helper/api/entity';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('entity'))
  .use(database(EntityData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.entity.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      const data = parseData(request.body);
      const response = await prisma.entity.create(data);
      return api.success(response);
    });
  });

export default handler;
