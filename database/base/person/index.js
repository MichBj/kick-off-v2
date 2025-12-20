import ObjectData from '@lib/database';
import schemas from '@database/base/person/schemas';

class PersonData extends ObjectData {
  constructor() {
    const name = 'person';
    const table = 'base_person';
    super(name, table, schemas);
  }
}

export default PersonData;
