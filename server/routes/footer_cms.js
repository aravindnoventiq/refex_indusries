const router = require("express").Router();
const ctrl = require("../controllers/footer_cms");
const auth = require("../middlewares/auth");

// Get footer data
router.get("/", ctrl.get);

// Upsert footer data (create or update)
router.put("/", auth.authCheck, ctrl.upsert);

module.exports = router;

