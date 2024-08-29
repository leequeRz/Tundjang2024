const { storage } = require("../config/firebaseConfig");

const readFile = async () => {
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

		return { imageUrl: url }; // Return the result instead of sending it via res
	} catch (error) {
		console.error("Error reading file", error);
		throw new Error("Failed to read file: " + error.message); 
	}
};

module.exports = { readFile };
