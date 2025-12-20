import ObjectData from '@lib/database';
import schemas from '@database/base/rolemenu/schemas';

export const ESCAPE = ['Role', 'Menu'];

class RoleMenuData extends ObjectData {
  constructor() {
    const name = 'rolesOnMenus';
    const table = 'base_rolesOnMenus';
    super(name, table, schemas);
  }

  getRecordId = ({ roleId, menuId }) => {
    return { roleId, menuId };
  };
}

export default RoleMenuData;
