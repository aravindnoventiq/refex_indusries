const status = require("../helpers/response");
const { NewsroomHero, PressRelease, NewsroomEvent, NewsroomTab } = require("../models");
const { Op } = require("sequelize");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

function buildCrud(Model, mapIn, mapOut) {
  return {
    list: asyncHandler(async (req, res) => {
      const rows = await Model.findAll({ order: [["order", "ASC"], ["date", "DESC"]] });
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
      const hero = await NewsroomHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        description: req.body.description || null,
        backgroundImage: req.body.backgroundImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await NewsroomHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await NewsroomHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  pressReleases: buildCrud(
    PressRelease,
    (b) => ({
      title: b.title || "",
      date: b.date || "",
      source: b.source || "",
      image: b.image || "",
      link: b.link || "",
      isVideo: b.isVideo === true,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  events: buildCrud(
    NewsroomEvent,
    (b) => ({
      title: b.title || "",
      date: b.date || "",
      source: b.source || "",
      image: b.image || "",
      link: b.link || "",
      category: b.category || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  tabs: {
    list: asyncHandler(async (req, res) => {
      const tabs = await NewsroomTab.findAll({ order: [["order", "ASC"]] });
      return status.responseStatus(res, 200, "OK", tabs);
    }),
    create: asyncHandler(async (req, res) => {
      const payload = {
        key: req.body.key || "",
        label: req.body.label || "",
        order: req.body.order || 0,
        isActive: req.body.isActive !== false,
        isDefault: req.body.isDefault === true,
      };
      
      // If this is set as default, unset all other defaults
      if (payload.isDefault) {
        await NewsroomTab.update({ isDefault: false }, { where: {} });
      }
      
      const tab = await NewsroomTab.create(payload);
      return status.responseStatus(res, 201, "Created", tab);
    }),
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const tab = await NewsroomTab.findByPk(id);
      if (!tab) return status.responseStatus(res, 404, "Not found");
      
      const payload = {
        key: req.body.key || tab.key,
        label: req.body.label || tab.label,
        order: req.body.order !== undefined ? req.body.order : tab.order,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : tab.isActive,
        isDefault: req.body.isDefault !== undefined ? !!req.body.isDefault : tab.isDefault,
      };
      
      // If this is set as default, unset all other defaults
      if (payload.isDefault && !tab.isDefault) {
        await NewsroomTab.update({ isDefault: false }, { where: { id: { [Op.ne]: id } } });
      }
      
      await tab.update(payload);
      return status.responseStatus(res, 200, "Updated", tab);
    }),
    remove: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const tab = await NewsroomTab.findByPk(id);
      if (!tab) return status.responseStatus(res, 404, "Not found");
      await tab.destroy();
      return status.responseStatus(res, 200, "Deleted");
    }),
  },
};

