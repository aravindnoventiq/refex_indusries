const router = require("express").Router();
const ctrl = require("../controllers/venwind_refex_cms");
const auth = require("../middlewares/auth");

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, ctrl.hero.upsert);

// Who We Are
router.get("/who-we-are", ctrl.whoWeAre.get);
router.put("/who-we-are", auth.authCheck, ctrl.whoWeAre.upsert);

// Why Choose Us
router.get("/why-choose-us", ctrl.whyChooseUs.list);
router.post("/why-choose-us", auth.authCheck, ctrl.whyChooseUs.create);
router.put("/why-choose-us/:id", auth.authCheck, ctrl.whyChooseUs.update);
router.delete("/why-choose-us/:id", auth.authCheck, ctrl.whyChooseUs.remove);

// Technical Specs
router.get("/technical-specs", ctrl.technicalSpecs.list);
router.post("/technical-specs", auth.authCheck, ctrl.technicalSpecs.create);
router.put("/technical-specs/:id", auth.authCheck, ctrl.technicalSpecs.update);
router.delete("/technical-specs/:id", auth.authCheck, ctrl.technicalSpecs.remove);

// Visit Website
router.get("/visit-website", ctrl.visitWebsite.get);
router.put("/visit-website", auth.authCheck, ctrl.visitWebsite.upsert);

module.exports = router;

