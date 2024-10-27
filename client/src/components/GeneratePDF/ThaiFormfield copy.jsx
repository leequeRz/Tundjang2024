import React, { useRef, useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import { useCustomers } from "../../context/customerContext";
import { useCustomerRecords } from "../../context/customerRecordContext";
import "./ThaiFormfield.css";

const ThaiGovForm = () => {
  const pdfRef = useRef();

  const [recordData, setrecordData] = useState({
  start_date: null,
  end_date: null,
  item: "",
  count: "",
  item_number: "",
  status: "ยืม",
  detail: "",
  });
  const [userData, setuserData] = useState({
    customer_id: "",
    name : "",
    surname: "",
    role: "",
    group: "",
    tel: "",
  });
  const [form, setForm] = useState(initialFormState);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  
  const { customers } = useCustomers();
  const {
    currentEditRecord,
    setCurrentEditRecord,
    useFetchRecords,
    addRecord,
    updateRecord,
  } = useCustomerRecords();

  // console.log(currentEditRecord);
  const { data: records = [] } = useFetchRecords(
    currentEditRecord.customer_id?.trim()
  );

  const generateLabel = useCallback(
    (item) => `${item.name} ${item.surname} (${item.customer_id})`,
    []
  );

  const customersOptions = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.customer_id,
        label: generateLabel(customer),
      })),
    [customers, generateLabel]
  );
  
  const recordOptions = useMemo(
    () => [
      { id: "create-new", label: "Create New Record" },
      ...records.map((record) => ({ id: record.id, label: record.id })),
    ],
    [records]
  );
  // const [excretion, setExcretion] = useState([]);
  const {
    searchTerm: customerSearchTerm,
    setSearchTerm: setCustomerSearchTerm,
    filteredItems: filteredCustomers,
  } = useSearch(customersOptions, ["label"]);
  const {
    searchTerm: recordSearchTerm,
    setSearchTerm: setRecordSearchTerm,
    filteredItems: filteredRecords,
  } = useSearch(recordOptions, ["label"]);

  const handleSelectCustomer_idFilter = useCallback(
    (value) => {
      setCurrentEditRecord({
        customer_id: value.id,
        docId: { id: "create-new", label: "Create New Record" },
      });
      const selectedCustomer = customers.find(
        (customer) => customer.id === value.id
      );
      if (selectedCustomer) {
        setFormHeader({
          customer_id: selectedCustomer.customer_id.trim(),
          "name surname": `${selectedCustomer.name} ${selectedCustomer.surname}`,
          role: selectedCustomer.role,
          group: selectedCustomer.group,
          tel: selectedCustomer.tel,
        });
        setForm(initialFormState);
      }
    },
    [customers, setCurrentEditRecord]
  );
  const handleSelectRecordFilter = useCallback(
    (value) => {
      setCurrentEditRecord((prev) => ({ ...prev, docId: value }));
      const selectedRecord = records.find((record) => record.id === value.id);
      if (selectedRecord) {
        // อัปเดต form ด้วยค่าจาก selectedRecord
        setForm({
          ...initialFormState, // เริ่มต้นจาก initialFormState
          ...selectedRecord, // เติมค่าจาก selectedRecord
        });
      } else {
        setForm(initialFormState); // รีเซ็ตฟอร์มถ้าไม่พบ Record
      }
    },
    [records, setCurrentEditRecord]
  );
  

  useEffect(() => {
    // console.log(currentEditRecord);
    handleSelectCustomer_idFilter({ id: currentEditRecord.customer_id });
    handleSelectRecordFilter(currentEditRecord.docId);
  }, []);

  useEffect(() => {
    console.log("Form state updated:", form);
  }, [form]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const recordData = {
        customer_id: formHeader.customer_id,
        record: {
          ...form,
          id: currentEditRecord.docId.id,
        },
      };

      const options = {
        onSuccess: () => {
          setAlert({
            open: true,
            message: "Record successfully saved!",
            severity: "success",
          });
        },
        onError: () => {
          setAlert({
            open: true,
            message: "An error occurred while saving the record.",
            severity: "error",
          });
        },
      };

      if (
        currentEditRecord.docId &&
        currentEditRecord.docId.id !== "create-new"
      ) {
        updateRecord(recordData, options);
      } else {
        addRecord(recordData, options);
        setForm(initialFormState);
      }
    },
    [
      form,
      formHeader.customer_id,
      currentEditRecord.docId,
      addRecord,
      updateRecord,
    ]
  );

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setuserData((prevData) => ({
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

  // const downloadPDF = () => {
  //   const input = pdfRef.current;
  //   html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
  //     const pdf = new jsPDF("p", "mm", "a4", true);

  //     const padding = 10; // Set padding in mm

  //     const pdfWidth = 210; // A4 width in mm
  //     const pdfHeight = 297; // A4 height in mm
  //     const contentWidth = pdfWidth - padding * 2; // Width with padding
  //     const imgHeight = (canvas.height * contentWidth) / canvas.width; // Scale image height proportionally

  //     let position = padding; // Start position with padding
  //     let remainingHeight = imgHeight;

  //     const imgData = canvas.toDataURL("image/png");

  //     // Add pages if the content height is larger than A4 page height
  //     while (remainingHeight > 0) {
  //       pdf.addImage(
  //         imgData,
  //         "PNG",
  //         padding,
  //         position,
  //         contentWidth,
  //         imgHeight
  //       );
  //       remainingHeight -= pdfHeight - padding * 2; // Adjust height by removing the padding from both sides
  //       position -= pdfHeight - padding * 2;

  //       if (remainingHeight > 0) {
  //         pdf.addPage();
  //         position = padding; // Reset position for new page
  //       }
  //     }

  //     pdf.save("test.pdf");
  //   });
  // };

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
              value={userData.name}
              onChange={handleInputChange}
              className="long"
            />
            {/* <div className="underline"></div> */}
            <span>ตำแหน่ง</span>
            <input
              name="position"
              value={userData.position}
              onChange={handleInputChange}
              className="long"
            />
            {/* <div className="underline"></div> */}
          </div>

          <div className="form-row">
            <span>สังกัด/กลุ่มงาน/หน่วยงาน</span>
            <input
              name="department"
              value={userData.group}
              onChange={handleInputChange}
            />
            {/* <div className="underline"></div> */}
            <span>หมายเลขโทรศัพท์ภายใน</span>
            <input
              name="internalPhone"
              value={userData.tel}
              onChange={handleInputChange}
              className="phone"
            />
            {/* <div className="underline short"></div> */}
          </div>

          <div className="form-row">
            <span>หมายเลขโทรศัพท์มือถือ</span>
            <input
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              className="short"
            />
            {/* <div className="underline"></div> */}
            <span>มีความประสงค์จะขอยืมพัสดุของ</span>
            <input
              name="detail"
              value={recordData.detail}
              onChange={handleInputChange}
            />
            {/* <div className="underline"></div> */}
          </div>

          <div className="form-row">
            <span>วัตถุประสงค์เพื่อ</span>
            <input
              name="detail"
              value={recordData.detail}
              onChange={handleInputChange}
              className="longest"
            />
          </div>

          <div className="form-row">
            <span>ตั้งแต่วันที่</span>
            <input
              name="start_date"
              value={recordData.start_date}
              onChange={handleInputChange}
              className="date"
            />
            <span>เดือน</span>
            <input
              name="startMonth"
              value={recordData.start_date}
              onChange={handleInputChange}
              className="month"
            />
            <span>พ.ศ.</span>
            <input
              name="startYear"
              value={recordData.start_date}
              onChange={handleInputChange}
              className="date"
            />
            <span>ถึงวันที่</span>
            <input
              name="endDate"
              value={recordData.endDate}
              onChange={handleInputChange}
              className="date"
            />
            <span>เดือน</span>
            <input
              name="endMonth"
              value={recordData.endMonth}
              onChange={handleInputChange}
              className="month"
            />
            <span>พ.ศ.</span>
            <input
              name="endYear"
              value={recordData.endYear}
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
                <td>{index + 1}</td> {/* Add row numbering */}
                <td>
                  <input
                    name="item"
                    value={row.item}
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
                    name="assetNumber"
                    value={row.assetNumber}
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
