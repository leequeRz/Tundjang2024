// firebaseConfig.js
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.TUNDJANG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "i-care-u.appspot.com",
});

const db = admin.firestore();

//ด้านล่างลงมา database เก็บไฟล์ blob ใน firebase storage
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});
const bucket = storage.bucket(admin.storage().bucket().name);

module.exports = { admin, db, bucket, storage };

//แก้
