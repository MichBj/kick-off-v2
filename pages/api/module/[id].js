import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import ModuleData from '@database/base/module';

const handler = nextConnect();

const checkOnlyActive = (body) => {
  if (Object.entries(body || {}).length != 1 || !body.active)
    throw new Error('Parámetros incorrectos');
};

handler
  .use(auth)
  .use(api)
  .use(access('module'))
  .use(database(ModuleData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(
        await prisma.module.record(request.query.id).getUnique(),
      );
    });
  })
  .put((request) => {
    request.do('write', async (api, prisma) => {
      checkOnlyActive(request.body);
      return api.success(
        await prisma.module.record(request.query.id).update(request.body),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      const modules = await prisma.module.record(request.query.id).getUnique();
      if (modules.code === 'base') return api.unauthorized();
      return api.success(
        await prisma.module.record(request.query.id).update({ active: false }),
      );
    });
  });

export default handler;
