const express = require('express');
const router = express.Router();
const request = require('superagent')
const fn = require('../public/javascripts/xml2links')

/* GET home page. */
router.get('/xml/:url', (req, res, next) => {
  request.get(`${fn.validateUrl(req.params.url)}robots.txt`)
    .then(roboData => fn.getSitemapLink(roboData, filteredData => {
      if(filteredData.length === 1){
        console.log(filteredData)
        request.get(filteredData[0])
          .then(xml => fn.dataFilter(xml, filteredData[0], links => {
            res.status(200).json({links: links})
          }))
      }else{
        res.status(200).json({ sitemaps: filteredData })
      }
    }))
    .catch(err => {
      console.log('Error\n\n\n\nBad request',err)
      res.status(err.status).json({err: err.response})
    })
});

module.exports = router;
