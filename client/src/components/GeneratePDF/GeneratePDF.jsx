import React from "react";
import "./GeneratePDF.css"; // ใส่การจัดการ CSS ในไฟล์นี้
import ThaiFormField from "./ThaiFormfield";
const GeneratePDF = () => {
  return (
    <div className="a4-page">
      <div className="box1">
        {/* <ThaiDateForm /> */}
        <ThaiFormField />
      </div>
    </div>
  );
};

export default GeneratePDF;
