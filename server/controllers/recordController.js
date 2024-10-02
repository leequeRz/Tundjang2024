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
      const requiredFields = [
        "BT",
        "BP",
        "HR",
        "RR",
        "O2sat",
        "conscious",
        "breath_pattern",
        "eat_method",
        "food_type",
        "phlegm", //add
        "food_intake",
        "sleep",
        "excretion", //add
        "urine_num", //add
        "stool_num", // add
      ];
      if (!checkField(requiredFields, req, res)) {
        return;
      }
      const requiredParams = ["HN"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }

      const { HN } = req.params;

      const current_time = admin.firestore.Timestamp.now();

      const recordData = {
        create_time: current_time,
        update_time: current_time,
        BT: req.body.BT,
        BP: req.body.BP,
        HR: req.body.HR,
        RR: req.body.RR,
        O2sat: req.body.O2sat,
        conscious: req.body.conscious,
        breath_pattern: req.body.breath_pattern,
        phlegm: req.body.phlegm, // add "เสมหะ"
        // extra_symptoms: req.body.extra_symptoms || null, **delete**
        eat_method: req.body.eat_method,
        food_type: req.body.food_type,
        // extra_food: req.body.extra_food || null, **delete**
        food_intake: req.body.food_intake, // array
        sleep: req.body.sleep,
        excretion: req.body.excretion, // change to array
        urine_num: req.body.urine_num, // add
        stool_num: req.body.stool_num, // add
        notes: req.body.notes || null,
      };

      const docId = `rec_${firestoreTimestampToDateInUTCPlus7(
        current_time,
        "wtf"
      )}`;

      const HNDocRef = db.collection("patients").doc(HN);

      // Check if the HN document exists
      const HNDoc = await HNDocRef.get();
      if (!HNDoc.exists) {
        throw new Error("HN document does not exist");
      }

      // Proceed with setting the record data if HN exists
      await HNDocRef.collection("records").doc(docId).set(recordData);

      // await db
      // 	.collection("patients")
      // 	.doc(HN)
      // 	.collection("records")
      // 	.doc(docId)
      // 	.set(recordData);

      logger.info(`Record added for patient ${HN} with ID ${docId}`);
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
      logger.error(`Error adding record for patient: ${error.message}`);
      res.status(500).send(error.message);
    }
  })
);

// EditRecord for updating a specific record
const EditRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["HN", "docId"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }
      const { HN, docId } = req.params;

      const updateData = {
        ...req.body,
        update_time: admin.firestore.Timestamp.now(),
      };

      await db
        .collection("patients")
        .doc(HN)
        .collection("records")
        .doc(docId)
        .update(updateData);

      logger.info(`Record updated for patient ${HN} with ID ${docId}`); // Log success
      res.status(200).send({ message: "Edit success", data: updateData });
    } catch (error) {
      logger.error(`Error updating record for patient: ${error.message}`); // Log error
      res.status(500).send(error.message);
    }
  })
);

// DelRecord for deleting a specific record
const DelRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["HN", "docId"];
      if (!checkParam(requiredParams, req, res)) {
        return;
      }
      const { HN, docId } = req.params;

      await db
        .collection("patients")
        .doc(HN)
        .collection("records")
        .doc(docId)
        .delete();

      logger.info(`Record deleted for patient ${HN} with ID ${docId}`); // Log success
      res.status(200).send({ message: "Delete success" });
    } catch (error) {
      logger.error(`Error deleting record for patient: ${error.message}`); // Log error
      res.status(500).send(error.message);
    }
  })
);

// GetRecord for retrieving records for a specific patient
const GetRecord = logRequest(
  timeExecution(async (req, res) => {
    try {
      const requiredParams = ["HN"];
      if (!checkParam(requiredParams, req, res)) return;

      const { HN } = req.params;
      const snapshot = await db
        .collection("patients")
        .doc(HN)
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

      logger.info(`Records retrieved for patient ${HN}`);
      res.status(200).json(records);
    } catch (error) {
      logger.error(`Error retrieving records for patient: ${error.message}`);
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
