const status = require("../helpers/response");
const { InvestorsHero, InvestorsStockQuote, InvestorsStockChart, InvestorsHistoricalStockQuote, InvestorsRelatedLink, InvestorsKeyPersonnel, InvestorsRelatedLinksSection, InvestorsPageContent } = require("../models");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

module.exports = {
  hero: {
    get: asyncHandler(async (req, res) => {
      const hero = await InvestorsHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "Investors",
        backgroundImage: req.body.backgroundImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await InvestorsHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await InvestorsHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  stockQuote: {
    get: asyncHandler(async (req, res) => {
      const stockQuote = await InvestorsStockQuote.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", stockQuote);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "STOCK QUOTE",
        currency: req.body.currency || "Rupees",
        // Column labels
        columnCurrency: req.body.columnCurrency || "CURRENCY",
        columnPrice: req.body.columnPrice || "PRICE",
        columnBid: req.body.columnBid || "BID",
        columnOffer: req.body.columnOffer || "OFFER",
        columnChange: req.body.columnChange || "CHANGE IN (%)",
        columnVolume: req.body.columnVolume || "VOLUME",
        columnTodayOpen: req.body.columnTodayOpen || "TODAY'S OPEN",
        columnPreviousClose: req.body.columnPreviousClose || "PREVIOUS CLOSE",
        columnIntradayHigh: req.body.columnIntradayHigh || "INTRADAY HIGH",
        columnIntradayLow: req.body.columnIntradayLow || "INTRADAY LOW",
        columnWeekHigh52: req.body.columnWeekHigh52 || "52 WEEK HIGH",
        columnWeekLow52: req.body.columnWeekLow52 || "52 WEEK LOW",
        // Footer
        footerText: req.body.footerText || "Pricing delayed by 5 minutes",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await InvestorsStockQuote.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await InvestorsStockQuote.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  stockChart: {
    get: asyncHandler(async (req, res) => {
      const stockChart = await InvestorsStockChart.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", stockChart);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "STOCK CHART",
        // Filter labels
        filterToday: req.body.filterToday || "Today",
        filter5Days: req.body.filter5Days || "5 Days",
        filter1Month: req.body.filter1Month || "1 Month",
        filter3Months: req.body.filter3Months || "3 Months",
        filter6Months: req.body.filter6Months || "6 Months",
        filter1Year: req.body.filter1Year || "1 Year",
        filter3Years: req.body.filter3Years || "3 Years",
        filterYTD: req.body.filterYTD || "YTD",
        filterMAX: req.body.filterMAX || "MAX",
        filterCustom: req.body.filterCustom || "Custom",
        // Chart settings
        defaultChartType: req.body.defaultChartType || "line",
        defaultExchange: req.body.defaultExchange || "BSE",
        defaultFilter: req.body.defaultFilter || "Today",
        // API settings
        nonce: req.body.nonce || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await InvestorsStockChart.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await InvestorsStockChart.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  historicalStockQuote: {
    get: asyncHandler(async (req, res) => {
      const historicalStockQuote = await InvestorsHistoricalStockQuote.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", historicalStockQuote);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "Historical Stock Quote",
        // Column labels
        columnDate: req.body.columnDate || "DATE",
        columnOpen: req.body.columnOpen || "OPEN",
        columnHigh: req.body.columnHigh || "HIGH",
        columnLow: req.body.columnLow || "LOW",
        columnClose: req.body.columnClose || "CLOSE",
        columnVolume: req.body.columnVolume || "VOLUME",
        columnTradeValue: req.body.columnTradeValue || "TRADE VALUE",
        columnTrades: req.body.columnTrades || "No. OF TRADES",
        // Quick filter labels
        filter1M: req.body.filter1M || "1M",
        filter3M: req.body.filter3M || "3M",
        filter6M: req.body.filter6M || "6M",
        filter1Y: req.body.filter1Y || "1Y",
        // Settings
        defaultExchange: req.body.defaultExchange || "BSE",
        recordsPerPage: req.body.recordsPerPage || 10,
        // API settings
        nonce: req.body.nonce || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await InvestorsHistoricalStockQuote.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await InvestorsHistoricalStockQuote.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  relatedLinks: {
    // Get section settings
    getSection: asyncHandler(async (req, res) => {
      const section = await InvestorsRelatedLinksSection.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsertSection: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "Related Links",
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await InvestorsRelatedLinksSection.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await InvestorsRelatedLinksSection.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
    // Get all links
    getAllLinks: asyncHandler(async (req, res) => {
      const links = await InvestorsRelatedLink.findAll({
        order: [["display_order", "ASC"], ["id", "ASC"]]
      });
      return status.responseStatus(res, 200, "OK", links);
    }),
    // Create link
    createLink: asyncHandler(async (req, res) => {
      const payload = {
        name: req.body.name || "",
        href: req.body.href || "",
        displayOrder: req.body.displayOrder || 0,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const link = await InvestorsRelatedLink.create(payload);
      return status.responseStatus(res, 201, "Created", link);
    }),
    // Update link
    updateLink: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const link = await InvestorsRelatedLink.findByPk(id);
      if (!link) {
        return status.responseStatus(res, 404, "Not Found", { error: "Link not found" });
      }
      const payload = {
        name: req.body.name !== undefined ? req.body.name : link.name,
        href: req.body.href !== undefined ? req.body.href : link.href,
        displayOrder: req.body.displayOrder !== undefined ? req.body.displayOrder : link.displayOrder,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : link.isActive,
      };
      await link.update(payload);
      return status.responseStatus(res, 200, "Updated", link);
    }),
    // Delete link
    deleteLink: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const link = await InvestorsRelatedLink.findByPk(id);
      if (!link) {
        return status.responseStatus(res, 404, "Not Found", { error: "Link not found" });
      }
      await link.destroy();
      return status.responseStatus(res, 200, "Deleted", { id: parseInt(id) });
    }),
    // Get all key personnel
    getAllPersonnel: asyncHandler(async (req, res) => {
      const personnel = await InvestorsKeyPersonnel.findAll({
        order: [["display_order", "ASC"], ["id", "ASC"]]
      });
      return status.responseStatus(res, 200, "OK", personnel);
    }),
    // Create key personnel
    createPersonnel: asyncHandler(async (req, res) => {
      const payload = {
        name: req.body.name || "",
        position: req.body.position || null,
        company: req.body.company || null,
        address: req.body.address || null,
        address2: req.body.address2 || null,
        address3: req.body.address3 || null,
        phone: req.body.phone || null,
        email: req.body.email || null,
        displayOrder: req.body.displayOrder || 0,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const personnel = await InvestorsKeyPersonnel.create(payload);
      return status.responseStatus(res, 201, "Created", personnel);
    }),
    // Update key personnel
    updatePersonnel: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const personnel = await InvestorsKeyPersonnel.findByPk(id);
      if (!personnel) {
        return status.responseStatus(res, 404, "Not Found", { error: "Personnel not found" });
      }
      const payload = {
        name: req.body.name !== undefined ? req.body.name : personnel.name,
        position: req.body.position !== undefined ? req.body.position : personnel.position,
        company: req.body.company !== undefined ? req.body.company : personnel.company,
        address: req.body.address !== undefined ? req.body.address : personnel.address,
        address2: req.body.address2 !== undefined ? req.body.address2 : personnel.address2,
        address3: req.body.address3 !== undefined ? req.body.address3 : personnel.address3,
        phone: req.body.phone !== undefined ? req.body.phone : personnel.phone,
        email: req.body.email !== undefined ? req.body.email : personnel.email,
        displayOrder: req.body.displayOrder !== undefined ? req.body.displayOrder : personnel.displayOrder,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : personnel.isActive,
      };
      await personnel.update(payload);
      return status.responseStatus(res, 200, "Updated", personnel);
    }),
    // Delete key personnel
    deletePersonnel: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const personnel = await InvestorsKeyPersonnel.findByPk(id);
      if (!personnel) {
        return status.responseStatus(res, 404, "Not Found", { error: "Personnel not found" });
      }
      await personnel.destroy();
      return status.responseStatus(res, 200, "Deleted", { id: parseInt(id) });
    }),
  },
  pageContent: {
    // Get all pages
    getAll: asyncHandler(async (req, res) => {
      const pages = await InvestorsPageContent.findAll({
        order: [["created_at", "DESC"]],
      });
      return status.responseStatus(res, 200, "OK", pages);
    }),
    // Get page by slug
    getBySlug: asyncHandler(async (req, res) => {
      const { slug } = req.params;
      const page = await InvestorsPageContent.findOne({
        where: { slug },
      });
      if (!page) {
        return status.responseStatus(res, 404, "Not Found", { error: "Page not found" });
      }
      // Ensure filterItems and toggles are in camelCase format (handle both snake_case and camelCase)
      const pageData = page.toJSON ? page.toJSON() : page;
      if (pageData.filter_items && !pageData.filterItems) {
        pageData.filterItems = pageData.filter_items;
      }
      if (pageData.show_publish_date !== undefined && pageData.showPublishDate === undefined) {
        pageData.showPublishDate = pageData.show_publish_date;
      }
      if (pageData.show_cms_publish_date !== undefined && pageData.showCmsPublishDate === undefined) {
        pageData.showCmsPublishDate = pageData.show_cms_publish_date;
      }
      if (pageData.is_active !== undefined && pageData.isActive === undefined) {
        pageData.isActive = pageData.is_active;
      }
      return status.responseStatus(res, 200, "OK", pageData);
    }),
    // Create page
    create: asyncHandler(async (req, res) => {
      const { slug, title, hasYearFilter, filterItems, sections, showPublishDate, showCmsPublishDate } = req.body;
      if (!slug || !title) {
        return status.responseStatus(res, 400, "Bad Request", { error: "slug and title are required" });
      }
      const existing = await InvestorsPageContent.findOne({ where: { slug } });
      if (existing) {
        return status.responseStatus(res, 409, "Conflict", { error: "Page with this slug already exists" });
      }
      const payload = {
        slug,
        title,
        hasYearFilter: req.body.has_year_filter !== undefined ? !!req.body.has_year_filter : (hasYearFilter !== undefined ? !!hasYearFilter : false),
        filterItems: req.body.filter_items !== undefined ? req.body.filter_items : (filterItems !== undefined ? filterItems : []),
        sections: sections || [],
        showPublishDate: req.body.show_publish_date !== undefined ? !!req.body.show_publish_date : (showPublishDate !== undefined ? !!showPublishDate : false),
        showCmsPublishDate: req.body.show_cms_publish_date !== undefined ? !!req.body.show_cms_publish_date : (showCmsPublishDate !== undefined ? !!showCmsPublishDate : false),
        isActive: req.body.is_active !== undefined ? !!req.body.is_active : (req.body.isActive !== undefined ? !!req.body.isActive : true),
      };
      const page = await InvestorsPageContent.create(payload);
      return status.responseStatus(res, 201, "Created", page);
    }),
    // Update page
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      console.log('UPDATING PAGE CONTENT:', id, 'BODY:', JSON.stringify(req.body).substring(0, 500));
      const page = await InvestorsPageContent.findByPk(id);
      if (!page) {
        return status.responseStatus(res, 404, "Not Found", { error: "Page not found" });
      }
      const payload = {
        slug: req.body.slug !== undefined ? req.body.slug : page.slug,
        title: req.body.title !== undefined ? req.body.title : page.title,
        hasYearFilter: req.body.has_year_filter !== undefined ? !!req.body.has_year_filter : (req.body.hasYearFilter !== undefined ? !!req.body.hasYearFilter : page.hasYearFilter),
        filterItems: req.body.filter_items !== undefined ? req.body.filter_items : (req.body.filterItems !== undefined ? req.body.filterItems : page.filterItems),
        sections: req.body.sections !== undefined ? req.body.sections : page.sections,
        showPublishDate: req.body.show_publish_date !== undefined ? !!req.body.show_publish_date : (req.body.showPublishDate !== undefined ? !!req.body.showPublishDate : page.showPublishDate),
        showCmsPublishDate: req.body.show_cms_publish_date !== undefined ? !!req.body.show_cms_publish_date : (req.body.showCmsPublishDate !== undefined ? !!req.body.showCmsPublishDate : page.showCmsPublishDate),
        isActive: req.body.is_active !== undefined ? !!req.body.is_active : (req.body.isActive !== undefined ? !!req.body.isActive : page.isActive),
      };
      await page.update(payload);
      return status.responseStatus(res, 200, "Updated", page);
    }),
    // Delete page
    delete: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const page = await InvestorsPageContent.findByPk(id);
      if (!page) {
        return status.responseStatus(res, 404, "Not Found", { error: "Page not found" });
      }
      await page.destroy();
      return status.responseStatus(res, 200, "Deleted", { id: parseInt(id) });
    }),
  },
};

