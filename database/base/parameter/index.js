import ObjectData from '@lib/database';
import schemas from '@database/base/parameter/schemas';

class ParameterData extends ObjectData {
  constructor() {
    const name = 'parameter';
    const table = 'base_parameter';
    super(name, table, schemas);
  }
}

export default ParameterData;
