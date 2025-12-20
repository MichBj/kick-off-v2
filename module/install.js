/* eslint-disable @next/next/no-assign-module-variable */
import audit from '@module/installers/audit.install';

const install = async (module) => {
  if (module.code === 'audit') await audit(module.id);
};

const module = { install };

export default module;
