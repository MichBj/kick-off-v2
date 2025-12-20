import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import MailServerData from '@database/base/mail/server';
import { smtpSever } from '@lib/mail/server';

const handler = nextConnect();

const CREDENTIALS_ERROR = 'Los parametros de conexión no son correctos';

handler
  .use(auth)
  .use(api)
  .use(access('mailServer'))
  .use(database(MailServerData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.mailServer.getAll());
    });
  })
  .post((request) => {
    request.do('create', async (api, prisma) => {
      const data = request.body;
      await smtpSever.checkMailServer(data, CREDENTIALS_ERROR);
      return api.success(await prisma.mailServer.create(data));
    });
  });

export default handler;
