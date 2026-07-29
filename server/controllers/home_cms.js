const { HeroSlide, Offering, Statistic, RegulatoryApproval, FlipCard, NewsItem, Award } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

exports.getAll = asyncHandler(async (req, res) => {
  const [slides, offerings, stats, regulatory, flipCards, newsItems, awards] = await Promise.all([
    HeroSlide.findAll({ order: [["order", "ASC"]] }),
    Offering.findAll({ order: [["order", "ASC"]] }),
    Statistic.findAll({ order: [["order", "ASC"]] }),
    RegulatoryApproval.findAll({ order: [["order", "ASC"]] }),
    FlipCard.findAll({ order: [["order", "ASC"]] }),
    NewsItem.findAll({ order: [["order", "ASC"]] }),
    Award.findAll({ order: [["order", "ASC"]] }),
  ]);
  return status.responseStatus(res, 200, "OK", { slides, offerings, statistics: stats, regulatory, flipCards, newsItems, awards });
});

// Generic CRUD builders
function buildCrud(Model) {
  return {
    list: asyncHandler(async (req, res) => {
      const rows = await Model.findAll({ order: [["order", "ASC"]] });
      return status.responseStatus(res, 200, "OK", rows);
    }),
    create: asyncHandler(async (req, res) => {
      const row = await Model.create(req.body);
      return status.responseStatus(res, 201, "Created", row);
    }),
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const row = await Model.findByPk(id);
      if (!row) return status.responseStatus(res, 404, "Not found");
      await row.update(req.body);
      return status.responseStatus(res, 200, "Updated", row);
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

exports.slides = buildCrud(HeroSlide);
exports.offerings = buildCrud(Offering);
exports.statistics = buildCrud(Statistic);
exports.regulatory = buildCrud(RegulatoryApproval);
exports.flipCards = buildCrud(FlipCard);
exports.newsItems = buildCrud(NewsItem);
exports.awards = buildCrud(Award);


