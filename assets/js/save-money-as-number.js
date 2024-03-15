export const saveMoneyAsNumber = (money) => {
  return Number(money.replace(".", "").replace(",", ".").replace("R$ ", ""));
};
