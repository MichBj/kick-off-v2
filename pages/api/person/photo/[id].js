import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import PersonData from '@database/base/person';
import UserData from '@database/base/user';

const handler = nextConnect();

const hasUserRole = (roleCode) => async (prisma, request) => {
  return await prisma.user.record(request.user.id).hasRole({ code: roleCode });
};

handler
  .use(auth)
  .use(api)
  .use(database(PersonData))
  .use(database(UserData))
  .put((request) => {
    request.do('write', async (api, prisma) => {
      const isAdmin = await hasUserRole('administrator')(prisma, request);
      const isAnalystHr = await hasUserRole('analystHr')(prisma, request);
      const isDirectorHr = await hasUserRole('directorHr')(prisma, request);
      const isCoordinatorHr = await hasUserRole('coordinatorHr')(
        prisma,
        request,
      );
      const admin = request.user?.username;
      if (
        isAdmin ||
        isAnalystHr ||
        isDirectorHr ||
        isCoordinatorHr ||
        admin === 'admin'
      ) {
        // El usuario tiene un rol que le permite hacer cambios a cualquier usuario,
        // así que no necesitamos comprobar el request.user.Person.id !== request.query.id.
        return api.successOne(
          await prisma.person
            .select({ id: true, photo: true })
            .record(request.query.id)
            .update({ photo: request.body.photo }),
        );
      } else {
        // El usuario no tiene un rol que le permita hacer cambios a cualquier usuario,
        // así que comprobamos el request.user.Person.id !== request.query.id.
        if (request.user.Person.id !== request.query.id) {
          return api.failure('No tiene permitida esta acción');
        } else {
          return api.successOne(
            await prisma.person
              .select({ id: true, photo: true })
              .record(request.query.id)
              .update({ photo: request.body.photo }),
          );
        }
      }
    });
  });

export default handler;
