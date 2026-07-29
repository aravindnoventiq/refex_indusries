const status = require("../helpers/response");
const { EsgHero, EsgRefexOnEsg, EsgSustainableBusiness, EsgPolicy, EsgPoliciesSection, EsgReport, EsgReportsSection, EsgProgram, EsgProgramsSection, EsgSdgSection, EsgUnsdgAction, EsgUnsdgActionsSection, EsgAward, EsgAwardsSection, EsgCollaborationSection, EsgMainCollaboration, EsgDevelopmentalOrgsSection, EsgDevelopmentalOrg, EsgGovernanceSection, EsgGovernanceItem, EsgHrSection, EsgHrItem } = require("../models");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

function buildCrud(Model, mapIn, mapOut) {
  return {
    list: asyncHandler(async (req, res) => {
      const rows = await Model.findAll({ order: [["order", "ASC"]] });
      return status.responseStatus(res, 200, "OK", rows.map((r) => (mapOut ? mapOut(r.toJSON()) : r)));
    }),
    create: asyncHandler(async (req, res) => {
      const row = await Model.create(mapIn ? mapIn(req.body || {}) : req.body || {});
      return status.responseStatus(res, 201, "Created", mapOut ? mapOut(row.toJSON()) : row);
    }),
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const row = await Model.findByPk(id);
      if (!row) return status.responseStatus(res, 404, "Not found");
      await row.update(mapIn ? mapIn(req.body || {}) : req.body || {});
      return status.responseStatus(res, 200, "Updated", mapOut ? mapOut(row.toJSON()) : row);
    }),
    remove: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const row = await Model.findByPk(id);
      if (!row) return status.responseStatus(res, 404, "Not found");
      await row.destroy();
      return status.responseStatus(res, 200, "Deleted");
    }),
  };
}

module.exports = {
  hero: {
    get: asyncHandler(async (req, res) => {
      const hero = await EsgHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        description1: req.body.description1 || null,
        description2: req.body.description2 || null,
        backgroundImage: req.body.backgroundImage || null,
        button1Text: req.body.button1Text || null,
        button1Link: req.body.button1Link || null,
        button2Text: req.body.button2Text || null,
        button2Link: req.body.button2Link || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  refexOnEsg: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgRefexOnEsg.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || null,
        image: req.body.image || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgRefexOnEsg.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgRefexOnEsg.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  sustainableBusiness: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgSustainableBusiness.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || null,
        image: req.body.image || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgSustainableBusiness.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgSustainableBusiness.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  policiesSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgPoliciesSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        description: req.body.description || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgPoliciesSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgPoliciesSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  policies: buildCrud(
    EsgPolicy,
    (b) => ({
      title: b.title || "",
      image: b.image || "",
      link: b.link || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  reportsSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgReportsSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgReportsSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgReportsSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  reports: buildCrud(
    EsgReport,
    (b) => ({
      title: b.title || "",
      image: b.image || "",
      link: b.link || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  programsSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgProgramsSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgProgramsSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgProgramsSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  programs: buildCrud(
    EsgProgram,
    (b) => ({
      title: b.title || "",
      image: b.image || "",
      content: b.content || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  sdgSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgSdgSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || null,
        image: req.body.image || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgSdgSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgSdgSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  unsdgActionsSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgUnsdgActionsSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgUnsdgActionsSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgUnsdgActionsSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  unsdgActions: buildCrud(
    EsgUnsdgAction,
    (b) => ({
      icon: b.icon || "",
      title: b.title || "",
      points: Array.isArray(b.points) ? b.points : [],
      video: b.video || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  awardsSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgAwardsSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgAwardsSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgAwardsSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  awards: buildCrud(
    EsgAward,
    (b) => ({
      image: b.image || "",
      title: b.title || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  collaborationSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgCollaborationSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgCollaborationSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgCollaborationSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  mainCollaboration: {
    get: asyncHandler(async (req, res) => {
      const collaboration = await EsgMainCollaboration.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", collaboration);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        logo: req.body.logo || "",
        content: req.body.content || null,
        largeImage: req.body.largeImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgMainCollaboration.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgMainCollaboration.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  developmentalOrgsSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgDevelopmentalOrgsSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgDevelopmentalOrgsSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgDevelopmentalOrgsSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  developmentalOrgs: buildCrud(
    EsgDevelopmentalOrg,
    (b) => ({
      title: b.title || "",
      logo: b.logo || "",
      content: b.content || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  governanceSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgGovernanceSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgGovernanceSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgGovernanceSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  governanceItems: buildCrud(
    EsgGovernanceItem,
    (b) => ({
      title: b.title || "",
      link: b.link || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  hrSection: {
    get: asyncHandler(async (req, res) => {
      const section = await EsgHrSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await EsgHrSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await EsgHrSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  hrItems: buildCrud(
    EsgHrItem,
    (b) => ({
      title: b.title || "",
      link: b.link || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
};

