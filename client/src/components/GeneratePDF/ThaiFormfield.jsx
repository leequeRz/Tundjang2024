import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const ThaiGovForm = () => {
  const pdfRef = useRef();

  // const downloadPDF = () => {
  //   const input = pdfRef.current;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
  //     const imgY = 30;
  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       imgX,
  //       imgY,
  //       imgWidth * ratio,
  //       imgHeight * ratio
  //     );
  //     pdf.save("test.pdf");
  //   });
  // };
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4", true);

      const padding = 10; // Set padding in mm

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const contentWidth = pdfWidth - padding * 2; // Width with padding
      const imgHeight = (canvas.height * contentWidth) / canvas.width; // Scale image height proportionally

      let position = padding; // Start position with padding
      let remainingHeight = imgHeight;

      const imgData = canvas.toDataURL("image/png");

      // Add pages if the content height is larger than A4 page height
      while (remainingHeight > 0) {
        pdf.addImage(
          imgData,
          "PNG",
          padding,
          position,
          contentWidth,
          imgHeight
        );
        remainingHeight -= pdfHeight - padding * 2; // Adjust height by removing the padding from both sides
        position -= pdfHeight - padding * 2;

        if (remainingHeight > 0) {
          pdf.addPage();
          position = padding; // Reset position for new page
        }
      }

      pdf.save("test.pdf");
    });
  };

  return (
    <div ref={pdfRef}>
      {/* Header */}
      <div className="header">
        <h3>ใบยืมพัสดุ</h3>
        <div className="year-select">
          {/* <p>เลือก ปี 66, 67, 68</p> */}
          <p>หน่วยงาน...................................</p>
          <p>วันที่........เดือน..........พ.ศ...........</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="form-fields">
        <div className="form-row">
          <span>
            ข้าพเจ้า..................................................................
          </span>
          {/* <div className="underline"></div> */}
          <span>
            ตำแหน่ง.................................................................
          </span>
          {/* <div className="underline"></div> */}
        </div>

        <div className="form-row">
          <span>
            สังกัด/กลุ่มงาน/หน่วยงาน................................................
          </span>
          {/* <div className="underline"></div> */}
          <span>หมายเลขโทรศัพท์ภายใน..................................</span>
          {/* <div className="underline short"></div> */}
        </div>

        <div className="form-row">
          <span>หมายเลขโทรศัพท์มือถือ...................................</span>
          {/* <div className="underline"></div> */}
          <span>
            มีความประสงค์จะขอยืมพัสดุของ.......................................
          </span>
          {/* <div className="underline"></div> */}
        </div>

        <div className="form-row">
          <span>
            วัตถุประสงค์เพื่อ.....................................................................................................................................
          </span>
        </div>

        <div className="form-row">
          <span>
            ตั้งแต่วันที่..........เดือน......................พ.ศ.............ถึงวันที่..........เดือน......................พ.ศ.............ดังต่อไปนี้
          </span>
        </div>
      </div>

      {/* Table */}
      <table className="items-table">
        <thead>
          <tr>
            <th>ลำดับที่</th>
            <th>รายการ</th>
            <th>จำนวน</th>
            <th>หมายเลขครุภัณฑ์</th>
            <th>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((row) => (
            <tr key={row}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Terms Text */}
      <div className="terms-text">
        ตามรายการที่ยืมข้างต้น ข้าพเจ้าจะดูแลรักษาเป็นอย่างดี
        และส่งคืนให้ในสภาพที่ใช้การได้เรียบร้อย หากเกิดการชำรุด หรือ
        ใช้การไม่ได้ หรือสูญหายไป
        ข้าพเจ้าจะจัดการแก้ไขซ่อมแซมให้คงสภาพเดิมโดยเสียค่าใช้จ่ายของ
        หรือชดใช้เป็นพัสดุประเภท ชนิด ขนาด ลักษณะและคุณภาพอย่างเดียวกัน
        หรือชดใช้เป็นเงินตามราคาที่เป็นอยู่ในขณะยืม
        ตามหลักเกณฑ์ที่กระทรวงการคลังกำหนดข้าพเจ้าขอรับผิดชอบโดยไม่มีเงื่อนไขใดๆ
        ทั้งสิ้น ทั้งนี้ ข้าพเจ้าจะส่งคืนพัสดุ
        ในวันที่..........เดือน.............พ.ศ.............
      </div>

      {/* Signature Section */}
      <div className="signature-grid">
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ.............................................ผู้ยืมพัสดุ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ................................หัวหน้าหน่วยงานผู้ยืม
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
      </div>

      <span className="dotsection">
        .....................................................................................................................................................
      </span>
      {/* Checkbox Section */}
      <div className="checkbox-section">
        <p>
          ตรวจสอบแล้วโดย
          นาย/นาง/นางสาว......................................................เจ้าหน้าที่พัสดุ/ผู้ที่ได้รับมอบหมาย
        </p>
        <div className="checkbox-row">
          <input type="checkbox" />
          <span>ยืมใช้ภายในสถานที่ของหน่วยงาน</span>
        </div>
        <div className="checkbox-row">
          <input type="checkbox" />
          <span>ยืมใช้นอกสถานที่</span>
        </div>
      </div>

      {/* Final Signatures */}
      <div className="signature-grid">
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ........................................เจ้าหน้าที่พัสดุ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ..........................................ผู้อนุมัติ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
      </div>

      <span className="dotsection">
        .....................................................................................................................................................
      </span>

      <div className="checkbox-section">
        <div className="checkbox-row">
          <input type="checkbox" />
          <span>
            ได้รับพัสดุจากหน่วยงานแล้วเมื่อวันที่.............เดือน..................พ.ศ...................
          </span>
        </div>
      </div>

      {/* Final Signatures */}
      <div className="signature-grid">
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ........................................ผู้ยืมพัสดุ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ..........................................ผู้จ่ายพัสดุ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
      </div>

      <div className="checkbox-section">
        <div className="checkbox-row">
          <input type="checkbox" />
          <span>
            ได้ส่งคืนพัสดุแล้วเมื่อวันที่.............เดือน..................พ.ศ...................
          </span>
        </div>
      </div>

      {/* Final Signatures */}
      <div className="signature-grid">
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ........................................ผู้ยืมพัสดุ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
        <div className="signature-box">
          <div className="signature-line">
            ลงชื่อ..........................................ผู้จ่ายพัสดุ
          </div>
          <div className="signature-name">
            (.................................................)
          </div>
          <div className="signature-position">
            ตำแหน่ง...........................................
          </div>
        </div>
      </div>

      <span className="dotsection">
        .....................................................................................................................................................
      </span>
      {/* Footer Notes */}
      <div className="footer-notes">
        <p className="note-title">หมายเหตุ</p>
        <p>
          ๑. ผู้อนุมัติ ได้แก่ หัวหน้าหน่วยงานผู้ให้ยืม หรือผู้ที่ได้รับมอบอำนาจ
        </p>
        <p>
          ๒. เมื่อครบกำหนดยืม ให้ผู้อนุมัติ
          หรือผู้รับหน้าที่แทนติดตามทวงพัสดุที่ให้ยืมไป ภายใน ๗
          วันนับแต่วันครบกำหนด
        </p>
      </div>

      <div className="row text-center mt-5">
        <button className="btn btn-primary" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <style>{`
        .form-container {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          padding: 32px;
          font-family: sans-serif;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .header {
          margin-bottom: 10px;
          text-align: center;
          justify-content: center;
          align-items: center;
        }

        .title {
          font-size: 20px;
          font-weight: 600;
        }

        .year-select {
          text-align: right;
        }

        .form-fields {
          margin-bottom: 10px;
        }

        .form-row {
          display: flex;
          align-items: center;
          gap: 8px;
         margin-bottom: 2px;
        }

        .underline {
          flex: 1;
          border-bottom: 1px solid #666;
        }

        .underline.short {
          width: 120px;
          flex: none;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }

        .items-table th,
        .items-table td {
          border: 1px solid #666;
          padding: 8px 8px 12px 8px;
          text-align: center;
        }

        .items-table th:first-child {
          width: 70px;
        }

        .items-table th:nth-child(3) {
          width: 50px;
        }

        .items-table th:nth-child(4) {
          width: 150px;
        }

        .items-table th:nth-child(5) {
          width: 200px;
        }

        .terms-text {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }

        .signature-box {
          text-align: start;
        }

        .signature-line {
          margin-bottom: 5px;
        }

        .signature-name {
          margin-bottom: 5px;
          margin-left: 30px
        }
         
        .signature-position {
          margin-bottom: 5px;
         }

        .checkbox-section {
          margin-top: 5px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          margin-top: 8px;
        }
         
        .dotsection{
          margin-buttom: 5px;
        }

        .checkbox-row input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .footer-notes {
          margin-top: 10px;
          font-size: 14px;
        }

        .note-title {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .footer-notes p {
          margin-bottom: 4px;
        }

        @media print {
          .form-container {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ThaiGovForm;
