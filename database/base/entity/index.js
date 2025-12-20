import ObjectData from '@lib/database';
import schemas from '@database/base/entity/schemas';

export const ESCAPE = ['Module'];

class EntityData extends ObjectData {
  constructor() {
    const name = 'entity';
    const table = 'base_entity';
    super(name, table, schemas);
  }
}

export default EntityData;
