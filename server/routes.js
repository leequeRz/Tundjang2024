const express = require("express");
const customerRoutes = require("./routes/customerRoutes");
const recordRoutes = require("./routes/recordRoutes");
const userRoutes = require("./routes/userRoutes");

const router = express.Router();

router.use(customerRoutes);
router.use(recordRoutes);
router.use(userRoutes);

module.exports = router;
