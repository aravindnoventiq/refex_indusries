const router = require("express").Router();
const ctrl = require("../controllers/newsroom_cms");
const auth = require("../middlewares/auth");

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, ctrl.hero.upsert);

// Press Releases
router.get("/press-releases", ctrl.pressReleases.list);
router.post("/press-releases", auth.authCheck, ctrl.pressReleases.create);
router.put("/press-releases/:id", auth.authCheck, ctrl.pressReleases.update);
router.delete("/press-releases/:id", auth.authCheck, ctrl.pressReleases.remove);

// Events
router.get("/events", ctrl.events.list);
router.post("/events", auth.authCheck, ctrl.events.create);
router.put("/events/:id", auth.authCheck, ctrl.events.update);
router.delete("/events/:id", auth.authCheck, ctrl.events.remove);

// Tabs
router.get("/tabs", ctrl.tabs.list);
router.post("/tabs", auth.authCheck, ctrl.tabs.create);
router.put("/tabs/:id", auth.authCheck, ctrl.tabs.update);
router.delete("/tabs/:id", auth.authCheck, ctrl.tabs.remove);

module.exports = router;

