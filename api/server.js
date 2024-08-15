const express = require('express')
const swaggerSpecs = require('./swaggerConfig');
const swaggerUi = require('swagger-ui-express');
const router = require('./Routes/Routes');
const app = express()
const core = require('cors');
// const line = require('@line/bot-sdk');
// const { Client } = require('@line/bot-sdk');
const axios = require('axios');
require('./Routes/Routes');
require('dotenv').config();

const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret:  process.env.LINE_SECRET_TOKEN
}


app.use(core());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(line.middleware(lineConfig));


app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/v1', router)


const userStates = {};

app.post('/api/webhook', async (req, res) => {
    try {
      const events = req.body.events;
  
      for (const event of events) {
        
        if (event.type === 'message' && event.message.type === 'text') {
          const userId = event.source.userId;
          const messageText = event.message.text;
          const replyToken = event.replyToken;

          console.log(`Received message from ${userId}: ${messageText}`);
    
          if (messageText === 'โรคทั่วไป & อาการผิดปกติ') {
            try {

                if (userStates[userId]) delete userStates[userId];
                const resImg = await axios.get('https://icareu.vercel.app/api/v1/line/general-info');
                const imageUrl = resImg.data.imageUrl;
                // const imageUrl = response.data; // Assuming the API returns a URL of an image
                const responseMessage = { type: 'image', originalContentUrl: imageUrl, previewImageUrl: imageUrl };
              // const imageUrl = 'https://www.prydwen.gg/static/4d91060488554694e8c1ec47c078db4a/b26e2/17_card.webp'
                console.log('message->> ', responseMessage)

              await axios.post('https://api.line.me/v2/bot/message/reply', {
                replyToken,
                messages: [responseMessage]
              }, {
                headers: { Authorization: `Bearer ${lineConfig.channelAccessToken}` }
              });

              return res.status(200).end();
            } catch (error) {
              console.error('Error sending image:', error); // Log any error
              const responseMessage = { type: 'text', text: 'เกิดข้อผิดพลาดในขณะนี้ กรุณาลองใหม่อีกครั้ง ขออภัยในความไม่สะดวกค่ะ' };
              await axios.post('https://api.line.me/v2/bot/message/reply', {
                replyToken,
                messages: [responseMessage]
              }, {
                headers: { Authorization: `Bearer ${lineConfig.channelAccessToken}` }
              });
              return res.status(200).end();
            }
          } else if (messageText === 'ติดต่อ') {
            if (userStates[userId]) delete userStates[userId];
            const phoneNumber = '0123456789';
            responseMessage = {
                type: 'template',
                altText: 'Contact us',
                template: {
                  type: 'buttons',
                  text: 'ติดต่อได้ที่ ' + phoneNumber + ' (เวลาราชการเท่านั้น)',
                  actions: [
                    {
                      type: 'uri',
                      label: 'Call us',
                      uri: `tel:${phoneNumber}`
                    }
                  ]
                }
              };

              return await axios.post('https://api.line.me/v2/bot/message/reply', {
                replyToken,
                messages: [responseMessage]
              }, {
                headers: { Authorization: `Bearer ${lineConfig.channelAccessToken}` }
              });

          } else if (userStates[userId] && userStates[userId] === 'awaitingHN') {
            // User has responded with their HN
            const hnCode = messageText.trim().toUpperCase();
            
            // Process the HN (you might want to perform some validation here)
            console.log(`Received HN: ${hnCode} from user ${userId}`);

            const patient = await axios.get('https://icareu.vercel.app/api/v1/patients/get', {
              params: {
                HN: hnCode
              }
            });


            const patientData = patient.data[0];

            if(patientData == 'undefined' || patientData == null)
            {
              return await axios.post('https://api.line.me/v2/bot/message/reply', {
                replyToken,
                messages: [
                  { type: 'text', text: 'ขออภัยค่ะ ไม่พบข้อมูลประวัติผู้ป่วย หรือรหัสประจำตัวผู้ป่วยไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' } // Confirm receipt of the HN
                ]
              }, {
                headers: { Authorization: `Bearer ${lineConfig.channelAccessToken}` }
              });
            }else{

              const response = await axios.get('https://icareu.vercel.app/api/v1/patients/record', {
                params: {
                  HN: hnCode
                }
              });
  
              console.log(response.data);
              if( response.data != null) 
              {

                const records = response.data;
  
              // Sort the records by timestamp in descending order and get the latest one
              const latestRecord = records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
              let foodIntakeStr = ' '
              if( latestRecord.food_intake == null || latestRecord.food_intake == 'undefined')
              foodIntakeStr = latestRecord.food_intake.length > 0 ? latestRecord.food_intake.join(', ') : ' ';
  
              const latestRecordMessage = `
              ข้อมูลล่าสุดของคุณ ${patientData.name} ${patientData.surname} รหัสประจำตัวผู้ป่วย ${hnCode}
              อัปเดตล่าสุดเมื่อ: ${new Date(latestRecord.timestamp)}
              ข้อมูลทั่วไป: อุณหภูมิ:${latestRecord.BT} ความดันโลหิต:${latestRecord.BP} อัตราการเต้นของหัวใจ:${latestRecord.HR} อัตราการหายใจ:${latestRecord.RR} ค่าออกซิเจนในเลือด:${latestRecord.O2sat}
              อาการเบื้องต้น
              - ระดับความรู้สึกตัว: ${latestRecord.conscious }
              - ลักษณะการหายใจ: ${latestRecord.breath_pattern}
              - อาการเพิ่มเติม: ${latestRecord.extra_symptoms || 'ไม่มี'}
              รูปแบบการรับประทานอาหาร
              - ${latestRecord.eat_method}
              - ประเภทอาหาร: ${latestRecord.food_type } ${'เช่น ' + latestRecord.extra_food || ' '}
              - ${foodIntakeStr}
              การนอนหลับ: ${latestRecord.sleep}
              การขับถ่าย: ${latestRecord.excretion}
              หมายเหตุ: ${latestRecord.notes || 'N/A'}
            `;
  
              // Clear the user's state
              delete userStates[userId];
  
              // Send confirmation message
              await axios.post('https://api.line.me/v2/bot/message/reply', {
                replyToken,
                messages: [
                  { type: 'text', text: latestRecordMessage.trim() } // Confirm receipt of the HN
                ]
              }, {
                headers: { Authorization: `Bearer ${lineConfig.channelAccessToken}` }
              });

              }

            }
            

          } else if (messageText === 'ข้อมูลทั่วไป') {
            // User initiated the 'ข้อมูลทั่วไป' flow
            userStates[userId] = 'awaitingHN'; // Set the user's state

            const responseMessage = 'โปรดกรอกรหัส HN เช่น: HN12345 ';

            await axios.post('https://api.line.me/v2/bot/message/reply', {
              replyToken,
              messages: [
                { type: 'text', text: responseMessage } // Ask the user to enter their HN
              ]
            }, {
              headers: { Authorization: `Bearer ${lineConfig.channelAccessToken}` }
            });
          }
  
 
        }
        else{
          return res.status(200).end();
        }
      }
  
      // Respond to LINE to confirm receipt
      return res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).end();
    }
  });

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => { 
    console.log(`Server is running on PORT ${PORT}.`);
    console.log(`Swagger docs are available at http://localhost:${PORT}/api/docs`);
})