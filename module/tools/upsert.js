import PageData from '@database/base/page';
import MenuData from '@database/base/menu';
import RoleMenuData from '@database/base/rolemenu';
import AccessData from '@database/base/access';
import RoleData from '@database/base/role';
import EntityData from '@database/base/entity';

const _upsertByCode = async (db, data) => {
  return await db.where({ code: data.code }).upsert(data, {});
};

const _upsert = async (db, where, data) => {
  delete data.where;
  return await db.where(where).upsert(data, {});
};

const execute = async (db, data) => {
  const response = {};
  await Promise.all(
    data.map(async (item) => {
      if (item.where) await _upsert(db, item.where, item);
      else response[item.code] = await _upsertByCode(db, item);
    }),
  );
  return response;
};

const pages = async (data) => {
  const db = new PageData();
  return await execute(db, data);
};

const menus = async (data) => {
  const db = new MenuData();
  return await execute(db, data);
};

const roles = async (data) => {
  const db = new RoleData();
  return await execute(db, data);
};

const rolesOnMenus = async (data) => {
  const db = new RoleMenuData();
  return await execute(db, data);
};

const access = async (data) => {
  const db = new AccessData();
  return await execute(db, data);
};

const entities = async (data) => {
  const db = new EntityData();
  return await execute(db, data);
};

export const upsert = { pages, menus, roles, rolesOnMenus, access, entities };
