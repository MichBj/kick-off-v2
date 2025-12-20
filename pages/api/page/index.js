import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import PageData, { ESCAPE } from '@database/base/page';
import pageHelper from '@helper/page';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('page'))
  .use(database(PageData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.page.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      const data = pageHelper.api.parseData(request.body);
      return api.success(await prisma.page.create(data));
    });
  });

export default handler;
