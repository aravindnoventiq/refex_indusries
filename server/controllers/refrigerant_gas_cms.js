const status = require("../helpers/response");
const { RefrigerantGasHero, RefrigerantGasWhoWeAre, RefrigerantGasWhyChooseUs, RefrigerantGasProductTab, RefrigerantGasProductTabPoint, RefrigerantGasImpact, RefrigerantGasProduct, RefrigerantGasClient } = require("../models");

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
      const hero = await RefrigerantGasHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        subtitle: req.body.subtitle || null,
        slides: Array.isArray(req.body.slides) ? req.body.slides : (req.body.slides ? (() => { try { return JSON.parse(req.body.slides); } catch { return []; } })() : []),
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await RefrigerantGasHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await RefrigerantGasHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  whoWeAre: {
    get: asyncHandler(async (req, res) => {
      const section = await RefrigerantGasWhoWeAre.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || null,
        mainImage: req.body.mainImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await RefrigerantGasWhoWeAre.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await RefrigerantGasWhoWeAre.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  whyChooseUs: buildCrud(
    RefrigerantGasWhyChooseUs,
    (b) => ({
      title: b.title || "",
      description: b.description || null,
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  productTabs: buildCrud(
    RefrigerantGasProductTab,
    (b) => ({
      tabId: b.tabId || "",
      label: b.label || "",
      image: b.image || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  productTabPoints: buildCrud(
    RefrigerantGasProductTabPoint,
    (b) => ({
      tabId: b.tabId || "",
      title: b.title || null,
      description: b.description || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  impacts: buildCrud(
    RefrigerantGasImpact,
    (b) => ({
      title: b.title || "",
      description: b.description || null,
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  products: buildCrud(
    RefrigerantGasProduct,
    (b) => ({
      image: b.image || "",
      name: b.name || "",
      link: b.link || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  clients: buildCrud(
    RefrigerantGasClient,
    (b) => ({
      image: b.image || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
};

