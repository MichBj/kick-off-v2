import crypto from 'crypto';

/** Crea un hash de un texto especificado
 * @param text Texto del cual obtener el hash
 * @param algorithm Algoritmo a utilizar para el hash (Opcional)
 */
const create = (text, algorithm) => {
  return crypto
    .createHash(algorithm || process.env.HASH_ALGORITHM)
    .update(`${process.env.PASSWORD_SECRET}${text}`, 'utf-8')
    .digest('hex');
};

export const hash = { create };
