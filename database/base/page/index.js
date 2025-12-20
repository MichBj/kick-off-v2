import ObjectData from '@lib/database';
import schemas from '@database/base/page/schemas';

export const ESCAPE = ['Module'];

class PageData extends ObjectData {
  constructor() {
    const name = 'page';
    const table = 'base_page';
    super(name, table, schemas);
  }
}

export default PageData;
