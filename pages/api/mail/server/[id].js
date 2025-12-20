import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import mailServerData from '@database/base/mail/server';
import { smtpSever } from '@lib/mail/server';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('mailServer'))
  .use(database(mailServerData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.mailServer.record(request.query.id).getUnique(),
      );
    });
  })
  .put((request) => {
    request.do('write', async (api, prisma) => {
      const aux = request.body;
      const mail = await prisma.mailServer.record(request.query.id).getUnique();
      const data = {
        name: mail?.name !== aux?.name ? mail?.name : aux?.name,
        smtp: mail?.smtp !== aux?.smtp ? mail?.smtp : aux?.smtp,
        port: mail?.port !== aux?.port ? mail?.port : aux?.port,
        email: mail?.email !== aux?.email ? mail?.email : aux?.email,
        active: true,
        ...aux,
      };
      await smtpSever.checkMailServer(
        data,
        'Los parametros de conexión no son correctos',
      );
      return api.success(
        await prisma.mailServer.record(request.query.id).update(data),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(
        await prisma.mailServer
          .record(request.query.id)
          .update({ active: false }),
      );
    });
  });

export default handler;
