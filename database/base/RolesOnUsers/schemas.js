const DEFAULT = {
  roleId: true,
  userId: true,
  active: true,
  Role: {
    select: {
      code: true,
      name: true,
    },
  },
};

const schemas = { DEFAULT };

export default schemas;
