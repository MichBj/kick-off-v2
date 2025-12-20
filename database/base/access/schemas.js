const DEFAULT = {
  id: true,
  read: true,
  create: true,
  write: true,
  remove: true,
  entityId: true,
  Entity: {
    select: {
      id: true,
      name: true,
    },
  },
  Role: {
    select: {
      id: true,
      name: true,
    },
  },
};

const schemas = { DEFAULT };

export default schemas;
