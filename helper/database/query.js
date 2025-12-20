import { uniq } from 'lodash';

const M2M_UPDATE_CONTROL = {
  update: false,
  reactivate: true,
  deactivate: true,
};

/** Retorna un objeto válido para registrar una lista en un campo Many2Many de prisma.
 * @param field Nombre del campo de la tabla a validar.
 * @param modified Lista de identificadores de los objetos relacionados a actualizar.
 * @param control Parámetros de configuración:
 *  - `update`: Indicar si se requieren actualizar registros ya existentes.
 *  - `reactivate`: Por defecto `true`. Indica si se deben reactivar los registros concidentes desactivados.
 *  - `deactivate`: Por defecto `true`. Indica si se deben desactivar los registros coincidentes activados
 */
export const parseMany2many = (
  field,
  modified,
  control = { update: false, reactivate: true, deactivate: true },
) => {
  control = { ...M2M_UPDATE_CONTROL, ...control };
  modified = uniq(modified);
  const query = {
    createMany: {
      data: modified.map((item) => ({ [field]: item })),
      skipDuplicates: true,
    },
  };
  if (control?.update) {
    query.updateMany = [];
    if (control?.reactivate)
      query.updateMany.push({
        where: { [field]: { in: modified }, active: false },
        data: { active: true },
      });
    if (control?.deactivate)
      query.updateMany.push({
        where: { NOT: { [field]: { in: modified }, active: true } },
        data: { active: false },
      });
  }
  return query;
};

// If field exists in modified and active is false => Set active as true
