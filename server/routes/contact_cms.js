const router = require("express").Router();
const ctrl = require("../controllers/contact_cms");
const auth = require("../middlewares/auth");

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, ctrl.hero.upsert);

// Office Addresses
router.get("/office-addresses", ctrl.officeAddresses.list);
router.post("/office-addresses", auth.authCheck, ctrl.officeAddresses.create);
router.put("/office-addresses/:id", auth.authCheck, ctrl.officeAddresses.update);
router.delete("/office-addresses/:id", auth.authCheck, ctrl.officeAddresses.remove);

// Contact Form
router.get("/form", ctrl.form.get);
router.put("/form", auth.authCheck, ctrl.form.upsert);

module.exports = router;

