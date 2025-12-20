import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import InstitutionIpData, { ESCAPE } from '@database/base/institution/ip';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('institutionip'))
  .use(database(InstitutionIpData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.institutionIp.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.institutionIp.create(request.body));
    });
  });

export default handler;
