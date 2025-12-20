import ObjectData from '@lib/database';
import schemas from '@database/base/role/schemas';

export const ESCAPE = ['Module'];

class RoleData extends ObjectData {
  constructor() {
    const name = 'role';
    const table = 'base_role';
    super(name, table, schemas);
  }
}

export default RoleData;
