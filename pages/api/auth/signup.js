import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import { userHelper } from '@helper/user';

const handler = nextConnect();

handler.use(auth).post(async (request, response) => {
  try {
    const { dni, firstName, lastName, email, username, password, mobile } =
      request.body;

    if (!dni || !firstName || !lastName || !email || !username || !password) {
      return response
        .status(400)
        .json({ message: 'Todos los campos son requeridos' });
    }

    const name = `${firstName} ${lastName}`.toUpperCase();

    const userData = await userHelper.createUser({
      dni,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      mobile,
    });

    response.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: userData.user.id,
        username: userData.user.username,
        email: userData.user.email,
      },
    });
  } catch (error) {
    console.error('Error en signup:', error);
    response.status(500).json({
      message: error.message || 'Error al crear el usuario',
    });
  }
});

export default handler;
