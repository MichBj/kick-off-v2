import ObjectData from '@lib/database';
import schemas from '@database/base/local/var/schemas';

class LocalUserVarData extends ObjectData {
  constructor() {
    const name = 'localUserVar';
    const table = 'base_localUserVar';
    super(name, table, schemas);
  }
}
export default LocalUserVarData;
