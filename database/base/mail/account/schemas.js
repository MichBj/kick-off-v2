const DEFAULT = {
  id: true,
  name: true,
  email: true,
  moduleId: true,
  mailServerId: true,
  active: true,
  Module: {
    select: {
      id: true,
      name: true,
    },
  },
  MailServer: {
    select: {
      id: true,
      name: true,
      smtp: true,
      port: true,
      email: true,
      password: true,
    },
  },
};

const schemas = { DEFAULT };

export default schemas;
