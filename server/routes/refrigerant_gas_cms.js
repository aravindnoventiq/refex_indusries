const router = require("express").Router();
const ctrl = require("../controllers/refrigerant_gas_cms");
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

// Product Tabs
router.get("/product-tabs", ctrl.productTabs.list);
router.post("/product-tabs", auth.authCheck, ctrl.productTabs.create);
router.put("/product-tabs/:id", auth.authCheck, ctrl.productTabs.update);
router.delete("/product-tabs/:id", auth.authCheck, ctrl.productTabs.remove);

// Product Tab Points
router.get("/product-tab-points", ctrl.productTabPoints.list);
router.post("/product-tab-points", auth.authCheck, ctrl.productTabPoints.create);
router.put("/product-tab-points/:id", auth.authCheck, ctrl.productTabPoints.update);
router.delete("/product-tab-points/:id", auth.authCheck, ctrl.productTabPoints.remove);

// Our Impact
router.get("/impacts", ctrl.impacts.list);
router.post("/impacts", auth.authCheck, ctrl.impacts.create);
router.put("/impacts/:id", auth.authCheck, ctrl.impacts.update);
router.delete("/impacts/:id", auth.authCheck, ctrl.impacts.remove);

// Our Products
router.get("/products", ctrl.products.list);
router.post("/products", auth.authCheck, ctrl.products.create);
router.put("/products/:id", auth.authCheck, ctrl.products.update);
router.delete("/products/:id", auth.authCheck, ctrl.products.remove);

// Clients
router.get("/clients", ctrl.clients.list);
router.post("/clients", auth.authCheck, ctrl.clients.create);
router.put("/clients/:id", auth.authCheck, ctrl.clients.update);
router.delete("/clients/:id", auth.authCheck, ctrl.clients.remove);

module.exports = router;

