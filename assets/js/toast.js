export const showSuccessToast = (text) => {
  Toastify({
    text,
    duration: 2000,
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      maxWidth: "360px",
      borderRadius: "16px"
    }
  }).showToast();
}

export const showWarningToast = (text) => {
  Toastify({
    text,
    duration: 2000,
    className: "info",
    style: {
      background: "linear-gradient(to right, #d5760d, #f1fa21)",
      maxWidth: "360px",
      borderRadius: "16px"
    }
  }).showToast();
}

export const showDangerToast = (text) => {
  Toastify({
    text,
    duration: 2000,
    className: "info",
    style: {
      background: "linear-gradient(to right, #c93d9b, #c93d3d)",
      maxWidth: "360px",
      borderRadius: "16px"
    }
  }).showToast();
}