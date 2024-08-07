import React from "react";
import "./Form.css";

const Form = () => {
  return (
    <section className="container">
      <header>Registration Form</header>
      <form action="#" className="form">
        <div className="input-box">
          <label>Hospital Number (HN) </label>
          <input type="text" placeholder="Enter hospital number" required />
        </div>

        <div className="input-box">
          <label>Full Name</label>
          <input type="text" placeholder="Enter full name" required />
        </div>

        <div className="column">
          <div className="input-box">
            <label>Phone Number</label>
            <input type="number" placeholder="Enter phone number" required />
          </div>
          <div className="input-box">
            <label>Birth Date</label>
            <input type="date" placeholder="Enter birth date" required />
          </div>
        </div>
        <div className="input-box">
          <label>Age</label>
          <input type="text" placeholder="Enter age" required />
        </div>
        <div className="gender-box">
          <h3>Gender</h3>
          <div className="gender-option">
            <div className="gender">
              <input type="radio" id="check-male" name="gender" defaultChecked />
              <label htmlFor="check-male">Male</label>
            </div>
            <div className="gender">
              <input type="radio" id="check-female" name="gender" />
              <label htmlFor="check-female">Female</label>
            </div>
            <div className="gender">
              <input type="radio" id="check-other" name="gender" />
              <label htmlFor="check-other">Prefer not to say</label>
            </div>
          </div>
        </div>
        <br />
        <div className="column">
          <label>BT</label>
          <div className="select-box">
            <select>
              <option hidden>Country</option>
              <option>America</option>
              <option>Japan</option>
              <option>India</option>
              <option>Nepal</option>
            </select>
          </div>
          <div className="select-box">
            <select>
              <option hidden>Country</option>
              <option>America</option>
              <option>Japan</option>
              <option>India</option>
              <option>Nepal</option>
            </select>
          </div>
        </div>
        <div className="input-box address">
          <label>Address</label>
          <input type="text" placeholder="Enter street address" required />
          <input type="text" placeholder="Enter street address line 2" required />
          <div className="column">
            <div className="select-box">
              <select>
                <option hidden>Country</option>
                <option>America</option>
                <option>Japan</option>
                <option>India</option>
                <option>Nepal</option>
              </select>
            </div>
            <input type="text" placeholder="Enter your city" required />
          </div>
          <div className="column">
            <input type="text" placeholder="Enter your region" required />
            <input type="number" placeholder="Enter postal code" required />
          </div>
        </div>
        <button>Submit</button>
      </form>
    </section>
  );
};

export default Form;
