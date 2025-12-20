import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import MailAccountData from '@database/base/mail/account';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('mailAccount'))
  .use(database(MailAccountData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(await prisma.mailAccount.getAll());
    });
  })
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.mailAccount.create(request.body));
    });
  });

export default handler;
