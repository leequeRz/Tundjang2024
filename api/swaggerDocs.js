


// ------- PATIENTS SECTION -------------------------------------- //

// create new patient info
/**
 * @swagger
 * /api/v1/patients/create:
 *   post:
 *     summary: Add a new patient
 *     description: Creates a new patient record in the database with the provided details.
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: 'AI12345'
 *               prefix:
 *                 type: string
 *                 description: Prefix of the patient's name (e.g., Mr., Mrs.).
 *                 example: 'Mr.'
 *               name:
 *                 type: string
 *                 description: First name of the patient.
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 description: Surname of the patient.
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 description: Gender of the patient.
 *                 example: 'Male'
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the patient.
 *                 example: '1990-01-01'
 *             required:
 *               - HN
 *               - prefix
 *               - name
 *               - surname
 *               - gender
 *               - DOB
 *     responses:
 *       200:
 *         description: Patient added successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: success
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */

// edit patient info
/**
 * @swagger
 * /api/v1/patients/update:
 *   put:
 *     summary: Edit an existing patient
 *     description: Updates an existing patient record in the database with the provided details. The date of birth (DOB) must be in "YYYY-MM-DD" format.
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: '12345'
 *               prefix:
 *                 type: string
 *                 description: Prefix of the patient's name (e.g., Mr., Mrs.).
 *                 example: 'Mr.'
 *               name:
 *                 type: string
 *                 description: First name of the patient.
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 description: Surname of the patient.
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 description: Gender of the patient.
 *                 example: 'Male'
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the patient, must be in "YYYY-MM-DD" format.
 *                 example: '1990-01-01'
 *             required:
 *               - HN
 *               - prefix
 *               - name
 *               - surname
 *               - gender
 *               - DOB
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: success
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */

// get patient info and can search
/**
 * @swagger
 * /api/v1/patients/get:
 *   get:
 *     summary: Find patients based on Hospital Number (HN)
 *     description: Retrieves a list of patients based on the HN query parameter. If HN is not provided, the latest updated patients are returned.
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: query
 *         name: HN
 *         schema:
 *           type: string
 *           nullable: true
 *         required: false
 *         description: Hospital Number (HN) of the patient. If not provided, the endpoint returns the latest updated patients.
 *         example: ""
 *     responses:
 *       200:
 *         description: List of patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The document ID of the patient in Firestore.
 *                     example: abc123
 *                   HN:
 *                     type: string
 *                     description: Hospital Number of the patient.
 *                     example: 12345
 *                   prefix:
 *                     type: string
 *                     description: Prefix of the patient's name.
 *                     example: Mr.
 *                   name:
 *                     type: string
 *                     description: First name of the patient.
 *                     example: John
 *                   surname:
 *                     type: string
 *                     description: Surname of the patient.
 *                     example: Doe
 *                   gender:
 *                     type: string
 *                     description: Gender of the patient.
 *                     example: Male
 *                   DOB:
 *                     type: string
 *                     format: date
 *                     description: Date of birth of the patient.
 *                     example: 1990-01-01
 *                   lastUpdate:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the last update for the patient record.
 *                     example: 2024-08-08T12:34:56Z
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */

// delete patient info
/**
 * @swagger
 * /api/v1/patients/delete:
 *   delete:
 *     summary: Delete a patient's infomation
 *     description: Delete an existing document from a patient's infomation collection using the Hospital Number (HN).
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: 'AI12345'
 *             required:
 *               - HN
 *     responses:
 *       200:
 *         description: Record deleted successfully.
 *       500:
 *         description: Internal server error.
 */


// ------- RECORDS SECTION -------------------------------------- //

