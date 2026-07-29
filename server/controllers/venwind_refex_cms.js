const status = require("../helpers/response");
const { VenwindRefexHero, VenwindRefexWhoWeAre, VenwindRefexWhyChooseUs, VenwindRefexTechnicalSpec, VenwindRefexVisitWebsite } = require("../models");

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
      const hero = await VenwindRefexHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        description: req.body.description || null,
        backgroundImage: req.body.backgroundImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await VenwindRefexHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await VenwindRefexHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  whoWeAre: {
    get: asyncHandler(async (req, res) => {
      const section = await VenwindRefexWhoWeAre.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || null,
        mainImage: req.body.mainImage || null,
        smallImage: req.body.smallImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await VenwindRefexWhoWeAre.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await VenwindRefexWhoWeAre.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  whyChooseUs: buildCrud(
    VenwindRefexWhyChooseUs,
    (b) => ({
      title: b.title || "",
      description: b.description || null,
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  technicalSpecs: buildCrud(
    VenwindRefexTechnicalSpec,
    (b) => ({
      value: b.value || "",
      label: b.label || "",
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  visitWebsite: {
    get: asyncHandler(async (req, res) => {
      const section = await VenwindRefexVisitWebsite.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        buttonText: req.body.buttonText || null,
        buttonLink: req.body.buttonLink || null,
        backgroundImage: req.body.backgroundImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await VenwindRefexVisitWebsite.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await VenwindRefexVisitWebsite.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
};

