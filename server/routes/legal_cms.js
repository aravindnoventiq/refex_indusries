const express = require("express");
const ctrl = require("../controllers/legal_cms");

const router = express.Router();

router.get("/", ctrl.list);
router.get("/:slug", ctrl.getBySlug);
router.put("/:slug", ctrl.upsert);

module.exports = router;
