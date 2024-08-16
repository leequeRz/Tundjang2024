const express = require("express");
const patientRoutes = require("./routes/patientRoutes");
const recordRoutes = require("./routes/recordRoutes");
const userRoutes = require("./routes/userRoutes");

const router = express.Router();

router.use("/patients", patientRoutes);
router.use("/records", recordRoutes);
router.use("/users", userRoutes);

module.exports = router;