// Add new record
/**
 * @swagger
 * /api/v1/patients/record:
 *   post:
 *     summary: Add a new patient record
 *     description: Creates a new patient record with the provided details. 
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: 'AI12345'
 *               BT:
 *                 type: string
 *                 description: |
 *                   Body Temperature. Possible values:
 *                   - ไม่มีไข้
 *                   - ไข้ต่ำ
 *                   - ไข้สูง
 *                 example: "ไม่มีไข้"
 *               BP:
 *                 type: string
 *                 description: |
 *                   Blood Pressure. Possible values:
 *                   - ปกติ
 *                   - ต่ำ
 *                   - สูง
 *                 example: "ปกติ"
 *               HR:
 *                 type: string
 *                 description: |
 *                   Heart Rate. Possible values:
 *                   - ปกติ
 *                   - ช้า
 *                   - เร็ว
 *                 example: "ปกติ"
 *               RR:
 *                 type: string
 *                 description: |
 *                   Respiratory Rate. Possible values:
 *                   - ปกติ
 *                   - ช้า
 *                   - เร็ว
 *                 example: "ปกติ"
 *               O2sat:
 *                 type: string
 *                 description: |
 *                   Oxygen Saturation. Possible values:
 *                   - ปกติ
 *                   - ต่ำ
 *                 example: "ปกติ"
 *               conscious:
 *                 type: string
 *                 description: |
 *                   Level of Consciousness. Possible values:
 *                   - ตื่น รู้สึกตัวดี
 *                   - หลับ
 *                   - ซึม
 *                   - สับสน
 *                   - ไม่รู้สึกตัว
 *                 example: "ตื่น รู้สึกตัวดี"
 *               breath_pattern:
 *                 type: string
 *                 description: |
 *                   Breathing Pattern. Possible values:
 *                   - หายใจปกติ
 *                   - หายใจช้า
 *                   - หายใจเร็ว หายใจหอบเหนื่อย
 *                 example: "หายใจปกติ"
 *               extra_symptoms:
 *                 type: string
 *                 description: Additional symptoms (optional).
 *                 example: "มีไข้, ไอ"
 *               eat_method:
 *                 type: string
 *                 description: |
 *                   Eating Method. Possible values:
 *                   - รับประทานเองได้
 *                   - ใส่สายยางให้อาหาร
 *                 example: "รับประทานเองได้"
 *               food_type:
 *                 type: string
 *                 description: |
 *                   Food Type. Possible values:
 *                   - นมแม่
 *                   - นมผสม
 *                   - อาหารปกติ
 *                   - อาหารอ่อน
 *                   - อาหารเหลว
 *                 example: "อาหารปกติ"
 *               extra_food:
 *                 type: string
 *                 description: Additional food information (optional).
 *                 example: "ผักบด"
 *               food_intake:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Food Intake (multiple choice).
 *                 example: ["ข้าว", "ผลไม้"]
 *               sleep:
 *                 type: string
 *                 description: |
 *                   Sleep Pattern. Possible values:
 *                   - นอนหลับได้
 *                   - หลับๆตื่นๆ
 *                   - นอนไม่หลับ
 *                 example: "นอนหลับได้"
 *               excretion:
 *                 type: string
 *                 description: |
 *                   Excretion. Possible values:
 *                   - ดี
 *                   - ไม่ดี
 *                 example: "ดี"
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional).
 *                 example: "ไม่มีอาการผิดปกติ"
 *             required:
 *               - HN
 *               - BT
 *               - BP
 *               - HR
 *               - RR
 *               - O2sat
 *               - conscious
 *               - breath_pattern
 *               - eat_method
 *               - food_type
 *               - food_intake
 *               - sleep
 *               - excretion
 *     responses:
 *       200:
 *         description: Record added successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: success
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */

// edit record
/**
 * @swagger
 * /api/v1/patients/record:
 *   put:
 *     summary: Update a patient's record
 *     description: Update an existing record for a patient using the Hospital Number (HN) and document ID (docId).
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: 'AI12345'
 *               docId:
 *                 type: string
 *                 description: Document ID of the record to update.
 *                 example: 'rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)'
 *               BT:
 *                 type: string
 *                 description: Body Temperature.
 *                 enum: ["ไม่มีไข้", "ไข้ต่ำ", "ไข้สูง"]
 *                 example: "ไม่มีไข้"
 *               BP:
 *                 type: string
 *                 description: Blood Pressure.
 *                 enum: ["ปกติ", "ต่ำ", "สูง"]
 *                 example: "ปกติ"
 *               HR:
 *                 type: string
 *                 description: Heart Rate.
 *                 enum: ["ปกติ", "ช้า", "เร็ว"]
 *                 example: "ปกติ"
 *               RR:
 *                 type: string
 *                 description: Respiratory Rate.
 *                 enum: ["ปกติ", "ช้า", "เร็ว"]
 *                 example: "ปกติ"
 *               O2sat:
 *                 type: string
 *                 description: Oxygen Saturation.
 *                 enum: ["ปกติ", "ต่ำ"]
 *                 example: "ปกติ"
 *               conscious:
 *                 type: string
 *                 description: Level of Consciousness.
 *                 enum: ["ตื่น รู้สึกตัวดี", "หลับ", "ซึม", "สับสน", "ไม่รู้สึกตัว"]
 *                 example: "ตื่น รู้สึกตัวดี"
 *               breath_pattern:
 *                 type: string
 *                 description: Breathing Pattern.
 *                 enum: ["หายใจปกติ", "หายใจช้า", "หายใจเร็ว หายใจหอบเหนื่อย"]
 *                 example: "หายใจปกติ"
 *               extra_symptoms:
 *                 type: string
 *                 description: Additional symptoms (optional).
 *                 example: "มีไข้, ไอ"
 *               eat_method:
 *                 type: string
 *                 description: Eating Method.
 *                 enum: ["รับประทานเองได้", "ใส่สายยางให้อาหาร"]
 *                 example: "รับประทานเองได้"
 *               food_type:
 *                 type: string
 *                 description: Food Type.
 *                 enum: ["นมแม่", "นมผสม", "อาหารปกติ", "อาหารอ่อน", "อาหารเหลว"]
 *                 example: "อาหารปกติ"
 *               extra_food:
 *                 type: string
 *                 description: Additional food information (optional).
 *                 example: "ผักบด"
 *               food_intake:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Food Intake (multiple choice).
 *                 example: ["ข้าว", "ผลไม้"]
 *               sleep:
 *                 type: string
 *                 description: Sleep Pattern.
 *                 enum: ["นอนหลับได้", "หลับๆตื่นๆ", "นอนไม่หลับ"]
 *                 example: "นอนหลับได้"
 *               excretion:
 *                 type: string
 *                 description: Excretion.
 *                 enum: ["ดี", "ไม่ดี"]
 *                 example: "ดี"
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional).
 *                 example: "ไม่มีอาการผิดปกติ"
 *             required:
 *               - HN
 *               - docId
 *     responses:
 *       200:
 *         description: Record updated successfully.
 *       500:
 *         description: Internal server error.
 */


