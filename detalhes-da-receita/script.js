const revenueInfo = document.getElementById("revenueInfo");
const printRevenueButton = document.getElementById("printRevenueButton");
const { jsPDF } = window.jspdf;

window.html2canvas = html2canvas;

printRevenueButton.addEventListener("click", () => {
  const doc = new jsPDF();

  doc.html(revenueInfo, {
    callback: function (doc) {
      doc.save("receita.pdf");
    },
    x: 10,
    y: 10,
    windowWidth: 1080,
  });
});
