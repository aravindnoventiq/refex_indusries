const router = require("express").Router();
const ctrl = require("../controllers/green_mobility_cms");
const auth = require("../middlewares/auth");

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, ctrl.hero.upsert);

// Who We Are
router.get("/who-we-are", ctrl.whoWeAre.get);
router.put("/who-we-are", auth.authCheck, ctrl.whoWeAre.upsert);

// Brand Values
router.get("/brand-values", ctrl.brandValues.list);
router.post("/brand-values", auth.authCheck, ctrl.brandValues.create);
router.put("/brand-values/:id", auth.authCheck, ctrl.brandValues.update);
router.delete("/brand-values/:id", auth.authCheck, ctrl.brandValues.remove);

// Why Choose Us
router.get("/why-choose-us", ctrl.whyChooseUs.list);
router.post("/why-choose-us", auth.authCheck, ctrl.whyChooseUs.create);
router.put("/why-choose-us/:id", auth.authCheck, ctrl.whyChooseUs.update);
router.delete("/why-choose-us/:id", auth.authCheck, ctrl.whyChooseUs.remove);

// Services
router.get("/services", ctrl.services.list);
router.post("/services", auth.authCheck, ctrl.services.create);
router.put("/services/:id", auth.authCheck, ctrl.services.update);
router.delete("/services/:id", auth.authCheck, ctrl.services.remove);

// Impacts (Our Impact)
router.get("/impacts", ctrl.impacts.list);
router.post("/impacts", auth.authCheck, ctrl.impacts.create);
router.put("/impacts/:id", auth.authCheck, ctrl.impacts.update);
router.delete("/impacts/:id", auth.authCheck, ctrl.impacts.remove);

// Our Services
router.get("/our-services", ctrl.ourServices.list);
router.post("/our-services", auth.authCheck, ctrl.ourServices.create);
router.put("/our-services/:id", auth.authCheck, ctrl.ourServices.update);
router.delete("/our-services/:id", auth.authCheck, ctrl.ourServices.remove);

// Clients
router.get("/clients", ctrl.clients.list);
router.post("/clients", auth.authCheck, ctrl.clients.create);
router.put("/clients/:id", auth.authCheck, ctrl.clients.update);
router.delete("/clients/:id", auth.authCheck, ctrl.clients.remove);

// Sustainability
router.get("/sustainability", ctrl.sustainability.get);
router.put("/sustainability", auth.authCheck, ctrl.sustainability.upsert);

// Testimonials
router.get("/testimonials", ctrl.testimonials.list);
router.post("/testimonials", auth.authCheck, ctrl.testimonials.create);
router.put("/testimonials/:id", auth.authCheck, ctrl.testimonials.update);
router.delete("/testimonials/:id", auth.authCheck, ctrl.testimonials.remove);

module.exports = router;

