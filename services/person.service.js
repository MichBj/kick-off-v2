import { httpRequest } from '@lib/httpRequest';

const getByDni = (dni) => {
  return httpRequest.get(`/api/person/dni/${dni}`);
};

const updatePhoto = (id, photo) => {
  return httpRequest.put(`/api/person/photo/${id}`, { photo });
};

export const personService = {
  getByDni,
  updatePhoto,
};
