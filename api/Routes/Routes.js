const express = require('express')
const router = express.Router()

const formController = require('../Controllers/form')
const userController = require('../Controllers/user')

const multer = require('multer');

const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: 5 * 1024 * 1024 // no larger than 5MB
        },
        fileFilter: (req, file, cb) => {
          const fileTypes = /jpeg|jpg|png/;
          const mimeType = fileTypes.test(file.mimetype);
          const extName = fileTypes.test(file.originalname.split('.').pop().toLowerCase());
          if (mimeType && extName) {
            return cb(null, true);
          }
          cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      });



router.post('/patients/create', formController.AddPatient);
router.put('/patients/update', formController.EditPatient);
router.get('/patients/get',formController.FindPatient);
router.delete('/patients/delete', formController.DelPatient);

router.post('/patients/record', formController.AddRecord);
router.put('/patients/record', formController.EditRecord);
router.get('/patients/record', formController.GetRecord);
router.delete('/patients/record', formController.DelRecord);


router.post('/users/register', userController.create);
router.post('/users/login', userController.login);
router.put('/users/update', userController.edit);
router.delete('/users/delete', userController.del);

router.get('/line/general-info' , formController.readfile)
module.exports = router