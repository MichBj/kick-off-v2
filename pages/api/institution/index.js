import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import InstitutionData, { ESCAPE } from '@database/base/institution';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('institution'))
  .use(database(InstitutionData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(
        await prisma.institution
          .where({ id: request.user.institutionId || undefined })
          .getAll(),
      );
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do(
      'create',
      async (api, prisma) => {
        const DEFAULT_IMAGE = null;
        request.body.logo =
          request.body.logo !== undefined ? request.body.logo : DEFAULT_IMAGE;
        request.body.isologo =
          request.body.isologo !== undefined
            ? request.body.isologo
            : DEFAULT_IMAGE;
        const record = await prisma.institution.create(request.body);
        return api.success(record);
      },
      { transaction: true },
    );
  });

export default handler;
