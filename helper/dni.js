//import { toInteger, map, reduce } from 'lodash';
export const validateDni = (dni) => {
  if (!dni || dni.length !== 10 || isNaN(dni)) {
    return false;
  }
  const digits = dni.split('').map(Number);
  const checkDigit = digits.pop();
  const sum = digits.reverse().reduce((acc, digit, index) => {
    if (index % 2 === 0) {
      let doubled = digit * 2;
      acc += doubled > 9 ? doubled - 9 : doubled;
    } else {
      acc += digit;
    }
    return acc;
  }, 0);
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheckDigit;
};
