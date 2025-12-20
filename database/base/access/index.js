import ObjectData from '@lib/database';
import schemas from '@database/base/access/schemas';

export const ESCAPE = ['Entity', 'Role'];

class AccessData extends ObjectData {
  constructor() {
    const name = 'access';
    const table = 'base_access';
    super(name, table, schemas);
  }

  // Parsers

  parseByEntityCode = (access) => {
    let data = {};
    access.map((record) => {
      const item = data[record.Entity.code];
      const code = record.Entity.code;
      delete record.Entity;
      data[code] = {
        read: item?.read || record.read,
        create: item?.create || record.create,
        write: item?.write || record.write,
        remove: item?.remove || record.remove,
      };
    });
    return data;
  };

  // Parameters

  user = (_user) => {
    this._user = _user;
    return this;
  };

  entities = (_entities) => {
    this._entities = _entities;
    return this;
  };

  // Override

  getAll = async () => {
    if (this._user?.id) return await this.#getByUser();
    return super.getAll();
  };

  // New Methods

  #getByUser = async () => {
    let where = {
      Role: { users: { some: { userId: this._user.id, active: true } } },
      Entity: { Module: { active: true } },
    };
    // FIXME: in only works if all entries exists
    if (this._entities) where.Entity.code = { in: this._entities };
    return await this.table.findMany({
      where,
      select: {
        read: true,
        create: true,
        write: true,
        remove: true,
        Entity: { select: { code: true } },
      },
    });
  };
}

export default AccessData;
