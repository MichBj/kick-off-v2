import MenuData from '@database/base/menu';
import ModuleData from '@database/base/module';
import RoleData from '@database/base/role';
import { upsert } from '@module/tools/upsert';

const entities = async () => {
  const moduleData = new ModuleData();
  const auditModule = await moduleData.where({ code: 'audit' }).getUnique();
  const data = [
    {
      code: 'log',
      name: 'Logs de auditoría',
      moduleId: auditModule.id,
    },
  ];
  return await upsert.entities(data);
};

const pages = async (moduleId) => {
  const data = [
    {
      code: 'audit',
      name: 'Auditoría',
      url: '/audit/log',
      moduleId: moduleId,
    },
  ];
  return await upsert.pages(data);
};

const menus = async (moduleId, pages) => {
  const menuData = new MenuData();
  const administration = await menuData.where({ code: 'admhead' }).getUnique();
  const data = [
    {
      code: 'audit',
      name: 'Auditoría',
      icon: 'history',
      header: false,
      priority: 5,
      pageId: pages.audit.id,
      moduleId: moduleId,
      menuId: administration.id,
    },
  ];
  return await upsert.menus(data);
};

const roles = async (moduleId) => {
  const data = [
    {
      code: 'auditViewer',
      name: 'Ver auditoría',
      description: 'Visualizar logs de auditoría',
      moduleId: moduleId,
    },
  ];
  return await upsert.roles(data);
};

const parseRoleMenu = (roleId, menuId) => {
  return { where: { roleId_menuId: { roleId, menuId } }, roleId, menuId };
};

const rolesOnMenus = async (_roles, _menus) => {
  const roleData = new RoleData();
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();
  const data = [
    parseRoleMenu(_roles.auditViewer.id, _menus.audit.id),
    parseRoleMenu(administratorRole.id, _menus.audit.id),
  ];
  await upsert.rolesOnMenus(data);
};

const access = async (roles, entities) => {
  const roleData = new RoleData();
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();
  const data = [
    {
      code: 'auditViewerLog',
      entityId: entities.log.id,
      roleId: roles.auditViewer.id,
      read: true,
      create: false,
      write: false,
      remove: false,
    },
    {
      code: 'admLog',
      entityId: entities.log.id,
      roleId: administratorRole.id,
      read: true,
      create: false,
      write: false,
      remove: false,
    },
  ];
  await upsert.access(data);
};

const installer = async (moduleId) => {
  const _entities = await entities();
  const _pages = await pages(moduleId);
  const _menus = await menus(moduleId, _pages);
  const _roles = await roles(moduleId);
  await access(_roles, _entities);
  await rolesOnMenus(_roles, _menus);
};

export default installer;
