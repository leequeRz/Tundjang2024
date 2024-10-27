import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import "./ThaiFormfield.css";
import { formatDateToThai } from "../../utils/helper";

const defaultFormState = {
  start_date: null,
  end_date: null,
  item: "",
  count: "",
  item_number: "",
  // status: "",
  detail: "",
  name: "",
  role: "",
  group: "",
  tel: "",
};

const ThaiGovForm = ({ initialFormProps = {} }) => {
  const [formData, setFormData] = useState({ ...defaultFormState, ...initialFormProps });
  const [tableData, setTableData] = useState([
    { item: "", quantity: "", assetNumber: "", notes: "" },
    { item: "", quantity: "", assetNumber: "", notes: "" },
    { item: "", quantity: "", assetNumber: "", notes: "" },
  ]);
  const pdfRef = useRef();

  useEffect(() => {
    // Update formData whenever initialFormProps change
    setFormData({ ...defaultFormState, ...initialFormProps });
  }, [initialFormProps]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Input Changed - Name: ${name}, Value: ${value}`);
  };

  const handleTableInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTableData = [...tableData];
    updatedTableData[index][name] = value;
    setTableData(updatedTableData);
    console.log(`Table Row ${index} - Name: ${name}, Value: ${value}`);
  };

  return (
    <div>
      <div ref={pdfRef}>
        {/* Header */}
        <div className="header">
          <h3>ใบยืมพัสดุ</h3>
          <div className="year-select">
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
            />
            <span>ตำแหน่ง</span>
            <input
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="long"
            />
          </div>

          <div className="form-row">
            <span>สังกัด/กลุ่มงาน/หน่วยงาน</span>
            <input
              name="group"
              value={formData.group}
              onChange={handleInputChange}
            />
            <span>หมายเลขโทรศัพท์ภายใน</span>
            <input
              name="tel"
              value={formData.tel}
              onChange={handleInputChange}
              className="phone"
            />
                {/* <div className="underline short"></div> */}
          </div>

          <div className="form-row">
            <span>หมายเลขโทรศัพท์มือถือ</span>
            <input
              name="mobilePhone"
              value={formData.phone}
              onChange={handleInputChange}
              className="short"
            />
            <span>มีความประสงค์จะขอยืมพัสดุของ</span>
            <input
              name="borrowFrom"
              // value={formData.borrowFrom}
              onChange={handleInputChange}
            />
          </div>
        

          <div className="form-row">
            <span>วัตถุประสงค์เพื่อ</span>
            <input
              name="detail"
              value={formData.detail}
              onChange={handleInputChange}
              className="longest"
            />
          </div>

          <div className="form-row">
            <span>ตั้งแต่วันที่</span>
            <input
              name="start_date"
              value={formatDateToThai(formData.start_date)}
              onChange={handleInputChange}
              className="date"
            />
            <span>ถึงวันที่</span>
            <input
              name="end_date"
              value={formatDateToThai(formData.end_date)}
              onChange={handleInputChange}
              className="date"
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
                <td>{index + 1}</td>
                <td>
                  <input
                    name="item"
                    value={formData.item}
                    onChange={(e) => handleTableInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) => handleTableInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    name="item_number"
                    value={formData.item_number}
                    onChange={(e) => handleTableInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    name="notes"
                    value={row.notes}
                    onChange={(e) => handleTableInputChange(index, e)}
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
