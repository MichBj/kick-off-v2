import nextConnect from 'next-connect';
import api from '@middleware/api';
import database from '@middleware/database';
import UserData from '@database/base/user';
import schemas from '@database/base/user/schemas';
import { userHelper } from '@helper/user';
import InstitutionData from '@database/base/institution';

const handler = nextConnect();

handler
  .use(api)
  .use(database(UserData))
  .use(database(InstitutionData))
  .post((request) => {
    request.do(
      null,
      async (api, prisma) => {
        const user = await prisma.user
          .select(schemas.RECOVER_EMAIL)
          .where({ email: request.query.email })
          .getUnique();
        prisma.user.setAudited(user);
        let personalEmail = user.Person?.email || user.email;
        let userEmail = user.email === personalEmail ? undefined : user.email;
        const name = user.Person?.name || user.username;
        if (user.id === 1) {
          personalEmail = process.env.ADMIN_RECOVER_MAIL;
          userEmail = undefined;
          if (!personalEmail)
            throw new Error(
              'No es posible identificar el correo de recuperación',
            );
        }
        await userHelper.createRecoverToken(
          prisma,
          user.id,
          personalEmail,
          userEmail,
          name,
          user.username,
        );
        const slice = personalEmail.slice(personalEmail.indexOf('@') - 3);
        return api.successOne({ message: `**********${slice}` });
      },
      { transaction: false },
    );
  });

export default handler;
