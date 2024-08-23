const axios = require("axios");
const config = require("../config/lineConfig");
const {
	readFile
} = require("../controllers/fileController");
const {
	FindPatient,
} = require("../controllers/patientController");
const {
	GetRecord,
} = require("../controllers/recordController");


const userStates = {};

module.exports = async (req, res) => {
	try {
		const events = req.body.events;

		for (const event of events) {
			if (event.type === "message" && event.message.type === "text") {
				const userId = event.source.userId;
				const messageText = event.message.text;
				const replyToken = event.replyToken;

				console.log(`Received message from ${userId}: ${messageText}`);

				if (messageText === "โรคทั่วไป & อาการผิดปกติ") {
					await handleGeneralInfoRequest(userId, replyToken, req, res);
				} else if (messageText === "ติดต่อ") {
					await handleContactRequest(userId, replyToken);
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

const handleGeneralInfoRequest = async (userId, replyToken, req, res) => {
	try {
		delete userStates[userId];
		
		// Use the readFile function from fileController.js
		const readFileResponse = await readFile();

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
	const phoneNumber = "0123456789";
	const responseMessage = {
		type: "template",
		altText: "Contact us",
		template: {
			type: "buttons",
			text: `ติดต่อได้ที่ ${phoneNumber} (เวลาราชการเท่านั้น)`,
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
		const [hncodefault, dob] = messageText.split('\n').map(line => line.trim());
		const hnCode = hncodefault.trim().toUpperCase();

		// Prepare the request to the patient controller
		// const patientResponse = await FindPatient({
		// 	query: { HN: hnCode, DOB: dob },
		// });

		const patientResponse = await axios.get('https://icareu-api.vercel.app/api/v1/patient', {
			params: {
			  HN: hnCode,
			  DOB: dob
			}
		  });

		const patientData = patientResponse[0];

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
					headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
				}
			);
			return;
		}

		// Get patient records using the record controller
		// const recordsResponse = await GetRecord({ params: { HN: hnCode } });

		const recordsResponse = await axios.get(`https://icareu-api.vercel.app/api/v1/patient/${hnCode}/record`);

		// Process the records and format the response
		if (recordsResponse.length > 0) {
			const latestRecord = recordsResponse.sort(
				(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
			)[0];

			// Format the food intake string
			const foodIntakeStr = latestRecord.food_intake ? latestRecord.food_intake.join(", ") : " ";
			const age = getAge(patientData.DOB);


			// Prepare the response message
			const latestRecordMessage = `
HN: ${hnCode} DOB: ${patientData.DOB}
${patientData.prefix} ${patientData.name} ${patientData.surname} เพศ${patientData.gender} อายุ ${age}
อาการประจำวันนี้ ${new Date(latestRecord.timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}

1. สัญญาณชีพ : ${latestRecord.BT}, ความดันโลหิต: ${latestRecord.BP}, หัวใจเต้นเร็ว: ${latestRecord.HR}, หายใจเร็ว: ${latestRecord.RR}, ค่าออกซิเจน: ${latestRecord.O2sat}
2. อาการเบื้องต้น : รู้สึกตัว: ${latestRecord.conscious}, หายใจ: ${latestRecord.breath_pattern}, กินอาหาร: ${latestRecord.eat_method} ไม่มีอาการแทรกซ้อน: ${latestRecord.extra_symptoms || "ไม่มี"}, นอนหลับดี: ${latestRecord.sleep}, ร้องไห้เวลาหิว: ${latestRecord.extra_food || "ไม่มี"}, ถ่าย: ${latestRecord.excretion || "ปกติ"}
3. หมายเหตุ: ${latestRecord.notes + latestRecord.extra_symptoms + foodIntakeStr|| "ไม่มี"}
            `.trim();

			// const latestRecordMessage = `
			// 	ข้อมูลล่าสุดของคุณ ${patientData.name} ${patientData.surname} รหัสประจำตัวผู้ป่วย ${hnCode}
			// 	อัปเดตล่าสุดเมื่อ: ${new Date(latestRecord.timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
			// 	ข้อมูลทั่วไป: อุณหภูมิ: ${latestRecord.BT} ความดันโลหิต: ${latestRecord.BP} อัตราการเต้นของหัวใจ: ${latestRecord.HR} อัตราการหายใจ: ${latestRecord.RR} ค่าออกซิเจนในเลือด: ${latestRecord.O2sat}
			// 	อาการเบื้องต้น: 
			// 	- ระดับความรู้สึกตัว: ${latestRecord.conscious}
			// 	- ลักษณะการหายใจ: ${latestRecord.breath_pattern}
			// 	- อาการเพิ่มเติม: ${latestRecord.extra_symptoms || "ไม่มี"}
			// 	รูปแบบการรับประทานอาหาร:
			// 	- ${latestRecord.eat_method}
			// 	- ประเภทอาหาร: ${latestRecord.food_type} ${latestRecord.extra_food || " "}
			// 	- ${foodIntakeStr}
			// 	การนอนหลับ: ${latestRecord.sleep}
			// 	การขับถ่าย: ${latestRecord.excretion}
			// 	หมายเหตุ: ${latestRecord.notes || "N/A"}
			// `;

			// Send the formatted message as a response
			await axios.post(
				"https://api.line.me/v2/bot/message/reply",
				{
					replyToken,
					messages: [{ type: "text", text: latestRecordMessage.trim() }],
				},
				{
					headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
				}
			);
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
					headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
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
	const responseMessage = 
	`โปรดกรอกรหัส HN และวันเดือนปีเกิด เช่น 
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

const getAge = (dob) => {
	const dobDate = new Date(dob);
	const diffMs = Date.now() - dobDate.getTime();
	const ageDate = new Date(diffMs); 
	return Math.abs(ageDate.getUTCFullYear() - 1970);
  };