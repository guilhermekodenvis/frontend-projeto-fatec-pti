export const showResourceName = (resource) => {
  switch (resource) {
    case "el":
      return "Eletricidade";
    case "ag":
      return "Água";
    case "ga":
      return "Gás";
    default:
      return "";
  }
};
