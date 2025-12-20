import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import database from '@middleware/database';
import api from '@middleware/api';
import UserData from '@database/base/user';

const handler = nextConnect();

const hasUserRole = (roleCode) => async (prisma, request) => {
  return await prisma.user.record(request.user.id).hasRole({ code: roleCode });
};

handler
  .use(auth)
  .use(api)
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const data = {
        isAdmin: false,
        isEmployee: false,
        isTeacher: false,
        isDirectorHr: false,
        isCoordinatorHr: false,
        isAnalystHr: false,
        isChecker: false,
        isStudent: false,
        isTecnicalTeacher: false,
      };

      data.isAdmin = await hasUserRole('administrator')(prisma, request);
      data.isEmployee = await hasUserRole('employee')(prisma, request);
      data.isTeacher = await hasUserRole('teacher')(prisma, request);
      data.isDirectorHr = await hasUserRole('directorHr')(prisma, request);
      data.isCoordinatorHr = await hasUserRole('coordinatorHr')(
        prisma,
        request,
      );
      data.isAnalystHr = await hasUserRole('analystHr')(prisma, request);
      data.isChecker = await hasUserRole('checker')(prisma, request);
      data.isStudent = await hasUserRole('student')(prisma, request);
      data.isTecnicalTeacher = await hasUserRole('tecnicalTeacher')(
        prisma,
        request,
      );

      return api.successMany(data);
    });
  });

export default handler;
