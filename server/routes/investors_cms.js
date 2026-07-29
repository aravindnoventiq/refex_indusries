const router = require("express").Router();
const ctrl = require("../controllers/investors_cms");
const auth = require("../middlewares/auth");
const { User } = require("../models");
const Response = require("../helpers/response");

// Middleware to check if user has access (Admin, CHRO, HR, or InvestorsCMS)
const checkInvestorsCMSAccess = async (req, res, next) => {
  try {
    const data = req.userData;
    if (!data || !data.id) {
      return Response.responseStatus(res, 401, "Authentication required");
    }

    const user = await User.findByPk(data.id);
    
    if (!user) {
      return Response.responseStatus(res, 401, "Invalid Token");
    }

    // Allow Admin, CHRO, HR, and InvestorsCMS users
    const allowedTypes = ["Admin", "CHRO", "HR", "InvestorsCMS"];
    if (!allowedTypes.includes(user.user_type)) {
      return Response.responseStatus(res, 403, "You don't have permission to access this resource");
    }

    return next();
  } catch (error) {
    return Response.responseStatus(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, checkInvestorsCMSAccess, ctrl.hero.upsert);

// Stock Quote
router.get("/stock-quote", ctrl.stockQuote.get);
router.put("/stock-quote", auth.authCheck, checkInvestorsCMSAccess, ctrl.stockQuote.upsert);

// Stock Chart
router.get("/stock-chart", ctrl.stockChart.get);
router.put("/stock-chart", auth.authCheck, checkInvestorsCMSAccess, ctrl.stockChart.upsert);

// Historical Stock Quote
router.get("/historical-stock-quote", ctrl.historicalStockQuote.get);
router.put("/historical-stock-quote", auth.authCheck, checkInvestorsCMSAccess, ctrl.historicalStockQuote.upsert);

// Related Links Section
router.get("/related-links/section", ctrl.relatedLinks.getSection);
router.put("/related-links/section", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.upsertSection);

// Related Links
router.get("/related-links", ctrl.relatedLinks.getAllLinks);
router.post("/related-links", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.createLink);
router.put("/related-links/:id", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.updateLink);
router.delete("/related-links/:id", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.deleteLink);

// Key Personnel
router.get("/key-personnel", ctrl.relatedLinks.getAllPersonnel);
router.post("/key-personnel", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.createPersonnel);
router.put("/key-personnel/:id", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.updatePersonnel);
router.delete("/key-personnel/:id", auth.authCheck, checkInvestorsCMSAccess, ctrl.relatedLinks.deletePersonnel);

// Investor Page Content
router.get("/page-content", ctrl.pageContent.getAll);
router.get("/page-content/slug/:slug", ctrl.pageContent.getBySlug);
router.post("/page-content", auth.authCheck, checkInvestorsCMSAccess, ctrl.pageContent.create);
router.put("/page-content/:id", auth.authCheck, checkInvestorsCMSAccess, ctrl.pageContent.update);
router.delete("/page-content/:id", auth.authCheck, checkInvestorsCMSAccess, ctrl.pageContent.delete);

module.exports = router;

