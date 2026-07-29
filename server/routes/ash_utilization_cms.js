const router = require("express").Router();
const ctrl = require("../controllers/ash_utilization_cms");
const auth = require("../middlewares/auth");

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, ctrl.hero.upsert);

// Who We Are
router.get("/who-we-are", ctrl.whoWeAre.get);
router.put("/who-we-are", auth.authCheck, ctrl.whoWeAre.upsert);

// Features (Why Choose Us)
router.get("/features", ctrl.features.list);
router.post("/features", auth.authCheck, ctrl.features.create);
router.put("/features/:id", auth.authCheck, ctrl.features.update);
router.delete("/features/:id", auth.authCheck, ctrl.features.remove);

// Impacts (Our Impact)
router.get("/impacts", ctrl.impacts.list);
router.post("/impacts", auth.authCheck, ctrl.impacts.create);
router.put("/impacts/:id", auth.authCheck, ctrl.impacts.update);
router.delete("/impacts/:id", auth.authCheck, ctrl.impacts.remove);

// Services
router.get("/services", ctrl.services.list);
router.post("/services", auth.authCheck, ctrl.services.create);
router.put("/services/:id", auth.authCheck, ctrl.services.update);
router.delete("/services/:id", auth.authCheck, ctrl.services.remove);

// Clients
router.get("/clients", ctrl.clients.list);
router.post("/clients", auth.authCheck, ctrl.clients.create);
router.put("/clients/:id", auth.authCheck, ctrl.clients.update);
router.delete("/clients/:id", auth.authCheck, ctrl.clients.remove);

module.exports = router;

