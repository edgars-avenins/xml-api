const request = require('superagent')
const fn = require('./xml2links')

function XML(req, res) {
  const validUrl = fn.validateUrl(req.body.url)

  request.get(`${validUrl}robots.txt`)
    .then(xml => fn.getSitemapLink(xml, (err, links) => {
      if (err) res.status(400).json(err)
      res.status(200).json({ links })
    }))
    .catch()
}

function XMLOrSitemap(req, res) {
  const validUrl = fn.validateUrl(req.body.url)

  request.get(`${validUrl}robots.txt`)
    .then(roboData => fn.getSitemapLink(roboData, (err, filteredData) => {
      if (err) res.status(400).json(err)

      if (filteredData.length === 1) {
        recOpenSitemaps(filteredData, res)
      } else if (req.params.full === 'full' && filteredData.length > 1) {
        recOpenAllSitemaps(filteredData, res)
      } else if (filteredData.length === 0) {
        res.status(301).json({ text: 'no sitemaps found...' })

      } else {
        res.status(200).json({ sitemaps: filteredData })
      }
    }))
    .catch(() => {
      request.get(`${validUrl}sitemap.xml`)
        .then(data => fn.dataFilter(data, filteredData[0], (err, links) => {
          res.status(200).json({ links: links })
        }))
        .catch(err => {
          console.log('Error\n\n\n\nBad request', err)
          res.status(err.status).json({ err: err.response })
        })
    })
}

function recOpenAllSitemaps(req, res) {
  const validUrl = fn.validateUrl(req.body.url)


}

function recOpenSitemaps(data, res, sitemap = [data[0]]) {
  request.get(data[0])
    .then(xml => fn.dataFilter(xml, data[0], (err, links) => {
      //refactor into recursive function ???
      if (links.isXML) {
        sitemap.push(links.dataArray[0])
        recOpenSitemaps(links.dataArray, res, sitemap)
      } else {
        links.sitemapTree = sitemap
        res.status(200).json({ links: links })
      }
    }))
}


module.exports = {
  XML,
  XMLOrSitemap
}