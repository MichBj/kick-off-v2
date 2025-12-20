import ObjectData from '@lib/database';
import schemas from '@database/audit/log/schemas';

export const ESCAPE = ['User'];

class LogData extends ObjectData {
  constructor() {
    const name = 'log';
    const table = 'audit_log';
    super(name, table, schemas);
  }
}

export default LogData;
