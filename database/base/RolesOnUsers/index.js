import ObjectData from '@lib/database';
import schemas from '@database/base/RolesOnUsers/schemas';

export const ESCAPE = ['Role', 'Menu'];

class RolesOnUsers extends ObjectData {
  constructor() {
    const name = 'rolesOnUsers';
    const table = 'base_rolesOnUsers';
    super(name, table, schemas);
  }

  getRecordId = ({ roleId, userId }) => {
    return { roleId, userId };
  };
}
export default RolesOnUsers;
