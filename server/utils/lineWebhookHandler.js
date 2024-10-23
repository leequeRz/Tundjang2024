const axios = require("axios");
const config = require("../config/lineConfig");
const { readFile } = require("../controllers/fileController");
const { FindCustomer } = require("../controllers/customerController");
const { GetRecord } = require("../controllers/recordController");

const userStates = {};
const pictueSelected = {};

module.exports = async (req, res) => {
  try {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userId = event.source.userId;
        const messageText = event.message.text;
        const replyToken = event.replyToken;

        console.log(`Received message from ${userId}: ${messageText}`);

        if (messageText === "ติดต่อ") {
          await handleContactRequest(userId, replyToken);
        } else if (pictueSelected[userId] === "awaitingNumber") {
          await handleGeneralInfoRequest(
            userId,
            replyToken,
            req,
            res,
            messageText
          );
        } else if (messageText === "โรคทั่วไป & อาการผิดปกติ") {
          await promptForPictureNumber(userId, replyToken);
        } else if (userStates[userId] === "awaitingHN") {
          await handleHNRequest(userId, replyToken, messageText);
        } else if (messageText === "ข้อมูลทั่วไป") {
          await promptForHN(userId, replyToken);
        } else {
          return res.status(200).end();
        }
      }
    }

    return res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).end();
  }
};

const handleGeneralInfoRequest = async (
  userId,
  replyToken,
  req,
  res,
  messageText
) => {
  try {
    delete userStates[userId];
    delete pictueSelected[userId];

    // Use the readFile function from fileController.js
    const number = messageText.trim();
    const readFileResponse = await readFile(number);

    const imageUrl = readFileResponse.imageUrl;
    const responseMessage = {
      type: "image",
      originalContentUrl: imageUrl,
      previewImageUrl: imageUrl,
    };

    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      { replyToken, messages: [responseMessage] },
      {
        headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
      }
    );
  } catch (error) {
    console.error("Error sending image:", error);
    const responseMessage = {
      type: "text",
      text: "เกิดข้อผิดพลาดในขณะนี้ กรุณาลองใหม่อีกครั้ง ขออภัยในความไม่สะดวกค่ะ",
    };
    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      { replyToken, messages: [responseMessage] },
      {
        headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
      }
    );
  }
};

const handleContactRequest = async (userId, replyToken) => {
  delete userStates[userId];
  delete pictueSelected[userId];
  const phoneNumber = "0801529199";
  const responseMessage = {
    type: "template",
    altText: "Contact us",
    template: {
      type: "buttons",
      text: `ติดต่อได้ที่ ${phoneNumber} (ในเวลา 08:00 - 16:00 น.)`,
      actions: [{ type: "uri", label: "Call us", uri: `tel:${phoneNumber}` }],
    },
  };

  await axios.post(
    "https://api.line.me/v2/bot/message/reply",
    { replyToken, messages: [responseMessage] },
    {
      headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
    }
  );
};

