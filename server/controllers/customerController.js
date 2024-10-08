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
        "customer_name",
        "phone",
        "role",
        "tel_company",
      ];
      if (!checkField(requiredFields, req, res)) {
        return;
      }

      req.body.DOB = dateToFirestoreTimestamp(req.body.DOB);
      await db.collection("customers").doc(req.body.customer_id).create(req.body);

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
        return;
      }
      console.log(req.params);

      const { customer_id } = req.params;

      const requiredFields = ["customer_id", "customer_name", "phone", "role", "tel_company"];

      if (!checkField(requiredFields, req, res)) {
        return;
      }

      req.body.DOB = dateToFirestoreTimestamp(req.body.DOB);
      await db.collection("customers").doc(customer_id).update(req.body);

      logger.info(`Customer updated: ${customer_id}`); // Log the update of a Customer
      res.status(200).send({ message: "success" });
    } catch (error) {
      logger.error(`Error updating Customer: ${error.message}`); // Log the error
      res.status(500).send(error.message);
    }
  })
);

const FindCustomer = logRequest(
  timeExecution(async (req, res) => {
    try {
      const { customer_id, DOB } = req.query;
      let snapshot;

      if (customer_id && DOB) {
        let convertedDOB = DOB;
        const [day, month, yearBE] = DOB.split("/").map(Number);
        const yearAD = yearBE - 543;
        convertedDOB = `${yearAD}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
        const correctDOB = dateToFirestoreTimestamp(convertedDOB);
        // Search by both customer_id and DOB
        snapshot = await db
          .collection("customers")
          .where("customer_id", "==", customer_id)
          .where("DOB", "==", correctDOB)
          .get();
      } else if (customer_id) {
        // Search by customer_id only
        snapshot = await db.collection("customers").where("customer_id", "==", customer_id).get();
      } else {
        // Return a limited list if no customer_id is provided
        snapshot = await db.collection("customers").limit(15).get();
      }

      const customers = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.DOB) {
          data.DOB = firestoreTimestampToDateInUTCPlus7(data.DOB, "DOB");
        }
        customers.push({ id: doc.id, ...data });
      });

      logger.info(`Customer(s) found: ${customer_id ? customer_id : "all Customers"}`);
      res.status(200).json(customers);
    } catch (error) {
      logger.error(`Error finding Customer(s): ${error.message}`); // Log the error
      res.status(500).send(error.message);
    }
  })
);

const DelCustomer = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["customer_id"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }

      const { customer_id } = req.params;

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
