import ObjectData from '@lib/database';
import schemas from '@database/courts/schemas';

class CourtsData extends ObjectData {
  constructor() {
    const name = 'courts';
    const table = 'courts';
    super(name, table, schemas);
  }
}

export default CourtsData;
