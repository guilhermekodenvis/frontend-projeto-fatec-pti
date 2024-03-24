const revenueInfo = document.getElementById("revenueInfo");
const printRevenueButton = document.getElementById("printRevenueButton");
const { jsPDF } = window.jspdf;

window.html2canvas = html2canvas;

printRevenueButton.addEventListener("click", () => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    body {
      color: #130132;
      -webkit-font-smoothing: antialiased;
    }

    h2 {
      font-family: serif;
      font-weight: 700;
      margin-bottom: 0px !important;
    }

    p,
    b,
    span, 
    li {
      font-family: sans-serif !important;
      font-size: 16px;
    }

    #revenueInfo {
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    #revenueInfo::before {
      content: "";
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 32px;
      background-color: rgba(255, 0, 0, 0.6);
    }
  `;

  revenueInfo.parentNode.insertBefore(styleElement, revenueInfo);

  const { offsetHeight } = revenueInfo;

  if (offsetHeight <= 1002) {
    revenueInfo.style.height = "1002px"
  } else if (offsetHeight <= 2004) {
    revenueInfo.style.height = "2004px"
  } else if (offsetHeight <= 3006) {
    revenueInfo.style.height = "3006px"
  } else if (offsetHeight <= 4008) {
    revenueInfo.style.height = "4008px"
  } else if (offsetHeight <= 5010) {
    revenueInfo.style.height = "5010px"
  } 

  const doc = new jsPDF('p', 'px', 'a4');

  doc.html(revenueInfo, {
    x: -120,
    y: 0,
    width: 680,
    windowWidth: 1080,
    callback: function (doc) {
      doc.save("receita.pdf");
      window.location.reload();
    },
  });
});
