const  { db, admin , bucket , storage} = require('../config_db/firebaseConfig');
const crypto = require('crypto');
const Timestamp = admin.firestore.Timestamp;

const multer = require('multer');

const firestoreTimestampToDateInUTCPlus7 = (firestoreTimestamp, returnFormat = 'DOB') => {
  // Convert Firestore Timestamp to JavaScript Date (in UTC)
  const utcDate = firestoreTimestamp.toDate();

  if (returnFormat === 'noplus') {
    // Return as UTC date in 'YYYY-MM-DD' format without adjustment
    return new Date(utcDate.getTime());
  } else if (returnFormat === 'DOB') {
    // Convert UTC Date to UTC+7 by adding 7 hours (7 * 60 * 60 * 1000 milliseconds)
    const offsetMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const utcPlus7Date = new Date(utcDate.getTime() + offsetMilliseconds);

    // Return as 'YYYY-MM-DD'
    const year = utcPlus7Date.getFullYear();
    const month = String(utcPlus7Date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(utcPlus7Date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    // Return as full Date object (with time) in UTC+7 if not 'noplus' or 'DOB'
    const offsetMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const utcPlus7Date = new Date(utcDate.getTime() + offsetMilliseconds);
    return utcPlus7Date;
  }
};


const dateToFirestoreTimestamp = (dateString) => {
  // Parse the YYYY-MM-DD string to a JavaScript Date object
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Months are 0-based in Date

  // Convert from UTC+7 to UTC by subtracting 7 hours
  const utcDate = new Date(date.getTime() - (7 * 60 * 60 * 1000));

  // Create Firestore Timestamp from JavaScript Date
  return Timestamp.fromDate(date);
};

// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage({
//   projectId: serviceAccount.project_id,
//   credentials: {
//     client_email: serviceAccount.client_email,
//     private_key: serviceAccount.private_key
//   }
// });
// const bucket = storage.bucket(admin.storage().bucket().name);


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

function checkfield(requiredFields, req){
  for (const field of requiredFields) {
      if (!req.body[field]) {
          return res.status(400).json({
              message: `Missing required field: ${field}`
          });
      }
    }
}

function hashData(data) {
  return crypto.createHash('sha512').update(data).digest('hex');
}

// create new patient info
const AddPatient = async (req, res ) => {
    try {
      const requiredFields = [
        'HN',
        'prefix',
        'name',
        'surname',
        'gender',
        'DOB'
      ];

      checkfield(requiredFields,req);

      const firestoreTimestamp = dateToFirestoreTimestamp(req.body.DOB);
      req.body.DOB = firestoreTimestamp;

      const response = await db.collection('patients').doc(req.body.HN).create(req.body);

      res.status(200).send('success');
    } catch (error) {
      res.status(500).send(error.message);
    }
}

// edit patient info
const EditPatient = async (req, res ) => {
    try {
      const requiredFields = [
        'HN',
        'prefix',
        'name',
        'surname',
        'gender',
        'DOB'
      ];

      checkfield(requiredFields,req);

      const firestoreTimestamp = dateToFirestoreTimestamp(req.body.DOB);
      req.body.DOB = firestoreTimestamp;

      const response = await db.collection('patients').doc(req.body.HN).update(req.body);

      res.status(200).send('success');
    } catch (error) {
      res.status(500).send(error.message);
    }
}


// get patient info 
const FindPatient = async (req, res) => {
  try {
    const { HN } = req.query;
    let patientsRef = db.collection('patients');
    let snapshot;

    if (!HN) {
      // Default search: Fetch random data ordered by the latest update
      snapshot = await patientsRef.limit(15).get();
    } else {
      // Search with the HN parameter
      snapshot = await patientsRef.where('HN', '==', HN).get();
    }

    const patients = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Convert Firestore timestamp fields to JavaScript Date
      if (data.DOB) {
        data.DOB = firestoreTimestampToDateInUTCPlus7(data.DOB, 'DOB');
      }
      patients.push({ id: doc.id, ...data });
    });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).send(error.message);
  }
};



// delete patient info
const DelPatient = async (req, res ) => {
  try {
    const requiredFields = [
      'HN', 
    ];
    checkfield(requiredFields, req);

    await db.collection('patients').doc(req.body.HN).delete();
    res.status(200).send("delete success");

  } catch (error) {
    res.status(500).send(error.message);
  }
}


