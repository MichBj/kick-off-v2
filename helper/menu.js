const parseBranch = (menus, branch) => {
  if (branch.menus == []) return branch;
  let children = menus.filter((menu) =>
    branch.menus.map((val) => val.id).includes(menu.id),
  );
  return {
    ...branch,
    children: children.map((child) => parseBranch(menus, child)),
  };
};

const parseTree = (menus) => {
  const MainBranchs = menus.filter((menu) => !menu.menuId);
  return MainBranchs.map((branch) => parseBranch(menus, branch));
};

const menuHelper = {
  parseBranch,
  parseTree,
};

export default menuHelper;
