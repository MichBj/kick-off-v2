/** Retorna el resultado de comprar dos objetos A y B, estableciendo con `add`
 * los que existen A y no en B, y con `delete` los que existan en A y en B  */
const compareObject = async (newData, lastData) => {
  let data = [];
  if (JSON.stringify(newData) === JSON.stringify(lastData)) {
  } else {
    newData.map((value) => {
      const item = lastData.find((group) => group.name == value.name);
      if (!item) {
        data.push({ ...value, operation: 'add' });
      }
    });
    lastData.map((value) => {
      const item = newData.find((group) => group.name == value.name);
      if (!item) {
        data.push({ ...value, operation: 'delete' });
      }
    });
  }
  return data;
};

export const helper = { compareObject };