// Add new record
const AddRecord = async (req, res) => {
  try {
    const requiredFields = [
      'HN',                    // Hospital Number
      'BT',                    // Body Temperature: "ไม่มีไข้", "ไข้ต่ำ", "ไข้สูง"
      'BP',                    // Blood Pressure: "ปกติ", "ต่ำ", "สูง"
      'HR',                    // Heart Rate: "ปกติ", "ช้า", "เร็ว"
      'RR',                    // Respiratory Rate: "ปกติ", "ช้า", "เร็ว"
      'O2sat',                 // Oxygen Saturation: "ปกติ", "ต่ำ"
      'conscious',             // Level of Consciousness: "ตื่น รู้สึกตัวดี", "หลับ", "ซึม", "สับสน", "ไม่รู้สึกตัว"
      'breath_pattern',        // Breathing Pattern: "หายใจปกติ", "หายใจช้า", "หายใจเร็ว หายใจหอบเหนื่อย"
      'eat_method',            // Eating Method: "รับประทานเองได้", "ใส่สายยางให้อาหาร"
      'food_type',             // Food Type: "นมแม่", "นมผสม", "อาหารปกติ", "อาหารอ่อน", "อาหารเหลว"
      'food_intake',           // Food Intake (multiple choice): should be an array
      'sleep',                 // Sleep Pattern: "นอนหลับได้", "หลับๆตื่นๆ", "นอนไม่หลับ"
      'excretion',             // Excretion: "ดี", "ไม่ดี"
    ];

    checkfield(requiredFields, req);

    const current_time = Timestamp.now();
    const recordData = {
      timestamp: current_time,
      BT: req.body.BT,
      BP: req.body.BP,
      HR: req.body.HR,
      RR: req.body.RR,
      O2sat: req.body.O2sat,
      conscious: req.body.conscious,
      breath_pattern: req.body.breath_pattern,
      extra_symptoms: req.body.extra_symptoms ? req.body.extra_symptoms : null , // Additional symptoms (text input)
      eat_method: req.body.eat_method,
      food_type: req.body.food_type,
      extra_food: req.body.extra_food ? req.body.extra_food : null, // Additional food info (text input)
      food_intake: req.body.food_intake, // Array of strings
      sleep: req.body.sleep,
      excretion: req.body.excretion,
      notes: req.body.notes ? req.body.notes : null // Additional notes (text input)
    }; 
    
    const docId = `rec_${firestoreTimestampToDateInUTCPlus7(current_time, "noplus")}`;
    // const docId = `rec_${current_time}`;

    await db.collection('patients').doc(req.body.HN).collection('records').doc(docId).set(recordData);

    res.status(200).send(docId);
  } catch (error) {
    res.status(500).send(error.message);
  }
}



// edit record
const EditRecord = async (req, res ) => {
  try {
    const requiredFields = [
      'HN',                    // Hospital Number
      'docId'                 // docId in 
    ];

    checkfield(requiredFields, req);

    const HN = req.body.HN;
    const Id = req.body.docId;
    delete req.body.HN;
    delete req.body.docId;

    await db.collection('patients').doc(HN).collection('records').doc(Id).update(req.body);

    res.status(200).send("edit success");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// delete record
const DelRecord = async (req, res ) => {
  try {
    const requiredFields = [
      'HN', 
      'docId',                    // Hospital Number
    ];
    checkfield(requiredFields, req);

    await db.collection('patients').doc(req.body.HN).collection('records').doc(req.body.Id).delete();
    res.status(200).send("delete success");

  } catch (error) {
    res.status(500).send(error.message);
  }
}

// get all records
const GetRecord = async (req, res ) => {
  try {
      const { HN } = req.query;
      let patientsRef = db.collection('patients');
      let snapshot;

      if (!HN) {
        // Default search: Fetch random data ordered by the latest update
        res.status(404).send("No HN record found")
      } else {
        // Search with the HN parameter
        snapshot = await patientsRef.doc(HN).collection('records').get();
      }

      const records = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // Convert Firestore timestamp fields to JavaScript Date
        if (data.timestamp) {
          data.timestamp = firestoreTimestampToDateInUTCPlus7(data.timestamp, 'date');
        }
        records.push({ id: doc.id, ...data });
      });

      res.status(200).json(records);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const readfile = async (req, res) => {
  try {
    // List all files in the specified folder within the bucket
    const [files] = await storage.bucket('i-care-u.appspot.com').getFiles({
      prefix: 'general_info/',
    });

    // Filter out any entries that are not actual files (e.g., directories)
    const actualFiles = files.filter(file => !file.name.endsWith('/'));

    if (actualFiles.length === 0) {
      return res.status(404).send('No files found in the specified folder.');
    }

    // Select a random file from the list of actual files
    const randomFile = actualFiles[Math.floor(Math.random() * actualFiles.length)];
    console.log(`Selected random file: ${randomFile.name}`);

    // Make the file public and get its URL
    await randomFile.makePublic();
    const url = randomFile.publicUrl();

    res.status(200).send(url);
  } catch (error) {
    console.error('Error reading file', error);
    res.status(500).send({ error: error.message });
  }
};

//template
// const functionname = async (req, res ) => {
//   try {
      
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// }
module.exports = { AddPatient, EditPatient, FindPatient , DelPatient ,
                    AddRecord, EditRecord, DelRecord, GetRecord , readfile
};
