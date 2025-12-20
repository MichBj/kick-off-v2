import ObjectData from '@lib/database';
import schemas from '@database/base/mail/server/schemas';

class mailServerData extends ObjectData {
  constructor() {
    const name = 'mailServer';
    const table = 'base_mailServer';
    super(name, table, schemas);
  }
}

export default mailServerData;
