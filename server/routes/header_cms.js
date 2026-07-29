const router = require("express").Router();
const ctrl = require("../controllers/header_cms");
const auth = require("../middlewares/auth");

// Get header data
router.get("/", ctrl.get);

// Upsert header data (create or update)
router.put("/", auth.authCheck, ctrl.upsert);

module.exports = router;

