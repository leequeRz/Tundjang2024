const express = require("express");
const patientRoutes = require("./routes/patientRoutes");
const recordRoutes = require("./routes/recordRoutes");
const userRoutes = require("./routes/userRoutes");

const router = express.Router();

router.use(patientRoutes);
router.use(recordRoutes);
router.use(userRoutes);

module.exports = router;
