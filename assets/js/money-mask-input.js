export const moneyMaskInput = (event) => {
  const { value } = event.target;
  const moneyNumber = value
    .replace(".", "")
    .replace(",", "")
    .replace(/\D/g, "");

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(moneyNumber) / 100
  );

  if (result === "NaN") {
    event.target.value = "R$ 0,00";
    return;
  }

  event.target.value = `R$ ${result}`;
};
