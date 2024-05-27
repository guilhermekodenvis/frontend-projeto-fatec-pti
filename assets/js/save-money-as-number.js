export const saveMoneyAsNumber = (money) => {
  console.log({ money });
  return Number(
    money.replace(".", "").replace(",", ".").replace("R$", "").trim()
  );
};
