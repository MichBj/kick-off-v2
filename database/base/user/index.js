import ObjectData from '@lib/database';
import schemas from '@database/base/user/schemas';

export const ESCAPE = ['Person', 'Parameter', 'Job', 'AccountType'];

class UserData extends ObjectData {
  constructor() {
    const name = 'user';
    const table = 'base_user';
    super(name, table, schemas);
  }

  hasRole = async ({ id, code }) => {
    let role = {};
    if (id) role.id = id;
    if (code) role.code = code;
    const response = await this.where({
      ...this._where,
      roles: { some: { active: true, Role: role } },
    }).getFirst();
    return !!response;
  };
}

export default UserData;
