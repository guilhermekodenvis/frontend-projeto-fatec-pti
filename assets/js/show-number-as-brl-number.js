export const showNumberAsBrlNumber = (number) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  });

  return formatter.format(number);
};
