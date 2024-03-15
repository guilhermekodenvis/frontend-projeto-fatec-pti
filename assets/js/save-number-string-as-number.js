export const saveNumberStringAsNumber = (numberString) => {
  return Number(numberString.replace(",", "."));
};
