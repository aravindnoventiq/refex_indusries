const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/products_cms');

router.get('/hero', ctrl.hero.get);
router.put('/hero', ctrl.hero.upsert);
router.get('/pages', ctrl.pages.list);
router.get('/pages/:slug', ctrl.pages.get);
router.put('/pages/:slug', ctrl.pages.upsert);

module.exports = router;