const handleHNRequest = async (userId, replyToken, messageText) => {
  try {
    // Split the message text by newline to extract HN and DOB
    const [hncodefault, dob] = messageText
      .split("\n")
      .map((line) => line.trim());
    const hnCode = hncodefault.trim().toUpperCase();

    // Prepare the request to the patient controller
    // const patientResponse = await FindPatient({
    // 	query: { HN: hnCode, DOB: dob },
    // });

    const patientResponse = await axios.get(
      "https://icareu-api.vercel.app/api/v1/patient",
      {
        params: {
          HN: hnCode,
          DOB: dob,
        },
      }
    );

    const patientData = patientResponse.data[0];

    if (!patientData) {
      // If no patient found, send a reply indicating this
      await axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
          replyToken,
          messages: [
            {
              type: "text",
              text: "ขออภัยค่ะ ไม่พบข้อมูลประวัติผู้ป่วย หรือรหัสประจำตัวผู้ป่วยและวันเดือนปีเกิดไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${config.line.channelAccessToken}`,
          },
        }
      );
      return;
    }

    // Get patient records using the record controller
    // const recordsResponse = await GetRecord({ params: { HN: hnCode } });

    const recordsResponse = await axios.get(
      `https://icareu-api.vercel.app/api/v1/patient/${hnCode}/record`
    );

    // Process the records and format the response
    if (recordsResponse.data.length > 0) {
      const latestRecord = recordsResponse.data.sort(
        (a, b) => new Date(b.create_time) - new Date(a.create_time)
      )[0];

      // Format the array list to string
      // const foodIntakeStr = latestRecord.food_intake ? latestRecord.food_intake.join(", ") : " ";
      // const excretionStr = latestRecord.excretion ? latestRecord.excretion.join(", ") : " ";
      const age = getAge(patientData.DOB);

      // Prepare the response message
      const latestRecordMessage = `
HN: ${hnCode} DOB: ${patientData.DOB}
${patientData.prefix} ${patientData.name} ${patientData.surname} เพศ${
        patientData.gender
      } อายุ ${age}
อาการประจำวันนี้ ${new Date(latestRecord.create_time)}

1. สัญญาณชีพ
   อุณหภูมิกาย : ${latestRecord.BT}
   ความดันโลหิต : ${latestRecord.BP}
   อัตราการเต้นของหัวใจ : ${latestRecord.HR}
   อัตราการหายใจ : ${latestRecord.RR}
   ค่าออกซิเจนในเลือด : ${latestRecord.O2sat}
2. อาการเบื้องต้น = ${latestRecord.conscious} , ${
        latestRecord.breath_pattern
      } , ${latestRecord.phlegm} , ${latestRecord.eat_method} , ${
        latestRecord.food_type
      } , ${latestRecord.food_intake} , ${latestRecord.sleep} , ปัสสาวะ ${
        latestRecord.urine_num || 0
      } ครั้ง อุจจาระ ${latestRecord.stool_num || 0} ครั้ง ${
        latestRecord.excretion
      }
3. หมายเหตุ:   ${latestRecord.notes || " ไม่มี"}
            `.trim();

      // Send the formatted message as a response
      await axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
          replyToken,
          messages: [{ type: "text", text: latestRecordMessage.trim() }],
        },
        {
          headers: {
            Authorization: `Bearer ${config.line.channelAccessToken}`,
          },
        }
      );
      // console.log(latestRecordMessage);
    } else {
      // If no records found, inform the user
      const responseMessage = {
        type: "text",
        text: "ไม่พบข้อมูลประวัติการรักษาของผู้ป่วยในระบบค่ะ",
      };
      await axios.post(
        "https://api.line.me/v2/bot/message/reply",
        { replyToken, messages: [responseMessage] },
        {
          headers: {
            Authorization: `Bearer ${config.line.channelAccessToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error in handleHNRequest:", error);
    const responseMessage = {
      type: "text",
      text: "เกิดข้อผิดพลาดในขณะนี้ กรุณาลองใหม่อีกครั้ง ขออภัยในความไม่สะดวกค่ะ",
    };
    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      { replyToken, messages: [responseMessage] },
      {
        headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
      }
    );
  }
};

const promptForHN = async (userId, replyToken) => {
  userStates[userId] = "awaitingHN";
  delete pictueSelected[userId];
  const responseMessage = `โปรดกรอกรหัส HN และวันเดือนปีเกิด เช่น 
	HN12345
	01/01/2567
	`;

  await axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken,
      messages: [{ type: "text", text: responseMessage }],
    },
    {
      headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
    }
  );
};

const promptForPictureNumber = async (userId, replyToken) => {
  pictueSelected[userId] = "awaitingNumber";
  const responseMessage = `กดพิมพ์เลือกหมายเลขที่ท่านต้องการข้อมูล
1.ภาวะหายใจลำบากเฉียบพลัน
2.ภาวะติดเชื้อในกระแสเลือด
3.โรคปอดอักเสบ
4.โรคหัวใจพิการแต่กำเนิด
5.โรคแพ้ภูมิตนเอง`;

  await axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken,
      messages: [{ type: "text", text: responseMessage }],
    },
    {
      headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
    }
  );
};

const getAge = (dob) => {
  const dobDate = new Date(dob);
  const diffMs = Date.now() - dobDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
