const { storage } = require("../config/firebaseConfig");

const readFile = async (req, res) => {
	try {
		const [files] = await storage
			.bucket("i-care-u.appspot.com")
			.getFiles({ prefix: "general_info/" });
		const actualFiles = files.filter((file) => !file.name.endsWith("/"));

		if (actualFiles.length === 0) {
			return res.status(404).send("No files found in the specified folder.");
		}

		const randomFile =
			actualFiles[Math.floor(Math.random() * actualFiles.length)];
		await randomFile.makePublic();
		const url = randomFile.publicUrl();

		res.status(200).json({ imageUrl: url });
	} catch (error) {
		console.error("Error reading file", error);
		res.status(500).send({ error: error.message });
	}
};

module.exports = { readFile };
