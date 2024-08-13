import React from "react";
import "./Form.css";

const Form = () => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <section className="container-form">
      <header>บันทึกอาการรายวัน ประจำวันที่ {currentDate}</header>

      <form className="form">
        <div className="shift-selection">
          <label>เวร:</label>
          <div>
            <input type="radio" id="morning-shift" name="shift" />
            <label htmlFor="morning-shift">เวรเช้า (08.00-16.00)</label>
          </div>
          <div>
            <input type="radio" id="afternoon-shift" name="shift" />
            <label htmlFor="afternoon-shift">เวรบ่าย (16.00-00.00)</label>
          </div>
          <div>
            <input type="radio" id="night-shift" name="shift" />
            <label htmlFor="night-shift">เวรดึก (00.00-08.00)</label>
          </div>
        </div>

        <div className="input-box">
          <label>HN</label>
          <input type="text" placeholder="HN" value="Auto-filled HN" readOnly />
        </div>
        <div className="input-box">
          <label>ชื่อ-สกุล</label>
          <input type="text" placeholder="ชื่อ-สกุล" value="Auto-filled Name" readOnly />
        </div>
        <div className="input-box">
          <label>เพศ</label>
          <input type="text" placeholder="เพศ" value="Auto-filled Gender" readOnly />
        </div>
        <div className="input-box">
          <label>อายุ</label>
          <input type="text" placeholder="อายุ" value="Auto-filled Age" readOnly />
        </div>

        {/* Vital Signs Section */}
        <div className="section vital-signs">
          <h3>ส่วนที่ 1 สัญญาณชีพ</h3>

          <div className="column">
            <label>อุณหภูมิ (BT)</label>
            <div className="input-group">
              <input type="radio" id="bt-normal" name="bt" defaultChecked />
              <label htmlFor="bt-normal">ไม่มีไข้</label>
              <input type="radio" id="bt-low" name="bt" />
              <label htmlFor="bt-low">ไข้ต่ำ</label>
              <input type="radio" id="bt-high" name="bt" />
              <label htmlFor="bt-high">ไข้สูง</label>
            </div>
          </div>

          <div className="column">
            <label>ความดันโลหิต (BP)</label>
            <div className="input-group">
              <input type="radio" id="bp-normal" name="bp" defaultChecked />
              <label htmlFor="bp-normal">ปกติ</label>
              <input type="radio" id="bp-low" name="bp" />
              <label htmlFor="bp-low">ต่ำ</label>
              <input type="radio" id="bp-high" name="bp" />
              <label htmlFor="bp-high">สูง</label>
            </div>
          </div>

          <div className="column">
            <label>อัตราการเต้นของหัวใจ (HR)</label>
            <div className="input-group">
              <input type="radio" id="hr-normal" name="hr" defaultChecked />
              <label htmlFor="hr-normal">ปกติ</label>
              <input type="radio" id="hr-slow" name="hr" />
              <label htmlFor="hr-slow">ช้า</label>
              <input type="radio" id="hr-fast" name="hr" />
              <label htmlFor="hr-fast">เร็ว</label>
            </div>
          </div>

          <div className="column">
            <label>อัตราการหายใจ (RR)</label>
            <div className="input-group">
              <input type="radio" id="rr-normal" name="rr" defaultChecked />
              <label htmlFor="rr-normal">ปกติ</label>
              <input type="radio" id="rr-slow" name="rr" />
              <label htmlFor="rr-slow">ช้า</label>
              <input type="radio" id="rr-fast" name="rr" />
              <label htmlFor="rr-fast">เร็ว</label>
            </div>
          </div>

          <div className="column">
            <label>ค่าออกซิเจนในเลือด (O2sat)</label>
            <div className="input-group">
              <input type="radio" id="o2sat-normal" name="o2sat" defaultChecked />
              <label htmlFor="o2sat-normal">ปกติ</label>
              <input type="radio" id="o2sat-low" name="o2sat" />
              <label htmlFor="o2sat-low">ต่ำ</label>
            </div>
          </div>
        </div>

        {/* Additional Symptoms Section */}
        <div className="section symptoms">
          <h3>ส่วนที่ 2 อาการเบื้องต้น</h3>

          <div className="column">
            <label>ระดับความรู้สึกตัว</label>
            <div className="input-group">
              <input type="radio" id="conscious-awake" name="conscious" />
              <label htmlFor="conscious-awake">ตื่น รู้สึกตัวดี</label>
              <input type="radio" id="conscious-sleep" name="conscious" />
              <label htmlFor="conscious-sleep">หลับ</label>
              <input type="radio" id="conscious-drowsy" name="conscious" />
              <label htmlFor="conscious-drowsy">ซึม</label>
              <input type="radio" id="conscious-confused" name="conscious" />
              <label htmlFor="conscious-confused">สับสน</label>
              <input type="radio" id="conscious-unconscious" name="conscious" />
              <label htmlFor="conscious-unconscious">ไม่รู้สึกตัว</label>
            </div>
          </div>

          <div className="column">
            <label>ลักษณะการหายใจ</label>
            <div className="input-group">
              <input type="radio" id="breathing-normal" name="breathing" />
              <label htmlFor="breathing-normal">หายใจปกติ</label>
              <input type="radio" id="breathing-slow" name="breathing" />
              <label htmlFor="breathing-slow">หายใจช้า</label>
              <input type="radio" id="breathing-fast" name="breathing" />
              <label htmlFor="breathing-fast">หายใจเร็ว หายใจหอบเหนื่อย</label>
            </div>
          </div>

          <div className="input-box">
            <label>อาการเพิ่มเติม</label>
            <input type="text" placeholder="พิมพ์อาการเพิ่มเติมที่นี่" />
          </div>
        </div>

        {/* Diet and Sleep Section */}
        <div className="section diet-sleep">
          <h3>การรับประทานอาหาร</h3>

          <div className="column">
            <label>รูปแบบการรับประทานอาหาร</label>
            <div className="input-group">
              <input type="radio" id="eating-normal" name="eating" />
              <label htmlFor="eating-normal">รับประทานเองได้</label>
              <input type="radio" id="eating-tube" name="eating" />
              <label htmlFor="eating-tube">ใส่สายยางให้อาหาร</label>
            </div>
          </div>

          <div className="column">
            <label>อาหาร</label>
            <div className="input-group">
              <input type="radio" id="food-breastmilk" name="food" />
              <label htmlFor="food-breastmilk">นมแม่</label>
              <input type="radio" id="food-formula" name="food" />
              <label htmlFor="food-formula">นมผสม</label>
              <input type="radio" id="food-solid" name="food" />
              <label htmlFor="food-solid">อาหารแข็ง</label>
              <input type="radio" id="food-others" name="food" />
              <label htmlFor="food-others">อาหารอื่นๆ</label>
            </div>
          </div>

          <div className="column">
            <label>พฤติกรรมการรับประทานอาหาร</label>
            <div className="input-group">
              <input type="radio" id="eating-regular" name="eating-behavior" />
              <label htmlFor="eating-regular">ตามปกติ</label>
              <input type="radio" id="eating-reduced" name="eating-behavior" />
              <label htmlFor="eating-reduced">รับประทานน้อย</label>
              <input type="radio" id="eating-poor" name="eating-behavior" />
              <label htmlFor="eating-poor">ไม่รับประทาน</label>
            </div>
          </div>

          <div className="input-box">
            <label>การนอนหลับ</label>
            <input type="text" placeholder="พิมพ์การนอนหลับที่นี่" />
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="section additional-notes">
          <label>หมายเหตุเพิ่มเติม</label>
          <textarea placeholder="พิมพ์หมายเหตุเพิ่มเติมที่นี่" rows="4"></textarea>
        </div>

        <button type="submit" className="submit-btn">บันทึกข้อมูล</button>
      </form>
    </section>
  );
};

export default Form;
