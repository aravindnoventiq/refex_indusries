const express = require("express");
const ctrl = require("../controllers/careers_cms");

const router = express.Router();

router.get("/", ctrl.get);
router.put("/", ctrl.upsert);

module.exports = router;
