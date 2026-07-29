const status = require("../helpers/response");
const { AshUtilizationHero, AshUtilizationWhoWeAre, AshUtilizationFeature, AshUtilizationImpact, AshUtilizationService, AshUtilizationClient } = require("../models");

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
      const hero = await AshUtilizationHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        subtitle: req.body.subtitle || null,
        slides: Array.isArray(req.body.slides) ? req.body.slides : (req.body.slides ? (() => { try { return JSON.parse(req.body.slides); } catch { return []; } })() : []),
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await AshUtilizationHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await AshUtilizationHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  whoWeAre: {
    get: asyncHandler(async (req, res) => {
      const section = await AshUtilizationWhoWeAre.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || "",
        slides: Array.isArray(req.body.slides) ? req.body.slides : (req.body.slides ? (() => { try { return JSON.parse(req.body.slides); } catch { return []; } })() : []),
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await AshUtilizationWhoWeAre.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await AshUtilizationWhoWeAre.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  features: buildCrud(
    AshUtilizationFeature,
    (b) => ({
      title: b.title || "",
      description: b.description || "",
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  impacts: buildCrud(
    AshUtilizationImpact,
    (b) => ({
      number: b.number || "",
      label: b.label || "",
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  services: buildCrud(
    AshUtilizationService,
    (b) => ({
      title: b.title || "",
      image: b.image || null,
      imagePosition: b.imagePosition === 'right' ? 'right' : 'left',
      intro: b.intro || null,
      subtitle: b.subtitle || null,
      pointsJson: Array.isArray(b.pointsJson) ? b.pointsJson : (b.pointsJson ? (() => { try { return JSON.parse(b.pointsJson); } catch { return []; } })() : []),
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  clients: buildCrud(
    AshUtilizationClient,
    (b) => ({
      category: ['thermal', 'cement', 'concessionaires'].includes(b.category) ? b.category : 'thermal',
      image: b.image || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
};

