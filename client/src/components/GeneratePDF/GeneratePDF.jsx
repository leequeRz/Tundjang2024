import "./GeneratePDF.css"; // ใส่การจัดการ CSS ในไฟล์นี้
import ThaiFormField from "./ThaiFormfield";
import React, { useRef } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import SelectCustomer from "./SelectCustomer";
// import DownloadButton from "./DownloadButton";
const GeneratePDF = () => {
  const pdfRef = useRef();
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4", true);

      // A4 page dimensions
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const contentWidth = pdfWidth; // Use full width without padding
      const imgHeight = (canvas.height * contentWidth) / canvas.width; // Scale image height proportionally

      let position = 0; // Start at the top of the page
      let remainingHeight = imgHeight;

      const imgData = canvas.toDataURL("image/png");

      // Add pages if the content height is larger than A4 page height
      while (remainingHeight > 0) {
        pdf.addImage(
          imgData,
          "PNG",
          0, // Start at the left edge of the page
          position,
          contentWidth,
          imgHeight
        );
        remainingHeight -= pdfHeight; // Adjust height for the next page
        position -= pdfHeight; // Move position up for the next page

        if (remainingHeight > 0) {
          pdf.addPage(); // Add a new page
          position = 0; // Reset position for new page
        }
      }

      pdf.save("test.pdf");
    });
  };

  return (
    <div>
      <div>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
      {/* <SelectCustomer /> */}
      {/* <DownloadButton /> */}
      <div div className="a4-page" ref={pdfRef}>
        <div>
          <ThaiFormField />
        </div>
      </div>
    </div>
  );
};

export default GeneratePDF;