// delete record
/**
 * @swagger
 * /api/v1/patients/record:
 *   delete:
 *     summary: Delete a patient's record
 *     description: Delete an existing record from a patient's record collection using the Hospital Number (HN) and document ID (docId).
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: 'AI12345'
 *               docId:
 *                 type: string
 *                 description: Document ID of the record to delete.
 *                 example: 'rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)'
 *             required:
 *               - HN
 *               - docId
 *     responses:
 *       200:
 *         description: Record deleted successfully.
 *       500:
 *         description: Internal server error.
 */


// get all records
/**
 * @swagger
 * /api/v1/patients/record:
 *   get:
 *     summary: Retrieve patient records by HN
 *     description: Fetch all records associated with a patient's HN (Hospital Number). If HN is not provided, a 404 error will be returned.
 *     tags:
 *       - Records
 *     parameters:
 *       - in: query
 *         name: HN
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         required: true
 *         description: The Hospital Number (HN) of the patient whose records you want to retrieve.
 *     responses:
 *       200:
 *         description: A list of patient records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the record.
 *                     example: "rec_Fri Aug 09 2024 14:39:25 GMT+0700 (เวลาอินโดจีน)"
 *                   RR:
 *                     type: string
 *                     example: "ปกติ"
 *                   extra_food:
 *                     type: string
 *                     example: "ผักบด"
 *                   notes:
 *                     type: string
 *                     example: "ไม่มีอาการผิดปกติ"
 *                   HR:
 *                     type: string
 *                     example: "ปกติ"
 *                   breath_pattern:
 *                     type: string
 *                     example: "หายใจปกติ"
 *                   food_type:
 *                     type: string
 *                     example: "อาหารปกติ"
 *                   extra_symptoms:
 *                     type: string
 *                     example: "มีไข้, ไอ"
 *                   eat_method:
 *                     type: string
 *                     example: "รับประทานเองได้"
 *                   BP:
 *                     type: string
 *                     example: "ปกติ"
 *                   sleep:
 *                     type: string
 *                     example: "นอนหลับได้"
 *                   BT:
 *                     type: string
 *                     example: "ไม่มีไข้"
 *                   O2sat:
 *                     type: string
 *                     example: "ปกติ"
 *                   excretion:
 *                     type: string
 *                     example: "ดี"
 *                   food_intake:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["ข้าว", "ผลไม้"]
 *                   conscious:
 *                     type: string
 *                     example: "ตื่น รู้สึกตัวดี"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the record in UTC+7.
 *                     example: "2024-08-11T14:39:25.853Z"
 *       404:
 *         description: No HN record found
 *       500:
 *         description: Internal server error
 */


// ------- USERS SECTION -------------------------------------- //

// Register user
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the database with the provided username, password, and user type.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: securepassword123
 *               user_type:
 *                 type: string
 *                 description: The type of user (e.g., admin, regular).
 *                 example: admin
 *             required:
 *               - username
 *               - password
 *               - user_type
 *     responses:
 *       200:
 *         description: Register user success
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Register user success
 *       409:
 *         description: Has a duplicated username
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Has a duplicated username
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */

// Log in  user
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: log in to get user infomation
 *     description: Creates a new user in the database with the provided username, password, and user type.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
*         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the organization account.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password of the organization account.
 *                 example: "securepassword123"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Register user success
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Register user success
 *       401:
 *         description: Wrong username or password
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Wrong username or password
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */

// edit user 


// delete user
/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete a user
 *     description: Delete 
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
*         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the organization account.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password of the organization account.
 *                 example: "securepassword123"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: user deleted successfully.
 *       500:
 *         description: Internal server error.
 */


// ---------

// general info random pic
/**
 * @swagger
 * /api/v1/line/general-info:
 *   get:
 *     summary: Retrieve a random file URL from a specific folder in Google Cloud Storage.
 *     description: This endpoint lists all files in a specified folder within a Google Cloud Storage bucket, selects a random file, makes it public, and returns its public URL.
 *     tags: 
 *       - Files
 *     responses:
 *       200:
 *         description: Successfully retrieved the public URL of a random file.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: https://storage.googleapis.com/your-bucket-name/path/to/random-file.jpg
 *       404:
 *         description: No files found in the specified folder.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No files found in the specified folder.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error reading file
 */
  