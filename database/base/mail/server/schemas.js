const DEFAULT = {
  id: true,
  name: true,
  smtp: true,
  port: true,
  email: true,
  password: false,
  active: true,
};

const PUBLIC = {
  id: true,
  smtp: true,
  port: true,
  email: true,
  password: true,
  active: true,
};

const schemas = { DEFAULT, PUBLIC };

export default schemas;
