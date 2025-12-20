import nextConnect from 'next-connect';
import auth from '@middleware/auth';

const handler = nextConnect();

handler.use(auth).get((request, response) => {
  request.logOut();
  response.status(204).end();
});

export default handler;
