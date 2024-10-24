const express = require("express");
const router = express.Router();
const {
  AddRecord,
  EditRecord,
  DelRecord,
  GetRecord,
} = require("../controllers/recordController");

// AddRecord route for adding a record
/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Operations related to customer records
 */

/**
 * @swagger
 * /api/v1/customer/{customer_id}/record:
 *   post:
 *     summary: Add a new record for a customer
 *     description: Adds a new record with various health parameters for the customer identified by the Hospital Number (customer_id).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (customer_id) of the customer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Record ID
 *                 example: "rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the record in UTC+7.
 *                 example: "2024-08-11T14:39:25.853Z"
 *               BT:
 *                 type: number
 *                 description: Body Temperature
 *                 example: "ไม่มีไข้"
 *               BP:
 *                 type: string
 *                 description: Blood Pressure
 *                 example: "ปกติ"
 *               HR:
 *                 type: number
 *                 description: Heart Rate
 *                 example: "ปกติ"
 *               RR:
 *                 type: number
 *                 description: Respiratory Rate
 *                 example: "ปกติ"
 *               O2sat:
 *                 type: number
 *                 description: Oxygen Saturation
 *                 example: "ปกติ"
 *               conscious:
 *                 type: string
 *                 description: Consciousness level
 *                 example: "ตื่น รู้สึกตัวดี"
 *               breath_pattern:
 *                 type: string
 *                 description: Breath pattern
 *                 example: "หายใจปกติ"
 *               eat_method:
 *                 type: string
 *                 description: Eating method
 *                 example: "รับประทานเองได้"
 *               food_type:
 *                 type: string
 *                 description: Type of food
 *                 example: "อาหารปกติ"
 *               food_intake:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ข้าว", "ผลไม้"]
 *                 description: Food intake
 *               sleep:
 *                 type: string
 *                 description: Sleep details
 *                 example: "นอนหลับได้"
 *               excretion:
 *                 type: string
 *                 description: Excretion details
 *                 example: "ดี"
 *               extra_symptoms:
 *                 type: string
 *                 description: Extra symptoms (optional)
 *                 example: "มีไข้, ไอ"
 *               extra_food:
 *                 type: string
 *                 description: Extra food (optional)
 *                 example: "ผักบด"
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *                 example: "ไม่มีอาการผิดปกติ"
 *     responses:
 *       200:
 *         description: Record added successfully, returns the document ID
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)'
 *       400:
 *         description: Missing required parameter or field
 *       500:
 *         description: Internal server error
 */
router.post("/customer/:customer_id/record", AddRecord);

// EditRecord route for updating a specific record
/**
 * @swagger
 * /api/v1/customer/{customer_id}/record/{docId}:
 *   put:
 *     summary: Update a specific record
 *     description: Updates a specific record identified by the document ID for the customer identified by the Hospital Number (customer_id).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (customer_id) of the customer.
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *           example: "rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)"
 *         description: Document ID of the record to be deleted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Record ID
 *                 example: "rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the record in UTC+7.
 *                 example: "2024-08-11T14:39:25.853Z"
 *               BT:
 *                 type: number
 *                 description: Body Temperature
 *                 example: "ไม่มีไข้"
 *               BP:
 *                 type: string
 *                 description: Blood Pressure
 *                 example: "ปกติ"
 *               HR:
 *                 type: number
 *                 description: Heart Rate
 *                 example: "ปกติ"
 *               RR:
 *                 type: number
 *                 description: Respiratory Rate
 *                 example: "ปกติ"
 *               O2sat:
 *                 type: number
 *                 description: Oxygen Saturation
 *                 example: "ปกติ"
 *               conscious:
 *                 type: string
 *                 description: Consciousness level
 *                 example: "ตื่น รู้สึกตัวดี"
 *               breath_pattern:
 *                 type: string
 *                 description: Breath pattern
 *                 example: "หายใจปกติ"
 *               eat_method:
 *                 type: string
 *                 description: Eating method
 *                 example: "รับประทานเองได้"
 *               food_type:
 *                 type: string
 *                 description: Type of food
 *                 example: "อาหารปกติ"
 *               food_intake:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ข้าว", "ผลไม้"]
 *                 description: Food intake
 *               sleep:
 *                 type: string
 *                 description: Sleep details
 *                 example: "นอนหลับได้"
 *               excretion:
 *                 type: string
 *                 description: Excretion details
 *                 example: "ดี"
 *               extra_symptoms:
 *                 type: string
 *                 description: Extra symptoms (optional)
 *                 example: "มีไข้, ไอ"
 *               extra_food:
 *                 type: string
 *                 description: Extra food (optional)
 *                 example: "ผักบด"
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *                 example: "ไม่มีอาการผิดปกติ"
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Missing required parameters or fields
 *       500:
 *         description: Internal server error
 */
