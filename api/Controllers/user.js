const crypto = require('crypto');
const { db } = require('../config_db/firebaseConfig');


const multer = require('multer');



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

//create new user 
const create = async (req, res ) => {
    try {
        const requiredFields = [
            'password',
            'username',
            'user_type'
          ];
      
          checkfield(requiredFields, req);
  
        //   const checkUsername = await db.collection('users').where('username', "==", req.body.username).get();
                
        //   if( !checkUsername.empty ) { 
        //       return res.status(409).json( { 
        //           message: 'Has a duplicated username'
        //         });
        //   }
      
          const userData = {
            'username':  req.body.username,
            'password':  hashData(req.body.password),
            'user_type': req.body.user_type
          }
      
          
          const response = await db.collection('users').doc(req.body.username).create(userData);
        
          res.status(200).send('Register user success');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//log in user
const login = async (req, res) => {
    try{
        const requiredFields = [
          'username',
          'password'
        ];
    
        checkfield(requiredFields, req);
        console.log(req.body)
  
        const checkLogin = await db.collection('users').where("username","==",req.body.username)
                                                           .where("password","==",hashData(req.body.password)).get();
                                                
        
        if( checkLogin.empty ) { 
          return res.status(401).send("Wrong username or password");
          }

        console.log( checkLogin.docs.values() )
        //   let userData;
        //   let Docid;
        //   checkLogin.forEach(doc => {
        //       userData = doc.data();
        //       Docid = doc.id;
        //   });
          
        //   const userInfo = {
        //       "org_name": userData.org_name,
        //       "org_phone": userData.org_phone,
        //       "org_address": userData.org_address,
        //       "contact_person": userData.contact_person,
        //       "org_id": Docid
        //   };
          
  
        res.status(200).send('success');
      }catch(error){
        res.status(500).send(error.message);
      }
}
//edit user
const edit = async (req, res) => {
    
}

//delete user
const del = async (req, res) => {
  try {
    const requiredFields = [
      'username',
      'password' 
    ];
    checkfield(requiredFields, req);

    await db.collection('users').where("username","==",req.body.username)
    .where("password","==",hashData(req.body.password)).delete();
    res.status(200).send("delete success");

  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = { create , login , edit , del};
