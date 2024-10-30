// แก้ไขให้เป็น customer
const { db } = require("../config/firebaseConfig");
const {
  checkField,
  checkParam,
  dateToFirestoreTimestamp,
  firestoreTimestampToDateInUTCPlus7,
} = require("../utils");
const logger = require("../config/logger");
const {
  logRequest,
  timeExecution,
} = require("../middleware/performanceMiddleware");

const AddCustomer = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredFields = [
        "customer_id",
        "name",
        "surname",
        "phone",
        "role",
        "tel",
        "group",
      ];
      if (!checkField(requiredFields, req, res)) {
        return;
      }

      await db
        .collection("customers")
        .doc(req.body.customer_id)
        .create(req.body);

      logger.info(`Customer added: ${req.body.customer_id}`); // Log the addition of a Customer
      res.status(200).send({ message: "success" });
    } catch (error) {
      logger.error(`Error adding Customer: ${error.message}`); // Log the error
      res.status(500).send(error.message);
    }
  })
);

const EditCustomer = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["customer_id"];
      if (!checkParam(requiredParams, req, res)) {
        // Missing required parameters in the request
        return res.status(400).send({ error: "Missing required parameters." });
      }

      console.log(req.params);
      const { customer_id } = req.params;

      const requiredFields = [
        "customer_id",
        "name",
        "surname",
        "phone",
        "role",
        "tel",
        "group",
      ];

      if (!checkField(requiredFields, req, res)) {
        // Missing required fields in the request body
        return res.status(400).send({ error: "Missing required fields." });
      }

      // Attempt to update the customer record
      await db.collection("customers").doc(customer_id).update(req.body);
      logger.info(`Customer updated: ${customer_id}`);
      
      // Send a success response
      res.status(200).send({ message: "success" });

    } catch (error) {
      // Check if the error is due to a Firestore issue (e.g., document not found)
      if (error.code === 'not-found') {
        logger.error(`Customer not found: ${customer_id}`);
        return res.status(404).send({ error: "Customer not found." });
      }
      
      // Handle permission-related errors (e.g., unauthorized update)
      if (error.code === 'permission-denied') {
        logger.error(`Permission denied for updating Customer: ${customer_id}`);
        return res.status(403).send({ error: "Permission denied." });
      }

      // Handle other Firestore errors
      if (error.code) {
        logger.error(`Firestore Error: ${error.code} - ${error.message}`);
        return res.status(500).send({ error: "An error occurred while updating the customer." });
      }

      // Log and respond to unexpected errors
      logger.error(`Error updating Customer: ${error.message}`);
      res.status(500).send({ error: "Unexpected error. Please try again later." });
    }
  })
);

const FindCustomer = logRequest(
  // ฟังก์ชัน FindCustomer ถูกห่อด้วย logRequest เพื่อบันทึก log ของ request
  timeExecution(
    // ฟังก์ชันนี้ถูกห่อด้วย timeExecution เพื่อบันทึกเวลาการทำงาน
    async (req, res) => {
      // เป็นฟังก์ชันอะซิงโครนัสที่ใช้ในการจัดการ request และ response
      try {
        const { customer_id, name, surname } = req.query; // ดึงค่า customer_id, name, surname จาก query parameters
        let snapshot;

        // ค้นหาลูกค้าโดยใช้ customer_id, name หรือ surname
        if (customer_id) {
          // ค้นหาจาก customer_id ถ้ามี
          snapshot = await db
            .collection("customers")
            .where("customer_id", "==", customer_id)
            .get();
        } else if (name && surname) {
          // ค้นหาจาก name และ surname ถ้ามีทั้งคู่
          snapshot = await db
            .collection("customers")
            .where("name", "==", name)
            .where("surname", "==", surname)
            .get();
        } else if (name) {
          // ค้นหาจาก name อย่างเดียว
          snapshot = await db
            .collection("customers")
            .where("name", "==", name)
            .get();
        } else if (surname) {
          // ค้นหาจาก surname อย่างเดียว
          snapshot = await db
            .collection("customers")
            .where("surname", "==", surname)
            .get();
        } else {
          // ถ้าไม่มีเงื่อนไขใดๆ ส่งข้อมูลลูกค้ามากที่สุด 15 รายการ
          snapshot = await db.collection("customers").get();
        }

        const customers = []; // สร้าง array สำหรับเก็บข้อมูลลูกค้า
        snapshot.forEach((doc) => {
          // วนลูปผ่านเอกสารที่ได้จากการค้นหา
          const data = doc.data(); // ดึงข้อมูลจากแต่ละเอกสาร
          customers.push({ id: doc.id, ...data }); // เพิ่มข้อมูลลูกค้าและ id ของเอกสารลงใน array
        });

        logger.info(
          `Customer(s) found: ${
            customer_id || name || surname
              ? `${customer_id || name || surname}`
              : "all Customers"
          }`
        ); // บันทึก log ว่าพบลูกค้า (หรือทั้งหมดถ้าไม่มี customer_id, name, surname)
        res.status(200).json(customers); // ส่งข้อมูลลูกค้าที่พบกลับในรูปแบบ JSON
      } catch (error) {
        // หากเกิดข้อผิดพลาด
        logger.error(`Error finding Customer(s): ${error.message}`); // บันทึก log ข้อผิดพลาด
        res.status(500).send(error.message); // ส่งข้อความข้อผิดพลาดกลับไปยัง client
      }
    }
  )
);

const DelCustomer = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["customer_id"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }

      const { customer_id } = req.params;
      await db.collection("customers").doc(customer_id).delete();
      logger.info(`Customer deleted: ${customer_id}`); // Log the deletion of a Customer
      res.status(200).send({ message: "Customer deleted successfully" });
    } catch (error) {
      logger.error(`Error deleting Customer: ${error.message}`); // Log the error
      res.status(500).send(error.message);
    }
  })
);

module.exports = {
  AddCustomer,
  EditCustomer,
  FindCustomer,
  DelCustomer,
};
