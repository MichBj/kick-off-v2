import ObjectData from '@lib/database';
import schemas from '@database/base/module/schemas';
import module from '@module/install';

class ModuleData extends ObjectData {
  constructor() {
    const name = 'module';
    const table = 'base_module';
    super(name, table, schemas);
  }

  install = async () => {
    await module.install(await this.getUnique());
  };
}

export default ModuleData;
