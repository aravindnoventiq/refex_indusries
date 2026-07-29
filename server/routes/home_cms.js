const router = require("express").Router();
const ctrl = require("../controllers/home_cms");
const auth = require("../middlewares/auth");

// Aggregate fetch
router.get("/", ctrl.getAll);

// Slides (temporarily open writes)
router.get("/slides", ctrl.slides.list);
router.post("/slides", ctrl.slides.create);
router.put("/slides/:id", ctrl.slides.update);
router.delete("/slides/:id", ctrl.slides.remove);

// Offerings
router.get("/offerings", ctrl.offerings.list);
router.post("/offerings", auth.authCheck, ctrl.offerings.create);
router.put("/offerings/:id", ctrl.offerings.update);
router.delete("/offerings/:id",  ctrl.offerings.remove);

// Statistics
router.get("/statistics", ctrl.statistics.list);
router.post("/statistics",  ctrl.statistics.create);
router.put("/statistics/:id",  ctrl.statistics.update);
router.delete("/statistics/:id",  ctrl.statistics.remove);

// Regulatory
router.get("/regulatory", ctrl.regulatory.list);
router.post("/regulatory", ctrl.regulatory.create);
router.put("/regulatory/:id", ctrl.regulatory.update);
router.delete("/regulatory/:id",  ctrl.regulatory.remove);

// Flip Cards
router.get("/flip-cards", ctrl.flipCards.list);
router.post("/flip-cards", ctrl.flipCards.create);
router.put("/flip-cards/:id", ctrl.flipCards.update);
router.delete("/flip-cards/:id", ctrl.flipCards.remove);

// News Items
router.get("/news-items", ctrl.newsItems.list);
router.post("/news-items", ctrl.newsItems.create);
router.put("/news-items/:id", ctrl.newsItems.update);
router.delete("/news-items/:id", ctrl.newsItems.remove);

// Awards
router.get("/awards", ctrl.awards.list);
router.post("/awards", ctrl.awards.create);
router.put("/awards/:id", ctrl.awards.update);
router.delete("/awards/:id", ctrl.awards.remove);

module.exports = router;


