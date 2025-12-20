export const treeFilter = (request) => {
  const userId = request.user.id;
  if (userId === 1) return {};
  return {
    active: true,
    Module: { active: true },
    roles: {
      some: {
        active: true,
        Role: { users: { some: { active: true, userId } } },
      },
    },
  };
};
