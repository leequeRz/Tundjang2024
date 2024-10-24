//แก้ไข record
const { db } = require("../config/firebaseConfig");
const {
  checkField,
  firestoreTimestampToDateInUTCPlus7,
  checkParam,
  dateToFirestoreTimestamp,
} = require("../utils");
const logger = require("../config/logger"); // Import the logger
const {
  logRequest,
  timeExecution,
} = require("../middleware/performanceMiddleware");
const { admin } = require("../config/firebaseConfig");

// AddRecord for adding a new record
const AddRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredFields =
       [
        "start_date",
        "end_date", 
        "detail",
        "item",
        "count",
        "item_number",
        "status",
        "detail",
        
        ];
      if (!checkField(requiredFields, req, res)) {
        return;
      }
      const requiredParams = ["customer_id"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }

      const { customer_id } = req.params;

      const current_time = admin.firestore.Timestamp.now();

      const recordData = {
        create_time: current_time,
        update_time: current_time,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        // detail2: req.body.detail2 || null,
        item: req.body.item,
        count: req.body.count,
        item_number: req.body.item_number,
        status: req.body.status,
        detail:req.body.detail,
       
      };

      const docId = `rec_${firestoreTimestampToDateInUTCPlus7(
        current_time,
        "wtf"
      )}`;

      const customer_idDocRef = db.collection("customers").doc(customer_id);

      // Check if the customer_id document exists
      const customer_idDoc = await customer_idDocRef.get();
      if (!customer_idDoc.exists) {
        throw new Error("customer_id document does not exist");
      }

      // Proceed with setting the record data if customer_id exists
      await customer_idDocRef.collection("records").doc(docId).set(recordData);

      // await db
      // 	.collection("customers")
      // 	.doc(customer_id)
      // 	.collection("records")
      // 	.doc(docId)
      // 	.set(recordData);

      logger.info(`Record added for customer ${customer_id} with ID ${docId}`);
      res.status(200).send({
        message: "success",
        data: {
          id: docId,
          create_time: firestoreTimestampToDateInUTCPlus7(
            current_time,
            "noplus"
          ),
        },
      });
    } catch (error) {
      logger.error(`Error adding record for customer: ${error.message}`);
      res.status(500).send(error.message);
    }
  })
);

// EditRecord for updating a specific record
const EditRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["customer_id", "docId"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }
      const { customer_id, docId } = req.params;

      const updateData = {
        ...req.body,
        update_time: admin.firestore.Timestamp.now(),
      };

      await db
        .collection("customers")
        .doc(customer_id)
        .collection("records")
        .doc(docId)
        .update(updateData);

      logger.info(
        `Record updated for customer ${customer_id} with ID ${docId}`
      ); // Log success
      res.status(200).send({ message: "Edit success", data: updateData });
    } catch (error) {
      logger.error(`Error updating record for customer: ${error.message}`); // Log error
      res.status(500).send(error.message);
    }
  })
);

// DelRecord for deleting a specific record
const DelRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["customer_id", "docId"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }
      const { customer_id, docId } = req.params;

      await db
        .collection("customers")
        .doc(customer_id)
        .collection("records")
        .doc(docId)
        .delete();

      logger.info(
        `Record deleted for customer ${customer_id} with ID ${docId}`
      ); // Log success
      res.status(200).send({ message: "Delete success" });
    } catch (error) {
      logger.error(`Error deleting record for customer: ${error.message}`); // Log error
      res.status(500).send(error.message);
    }
  })
);

// GetRecord for retrieving records for a specific customer
const GetRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["customer_id"];
      if (!checkParam(requiredParams, req, res)) return;

      const { customer_id } = req.params;
      const snapshot = await db
        .collection("customers")
        .doc(customer_id)
        .collection("records")
        .get();

      const convertTimestampFields = (data) => {
        const fieldsToConvert = ["timestamp", "create_time", "update_time"];
        fieldsToConvert.forEach((field) => {
          if (data[field]) {
            data[field] = firestoreTimestampToDateInUTCPlus7(
              data[field],
              "date"
            );
          }
        });
      };

      const records = snapshot.docs.map((doc) => {
        const data = doc.data();
        convertTimestampFields(data);
        return { id: doc.id, ...data };
      });

      logger.info(`Records retrieved for customer ${customer_id}`);
      res.status(200).json(records);
    } catch (error) {
      logger.error(`Error retrieving records for customer: ${error.message}`);
      res.status(500).send(error.message);
    }
  })
);

module.exports = {
  AddRecord,
  EditRecord,
  DelRecord,
  GetRecord,
};
