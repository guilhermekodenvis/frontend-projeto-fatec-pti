export const showMesurementUnity = (measurementUnity) => {
  switch (measurementUnity) {
    case "kg":
      return "Kg";
    case "g":
      return "g";
    case "l":
      return "L";
    case "ml":
      return "ml";
    case "un":
      return "Un.";
    default:
      return "";
  }
};
