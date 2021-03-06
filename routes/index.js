const express = require('express');
const { XML, XMLOrSitemap, sitemap } = require('../public/javascripts/utils');
const router = express.Router();


/* GET home page. */
//Get XML sitemaps links only
router.get('/xml', XML)
//Get sitemap links from a provided xml link
router.get('/sitemap', sitemap)
//If there is 1 link auto expand it
//otherwise same as 1st route
router.get('/xml/auto', XMLOrSitemap)
//Open all xml links and construct and object with all the data
router.get('/xml/auto/:full', XMLOrSitemap)

module.exports = router;
