export const convertToNumber = (formValue: string) => {
  const value = formValue.replace(/\D/g, "");

  return value === "" ? undefined : Number(value);
};

/** Разрешает вводить только числа, если значение больше чем 2^53 - 1,
 *  то возвращает Number.MAX_SAFE_INTEGER если меньше чем -(2^53 - 1), то
 *  Number.MIN_SAFE_INTEGER
 */
export const convertToSaveNumber = (formValue: string) => {
  const isIntegerValue = /^-?\d*$/.test(formValue);
  const parseValue = parseInt(formValue, 10);
  const isNaNValue = Number.isNaN(parseValue);

  if (!isIntegerValue && isNaNValue) {
    return "";
  }

  if (parseValue > Number.MAX_SAFE_INTEGER) {
    return Number.MAX_SAFE_INTEGER;
  } else if (parseValue < Number.MIN_SAFE_INTEGER) {
    return Number.MIN_SAFE_INTEGER;
  }

  if (isIntegerValue && parseValue) {
    return parseValue;
  }

  return isIntegerValue ? formValue : parseValue;
};

export const convertToVersion = (formValue: string) => {
  const value = formValue.replace(/[^\d.]/gi, "");

  return value;
};

export const convertToFloat = (formValue: string) => {
  const value = formValue.replace(/[^\d.]/gi, "");

  const splittedValue = value.split(".");

  let convertedValue = splittedValue[0] ? splittedValue[0] : "";

  if (splittedValue[1] || splittedValue[1] === "") {
    convertedValue = convertedValue.concat(".", splittedValue[1]);
  }

  return convertedValue;
};

export const convertToMinutes = (formValue: string) => {
  const value = formValue.replace(/\D/g, "");

  return value === "" ? undefined : Number(value) > 59 ? 59 : Number(value);
};

export const parsePhoneNumber = (formValue: string) => {
  const value = formValue.replace(/[^\+\d]*/g, "");

  if (value.length) {
    return value[0] + value.substr(1).replace("+", "");
  }

  return value;
};

/** Конвертирует в значение без пробелов */
export const convertToNotWhitespace = (formValue: string) => formValue.replace(/\s/g, "");

export const convertToMaxLengthValue = (maxLength: number) => (formValue: string) => {
  return formValue.length > maxLength ? formValue.slice(0, maxLength) : formValue;
};
