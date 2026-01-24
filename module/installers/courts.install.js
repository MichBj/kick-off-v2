import ModuleData from '@database/base/module';
import RoleData from '@database/base/role';
import { upsert } from '@module/tools/upsert';

const entities = async () => {
  const moduleData = new ModuleData();
  const courtsModule = await moduleData.where({ code: 'courts' }).getUnique();
  const data = [
    {
      code: 'court',
      name: 'Canchas',
      moduleId: courtsModule.id,
    },
    {
      code: 'courtSchedule',
      name: 'Horarios de Canchas',
      moduleId: courtsModule.id,
    },
  ];
  return await upsert.entities(data);
};

const pages = async (moduleId) => {
  const data = [
    {
      code: 'court',
      name: 'Canchas',
      url: '/courts/court',
      moduleId: moduleId,
    },
    {
      code: 'courtSchedule',
      name: 'Horarios de Canchas',
      url: '/courts/config/schedule',
      moduleId: moduleId,
    },
    {
      code: 'courtsconfig',
      name: 'Configuración Canchas Deportivas',
      url: '/courts/configuration',
      moduleId: moduleId,
    },
  ];
  return await upsert.pages(data);
};

const menus = async (moduleId, pages) => {
  let data = [
    {
      code: 'courtshead',
      name: 'Canchas Deportivas',
      icon: null,
      header: true,
      priority: 5,
      moduleId: moduleId,
    },
  ];
  const header = await upsert.menus(data);
  data = [
    {
      code: 'court',
      name: 'Canchas',
      icon: 'sports_soccer',
      priority: 15,
      pageId: pages.court.id,
      moduleId: moduleId,
      menuId: header.courtshead.id,
    },
    {
      code: 'courtsconfig',
      name: 'Configuración Canchas Deportivas',
      displayName: 'Configuración',
      icon: 'settings',
      priority: 900,
      pageId: pages.courtsconfig.id,
      dashboard: true,
      moduleId: moduleId,
      menuId: header.courtshead.id,
    },
  ];
  const configuration = await upsert.menus(data);
  data = [
    {
      code: 'courtSchedule',
      name: 'Horarios de Canchas',
      description:
        'Parametrización de los horarios disponibles para las canchas deportivas',
      icon: 'apartment',
      header: false,
      priority: 5,
      pageId: pages.courtSchedule.id,
      moduleId: moduleId,
      menuId: configuration.courtsconfig.id,
    },
  ];
  const _menus = await upsert.menus(data);
  return { ...header, ...configuration, ..._menus };
};

const roles = async (moduleId) => {
  const data = [
    {
      code: 'courtManager',
      name: 'Gestor de Canchas Deportivas',
      description: 'Gestionar canchas deportivas y sus horarios',
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
  const data = [parseRoleMenu(_roles.courtManager.id, _menus.courtshead.id)];
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();
  Object.entries(_menus).map(([_, menu]) => {
    data.push(parseRoleMenu(administratorRole.id, menu.id));
  });
  await upsert.rolesOnMenus(data);
};

const access = async (_roles, _entities) => {
  const roleData = new RoleData();
  const administratorRole = await roleData
    .where({ code: 'administrator' })
    .getUnique();

  Object.entries(_entities).map(([_, entity]) => {
    data.push({
      code: `adm${capitalize(entity.code)}`,
      entityId: entity.id,
      roleId: administratorRole.id,
      read: true,
      create: true,
      write: true,
      remove: true,
    });
  });
  await upsert.access(data);
};

const installer = async (moduleId) => {
  try {
    const _entities = await entities();
    const _pages = await pages(moduleId);
    const _menus = await menus(moduleId, _pages);
    const _roles = await roles(moduleId);
    await rolesOnMenus(_roles, _menus);
    await access(_roles, _entities);
    console.log('Courts module installed successfully');
  } catch (error) {
    console.log('Error installing Courts module:', error);
  }
};

export default installer;
