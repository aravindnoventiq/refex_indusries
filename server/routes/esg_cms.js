const router = require("express").Router();
const ctrl = require("../controllers/esg_cms");
const auth = require("../middlewares/auth");

// Hero
router.get("/hero", ctrl.hero.get);
router.put("/hero", auth.authCheck, ctrl.hero.upsert);

// Refex on ESG
router.get("/refex-on-esg", ctrl.refexOnEsg.get);
router.put("/refex-on-esg", auth.authCheck, ctrl.refexOnEsg.upsert);

// Sustainable Business
router.get("/sustainable-business", ctrl.sustainableBusiness.get);
router.put("/sustainable-business", auth.authCheck, ctrl.sustainableBusiness.upsert);

// Policies Section Header
router.get("/policies-section", ctrl.policiesSection.get);
router.put("/policies-section", auth.authCheck, ctrl.policiesSection.upsert);

// Policies
router.get("/policies", ctrl.policies.list);
router.post("/policies", auth.authCheck, ctrl.policies.create);
router.put("/policies/:id", auth.authCheck, ctrl.policies.update);
router.delete("/policies/:id", auth.authCheck, ctrl.policies.remove);

// Reports Section Header
router.get("/reports-section", ctrl.reportsSection.get);
router.put("/reports-section", auth.authCheck, ctrl.reportsSection.upsert);

// Reports
router.get("/reports", ctrl.reports.list);
router.post("/reports", auth.authCheck, ctrl.reports.create);
router.put("/reports/:id", auth.authCheck, ctrl.reports.update);
router.delete("/reports/:id", auth.authCheck, ctrl.reports.remove);

// Programs Section Header
router.get("/programs-section", ctrl.programsSection.get);
router.put("/programs-section", auth.authCheck, ctrl.programsSection.upsert);

// Programs
router.get("/programs", ctrl.programs.list);
router.post("/programs", auth.authCheck, ctrl.programs.create);
router.put("/programs/:id", auth.authCheck, ctrl.programs.update);
router.delete("/programs/:id", auth.authCheck, ctrl.programs.remove);

// SDG Section
router.get("/sdg-section", ctrl.sdgSection.get);
router.put("/sdg-section", auth.authCheck, ctrl.sdgSection.upsert);

// UN SDG Actions Section Header
router.get("/unsdg-actions-section", ctrl.unsdgActionsSection.get);
router.put("/unsdg-actions-section", auth.authCheck, ctrl.unsdgActionsSection.upsert);

// UN SDG Actions
router.get("/unsdg-actions", ctrl.unsdgActions.list);
router.post("/unsdg-actions", auth.authCheck, ctrl.unsdgActions.create);
router.put("/unsdg-actions/:id", auth.authCheck, ctrl.unsdgActions.update);
router.delete("/unsdg-actions/:id", auth.authCheck, ctrl.unsdgActions.remove);

// Awards Section Header
router.get("/awards-section", ctrl.awardsSection.get);
router.put("/awards-section", auth.authCheck, ctrl.awardsSection.upsert);

// Awards
router.get("/awards", ctrl.awards.list);
router.post("/awards", auth.authCheck, ctrl.awards.create);
router.put("/awards/:id", auth.authCheck, ctrl.awards.update);
router.delete("/awards/:id", auth.authCheck, ctrl.awards.remove);

// Collaboration Section Header
router.get("/collaboration-section", ctrl.collaborationSection.get);
router.put("/collaboration-section", auth.authCheck, ctrl.collaborationSection.upsert);

// Main Collaboration
router.get("/main-collaboration", ctrl.mainCollaboration.get);
router.put("/main-collaboration", auth.authCheck, ctrl.mainCollaboration.upsert);

// Developmental Organizations Section Header
router.get("/developmental-orgs-section", ctrl.developmentalOrgsSection.get);
router.put("/developmental-orgs-section", auth.authCheck, ctrl.developmentalOrgsSection.upsert);

// Developmental Organizations
router.get("/developmental-orgs", ctrl.developmentalOrgs.list);
router.post("/developmental-orgs", auth.authCheck, ctrl.developmentalOrgs.create);
router.put("/developmental-orgs/:id", auth.authCheck, ctrl.developmentalOrgs.update);
router.delete("/developmental-orgs/:id", auth.authCheck, ctrl.developmentalOrgs.remove);

// Governance Section Header
router.get("/governance-section", ctrl.governanceSection.get);
router.put("/governance-section", auth.authCheck, ctrl.governanceSection.upsert);

// Governance Items
router.get("/governance-items", ctrl.governanceItems.list);
router.post("/governance-items", auth.authCheck, ctrl.governanceItems.create);
router.put("/governance-items/:id", auth.authCheck, ctrl.governanceItems.update);
router.delete("/governance-items/:id", auth.authCheck, ctrl.governanceItems.remove);

// HR Section Header
router.get("/hr-section", ctrl.hrSection.get);
router.put("/hr-section", auth.authCheck, ctrl.hrSection.upsert);

// HR Items
router.get("/hr-items", ctrl.hrItems.list);
router.post("/hr-items", auth.authCheck, ctrl.hrItems.create);
router.put("/hr-items/:id", auth.authCheck, ctrl.hrItems.update);
router.delete("/hr-items/:id", auth.authCheck, ctrl.hrItems.remove);

module.exports = router;

