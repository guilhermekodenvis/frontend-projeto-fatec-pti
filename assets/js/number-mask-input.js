export const numberMaskInput = (event) => {
  const { value } = event.target;

  if (value.slice(-1) === ",") {
    if (value.indexOf(",") !== value.lastIndexOf(",")) {
      event.target.value = value.slice(0, -1);
    }

    return;
  }

  event.target.value = value.replace(/[^0-9,]/g, "");
};
