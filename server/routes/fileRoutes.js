// general info random pic
/**
 * @swagger
 * /api/v1/line/general-info:
 *   get:
 *     summary: Retrieve a random file URL from a specific folder in Google Cloud Storage.
 *     description: This endpoint lists all files in a specified folder within a Google Cloud Storage bucket, selects a random file, makes it public, and returns its public URL.
 *     tags:
 *       - Files
 *     responses:
 *       200:
 *         description: Successfully retrieved the public URL of a random file.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: https://storage.googleapis.com/your-bucket-name/path/to/random-file.jpg
 *       404:
 *         description: No files found in the specified folder.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No files found in the specified folder.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error reading file
 */
