const DEFAULT = {
  id: true,
  code: true,
  name: true,
  description: true,
  moduleId: true,
  active: true,
  Module: {
    select: {
      id: true,
      name: true,
    },
  },
  access: {
    select: {
      id: true,
      read: true,
      create: true,
      write: true,
      remove: true,
      active: true,
      Entity: {
        select: {
          name: true,
        },
      },
    },
  },
  users: {
    select: {
      active: true,
      User: {
        select: {
          id: true,
          Person: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
  menus: {
    select: {
      active: true,
      Menu: {
        select: {
          id: true,
          name: true,
          Page: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  },
};
const ROLES = {
  id: true,
  code: true,
  name: true,
  active: true,
};
const schemas = { DEFAULT, ROLES };

export default schemas;
