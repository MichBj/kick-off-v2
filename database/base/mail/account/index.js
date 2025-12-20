import ObjectData from '@lib/database';
import schemas from '@database/base/mail/account/schemas';

export const ESCAPE = ['Module', 'MailServer'];

class MailAccountData extends ObjectData {
  constructor() {
    const name = 'mailAccount';
    const table = 'base_mailAccount';
    super(name, table, schemas);
  }
}

export default MailAccountData;
