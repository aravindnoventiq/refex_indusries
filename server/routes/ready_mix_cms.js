const router = require("express").Router();
const ctrl = require("../controllers/ready_mix_cms");
const auth = require("../middlewares/auth");

router.get("/", ctrl.get);
router.put("/", auth.authCheck, ctrl.upsert);

module.exports = router;
