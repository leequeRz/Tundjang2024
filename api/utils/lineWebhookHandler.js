const axios = require("axios");
const config = require("../config/lineConfig");

const userStates = {};

module.exports = async (req, res) => {
	try {
		const events = req.body.events;

		for (const event of events) {
			if (event.type === "message" && event.message.type === "text") {
				const { userId, replyToken } = event.source;
				const messageText = event.message.text;

				console.log(`Received message from ${userId}: ${messageText}`);

				if (messageText === "โรคทั่วไป & อาการผิดปกติ") {
					await handleGeneralInfoRequest(userId, replyToken);
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

const handleGeneralInfoRequest = async (userId, replyToken) => {
	try {
		delete userStates[userId];
		const resImg = await axios.get(
			"https://icareu.vercel.app/api/v1/line/general-info"
		);
		const imageUrl = resImg.data.imageUrl;
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
	const hnCode = messageText.trim().toUpperCase();
	const patient = await axios.get(
		"https://icareu.vercel.app/api/v1/patients/get",
		{ params: { HN: hnCode } }
	);
	const patientData = patient.data[0];

	if (!patientData) {
		await axios.post(
			"https://api.line.me/v2/bot/message/reply",
			{
				replyToken,
				messages: [
					{
						type: "text",
						text: "ขออภัยค่ะ ไม่พบข้อมูลประวัติผู้ป่วย หรือรหัสประจำตัวผู้ป่วยไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
					},
				],
			},
			{
				headers: { Authorization: `Bearer ${config.line.channelAccessToken}` },
			}
		);
		return;
	}

	const response = await axios.get(
		"https://icareu.vercel.app/api/v1/patients/record",
		{ params: { HN: hnCode } }
	);
	if (response.data) {
		const records = response.data;
		const latestRecord = records.sort(
			(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
		)[0];
		const foodIntakeStr = latestRecord.food_intake
			? latestRecord.food_intake.join(", ")
			: " ";

		const latestRecordMessage = `
            ข้อมูลล่าสุดของคุณ ${patientData.name} ${
			patientData.surname
		} รหัสประจำตัวผู้ป่วย ${hnCode}
            อัปเดตล่าสุดเมื่อ: ${new Date(latestRecord.timestamp)}
            ข้อมูลทั่วไป: อุณหภูมิ:${latestRecord.BT} ความดันโลหิต:${
			latestRecord.BP
		} อัตราการเต้นของหัวใจ:${latestRecord.HR} อัตราการหายใจ:${
			latestRecord.RR
		} ค่าออกซิเจนในเลือด:${latestRecord.O2sat}
            อาการเบื้องต้น
            - ระดับความรู้สึกตัว: ${latestRecord.conscious}
            - ลักษณะการหายใจ: ${latestRecord.breath_pattern}
            - อาการเพิ่มเติม: ${latestRecord.extra_symptoms || "ไม่มี"}
            รูปแบบการรับประทานอาหาร
            - ${latestRecord.eat_method}
            - ประเภทอาหาร: ${latestRecord.food_type} ${
			latestRecord.extra_food || " "
		}
            - ${foodIntakeStr}
            การนอนหลับ: ${latestRecord.sleep}
            การขับถ่าย: ${latestRecord.excretion}
            หมายเหตุ: ${latestRecord.notes || "N/A"}
        `;

		delete userStates[userId];

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
		delete userStates[userId];
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
	const responseMessage = "โปรดกรอกรหัส HN เช่น: HN12345 ";

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