router.put("/customer/:customer_id/record/:docId", EditRecord);

// DelRecord route for deleting a specific record
/**
 * @swagger
 * /api/v1/customer/{customer_id}/record/{docId}:
 *   delete:
 *     summary: Delete a specific record
 *     description: Deletes a specific record identified by the document ID for the customer identified by the Hospital Number (customer_id).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (customer_id) of the customer.
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *           example: 'rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)'
 *         description: Document ID of the record to be deleted.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
router.delete("/customer/:customer_id/record/:docId", DelRecord);

// GetRecord route for retrieving records of a specific customer
/**
 * @swagger
 * /api/v1/customer/{customer_id}/record:
 *   get:
 *     summary: Retrieve records for a specific customer
 *     description: Retrieves all records for the customer identified by the Hospital Number (customer_id).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (customer_id) of the customer.
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Record ID
 *                     example: "rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of the record in UTC+7.
 *                     example: "2024-08-11T14:39:25.853Z"
 *                   BT:
 *                     type: number
 *                     description: Body Temperature
 *                     example: "ไม่มีไข้"
 *                   BP:
 *                     type: string
 *                     description: Blood Pressure
 *                     example: "ปกติ"
 *                   HR:
 *                     type: number
 *                     description: Heart Rate
 *                     example: "ปกติ"
 *                   RR:
 *                     type: number
 *                     description: Respiratory Rate
 *                     example: "ปกติ"
 *                   O2sat:
 *                     type: number
 *                     description: Oxygen Saturation
 *                     example: "ปกติ"
 *                   conscious:
 *                     type: string
 *                     description: Consciousness level
 *                     example: "ตื่น รู้สึกตัวดี"
 *                   breath_pattern:
 *                     type: string
 *                     description: Breath pattern
 *                     example: "หายใจปกติ"
 *                   eat_method:
 *                     type: string
 *                     description: Eating method
 *                     example: "รับประทานเองได้"
 *                   food_type:
 *                     type: string
 *                     description: Type of food
 *                     example: "อาหารปกติ"
 *                   food_intake:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["ข้าว", "ผลไม้"]
 *                     description: Food intake
 *                   sleep:
 *                     type: string
 *                     description: Sleep details
 *                     example: "นอนหลับได้"
 *                   excretion:
 *                     type: string
 *                     description: Excretion details
 *                     example: "ดี"
 *                   extra_symptoms:
 *                     type: string
 *                     description: Extra symptoms (optional)
 *                     example: "มีไข้, ไอ"
 *                   extra_food:
 *                     type: string
 *                     description: Extra food (optional)
 *                     example: "ผักบด"
 *                   notes:
 *                     type: string
 *                     description: Additional notes (optional)
 *                     example: "ไม่มีอาการผิดปกติ"
 *       400:
 *         description: Missing required parameter customer_id
 *       500:
 *         description: Internal server error
 */
router.get("/customer/:customer_id/record", GetRecord);

module.exports = router;
