import React, { useRef, useState } from "react";

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import "./ThaiFormfield.css";

const ThaiGovForm = () => {
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    internalPhone: "",
    mobilePhone: "",
    borrowFrom: "",
    purpose: "",
    startDate: "",
    startMonth: "",
    startYear: "",
    endDate: "",
    endMonth: "",
    endYear: "",
    sendDate: "",
    sendMonth: "",
    sendYear: "",
    nameRent: "",
    position1: "",
    position2: "",
    position3: "",
    position4: "",
    position5: "",
    headerGroupRent: "",
    parcelOfficer: "",
    nameApprove: "",
    parcelPayer: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle table input changes
  const handleTableInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTableData = [...tableData];
    updatedTableData[index][name] = value;
    setTableData(updatedTableData);
  };

  // Add a new row to the table
  // const addTableRow = () => {
  //   setTableData([
  //     ...tableData,
  //     { item: "", quantity: "", assetNumber: "", notes: "" },
  //   ]);
  // };

  // // Remove a row from the table
  // const removeTableRow = (index) => {
  //   const updatedTableData = tableData.filter((_, i) => i !== index);
  //   setTableData(updatedTableData);
  // };
  const [tableData, setTableData] = useState([
    { item: "", quantity: "", assetNumber: "", notes: "" },
    { item: "", quantity: "", assetNumber: "", notes: "" },
    { item: "", quantity: "", assetNumber: "", notes: "" },
  ]);

  return (
    <div>
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
            <span>ข้าพเจ้า</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="long"
              style={{ textAlign: "center" }}
            />

            <span>ตำแหน่ง</span>
            <input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="long"
              style={{ textAlign: "center" }}
            />
          </div>

          <div className="form-row">
            <span>สังกัด/กลุ่มงาน/หน่วยงาน</span>
            <input
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              style={{ textAlign: "center" }}
            />

            <span>หมายเลขโทรศัพท์ภายใน</span>
            <input
              name="internalPhone"
              value={formData.internalPhone}
              onChange={handleInputChange}
              className="phone"
              style={{ textAlign: "center" }}
            />
          </div>

          <div className="form-row">
            <span>หมายเลขโทรศัพท์มือถือ</span>
            <input
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleInputChange}
              className="short"
              style={{ textAlign: "center" }}
            />

            <span>มีความประสงค์จะขอยืมพัสดุของ</span>
            <input
              name="borrowFrom"
              value={formData.borrowFrom}
              onChange={handleInputChange}
              style={{ textAlign: "center" }}
            />
          </div>

          <div className="form-row">
            <span>วัตถุประสงค์เพื่อ</span>
            <input
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className="longest"
              style={{ textAlign: "center" }}
            />
          </div>

          <div className="form-row">
            <span>ตั้งแต่วันที่</span>
            <input
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="date"
              style={{ textAlign: "center" }}
            />
            <span>เดือน</span>
            <input
              name="startMonth"
              value={formData.startMonth}
              onChange={handleInputChange}
              className="month"
              style={{ textAlign: "center" }}
            />
            <span>พ.ศ.</span>
            <input
              name="startYear"
              value={formData.startYear}
              onChange={handleInputChange}
              className="date"
              style={{ textAlign: "center" }}
            />
            <span>ถึงวันที่</span>
            <input
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="date"
              style={{ textAlign: "center" }}
            />
            <span>เดือน</span>
            <input
              name="endMonth"
              value={formData.endMonth}
              onChange={handleInputChange}
              className="month"
              style={{ textAlign: "center" }}
            />
            <span>พ.ศ.</span>
            <input
              name="endYear"
              value={formData.endYear}
              onChange={handleInputChange}
              className="date"
              style={{ textAlign: "center" }}
            />
          </div>
        </div>

        {/* Dynamic Table */}
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
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Add row numbering */}
                <td>
                  <input
                    name="item"
                    value={row.item}
                    onChange={(e) => handleTableInputChange(index, e)}
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) => handleTableInputChange(index, e)}
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    name="assetNumber"
                    value={row.assetNumber}
                    onChange={(e) => handleTableInputChange(index, e)}
                    style={{ textAlign: "center" }}
                  />
                </td>
                <td>
                  <input
                    name="notes"
                    value={row.notes}
                    onChange={(e) => handleTableInputChange(index, e)}
                    style={{ textAlign: "center" }}
                  />
                </td>
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
          ทั้งสิ้น ทั้งนี้ ข้าพเจ้าจะส่งคืนพัสดุ ในวันที่
          <input
            name="sendDate"
            value={formData.sendDate}
            onChange={handleInputChange}
            className="date20"
            style={{ textAlign: "center" }}
          />
          เดือน
          <input
            name="sendMonth"
            value={formData.sendMonth}
            onChange={handleInputChange}
            className="month"
            style={{ textAlign: "center" }}
          />
          พ.ศ
          <input
            name="sendYear"
            value={formData.sendYear}
            onChange={handleInputChange}
            className="year30"
            style={{ textAlign: "center" }}
          />
        </div>

        {/* Signature Section */}
        <div className="signature-grid">
          <div className="signature-box">
            <div className="signature-line">
              ลงชื่อ
              <input
                name="nameRent"
                value={formData.nameRent}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
              ผู้ยืมพัสดุ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position1"
                value={formData.position1}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>
          <div className="signature-box">
            <div className="signature-line">
              ลงชื่อ
              <input
                name="headerGroupRent"
                value={formData.headerGroupRent}
                onChange={handleInputChange}
                className="short140"
                style={{ textAlign: "center" }}
              />
              หัวหน้าหน่วยงานผู้ยืม
            </div>
            <div className="signature-name">
              (.................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position2"
                value={formData.position2}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>
        </div>

        <span className="dotsection">
          .....................................................................................................................................................
        </span>
        {/* Checkbox Section */}
        <div className="checkbox-section">
          <p>
            ตรวจสอบแล้วโดย นาย/นาง/นางสาว
            <input
              name="parcelOfficer"
              value={formData.parcelOfficer}
              onChange={handleInputChange}
              className="medium"
              style={{ textAlign: "center" }}
            />
            เจ้าหน้าที่พัสดุ/ผู้ที่ได้รับมอบหมาย
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
              ลงชื่อ
              <input
                name="parcelOfficer"
                value={formData.parcelOfficer}
                onChange={handleInputChange}
                className="medium180"
                style={{ textAlign: "center" }}
              />
              เจ้าหน้าที่พัสดุ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position3"
                value={formData.position3}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>
          <div className="signature-box">
            <div className="signature-line">
              ลงชื่อ
              <input
                name="nameApprove"
                value={formData.nameApprove}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
              ผู้อนุมัติ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position4"
                value={formData.position4}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
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
              ลงชื่อ
              <input
                name="nameRent"
                value={formData.nameRent}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
              ผู้ยืมพัสดุ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position1"
                value={formData.position1}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>
          <div className="signature-box">
            <div className="signature-line">
              ลงชื่อ
              <input
                name="parcelPayer"
                value={formData.parcelPayer}
                onChange={handleInputChange}
                className="medium180"
                style={{ textAlign: "center" }}
              />
              ผู้จ่ายพัสดุ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position6"
                value={formData.position6}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
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
              ลงชื่อ
              <input
                name="nameRent"
                value={formData.nameRent}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
              ผู้ยืมพัสดุ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position1"
                value={formData.position1}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>
          <div className="signature-box">
            <div className="signature-line">
              ลงชื่อ
              <input
                name="parcelPayer"
                value={formData.parcelPayer}
                onChange={handleInputChange}
                className="medium180"
                style={{ textAlign: "center" }}
              />
              ผู้จ่ายพัสดุ
            </div>
            <div className="signature-name">
              (.................................................)
            </div>
            <div className="signature-position">
              ตำแหน่ง
              <input
                name="position8"
                value={formData.position8}
                onChange={handleInputChange}
                className="medium"
                style={{ textAlign: "center" }}
              />
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
            ๑. ผู้อนุมัติ ได้แก่ หัวหน้าหน่วยงานผู้ให้ยืม
            หรือผู้ที่ได้รับมอบอำนาจ
          </p>
          <p>
            ๒. เมื่อครบกำหนดยืม ให้ผู้อนุมัติ
            หรือผู้รับหน้าที่แทนติดตามทวงพัสดุที่ให้ยืมไป ภายใน ๗
            วันนับแต่วันครบกำหนด
          </p>
        </div>

        {/* <div>
          <button onClick={downloadPDF}>Download PDF</button>
        </div> */}
      </div>
    </div>
  );
};

export default ThaiGovForm;
